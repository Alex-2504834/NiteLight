const NITELIGHT_NEWS_ENDPOINT =
  "https://nitelightcic.co.uk/wp-json/wp/v2/posts?per_page=6&_fields=id,date,link,title,excerpt,featured_media";

const NITELIGHT_MEDIA_ENDPOINT =
  "https://nitelightcic.co.uk/wp-json/wp/v2/media";

const NITELIGHT_SITE_ORIGIN = "https://nitelightcic.co.uk";

export const NITELIGHT_NEWS_URL = `${NITELIGHT_SITE_ORIGIN}/news/`;

export type NewsArticle = {
  id: number;
  title: string;
  summary: string;
  publishedAt: string;
  url: string;
  imageUrl: string | null;
};

type WordPressRenderedText = {
  rendered?: unknown;
};

type WordPressPost = {
  id?: unknown;
  date?: unknown;
  link?: unknown;
  title?: WordPressRenderedText;
  excerpt?: WordPressRenderedText;
  featured_media?: unknown;
};

type WordPressMediaSize = {
  source_url?: unknown;
};

type WordPressMedia = {
  source_url?: unknown;
  media_details?: {
    sizes?: Record<string, WordPressMediaSize>;
  };
};

type ParsedPost = Omit<NewsArticle, "imageUrl"> & {
  featuredMediaId: number | null;
};

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    laquo: "«",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    mdash: "—",
    nbsp: " ",
    ndash: "–",
    quot: '"',
    raquo: "»",
    rdquo: "”",
    rsquo: "’",
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    const normalizedEntity = String(entity).toLowerCase();

    if (normalizedEntity.startsWith("#x")) {
      const codePoint = Number.parseInt(normalizedEntity.slice(2), 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    if (normalizedEntity.startsWith("#")) {
      const codePoint = Number.parseInt(normalizedEntity.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    return namedEntities[normalizedEntity] ?? match;
  });
}

function cleanWordPressText(value: unknown) {
  if (typeof value !== "string") return "";

  return decodeHtmlEntities(
    value
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function parsePost(post: WordPressPost): ParsedPost | null {
  const id = typeof post.id === "number" ? post.id : null;
  const title = cleanWordPressText(post.title?.rendered);
  const summary = cleanWordPressText(post.excerpt?.rendered);
  const publishedAt = typeof post.date === "string" ? post.date : "";
  const url = typeof post.link === "string" ? post.link.trim() : "";
  const featuredMediaId =
    typeof post.featured_media === "number" && post.featured_media > 0
      ? post.featured_media
      : null;

  if (id === null || !title || !url) return null;

  return {
    id,
    title,
    summary,
    publishedAt,
    url,
    featuredMediaId,
  };
}

function readMediaUrl(media: WordPressMedia) {
  const sizes = media.media_details?.sizes;
  const candidate =
    media.source_url ??
    sizes?.large?.source_url ??
    sizes?.medium_large?.source_url ??
    sizes?.medium?.source_url;

  return typeof candidate === "string" && candidate.trim().length > 0
    ? candidate.trim()
    : null;
}

function canonicaliseUrl(value: string) {
  return decodeHtmlEntities(value)
    .trim()
    .replace(/^\/\//, "https://")
    .split("#")[0]
    .split("?")[0]
    .replace(/\/+$/, "")
    .toLowerCase();
}

function resolveSiteUrl(value: string) {
  const decoded = decodeHtmlEntities(value).trim();

  if (!decoded || decoded.startsWith("data:")) return null;
  if (decoded.startsWith("//")) return `https:${decoded}`;
  if (decoded.startsWith("/")) return `${NITELIGHT_SITE_ORIGIN}${decoded}`;
  if (/^https?:\/\//i.test(decoded)) return decoded;

  return `${NITELIGHT_SITE_ORIGIN}/${decoded.replace(/^\.\//, "")}`;
}

function readAttribute(tag: string, attribute: string) {
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(
    new RegExp(`${escapedAttribute}\\s*=\\s*["']([^"']+)["']`, "i")
  );

  return match?.[1] ?? null;
}

function readLargestSrcsetUrl(value: string) {
  const candidates = decodeHtmlEntities(value)
    .split(",")
    .map(entry => entry.trim())
    .map(entry => {
      const parts = entry.split(/\s+/);
      const descriptor = parts[1] ?? "";
      const width = descriptor.endsWith("w")
        ? Number.parseInt(descriptor.slice(0, -1), 10)
        : 0;

      return { url: parts[0], width: Number.isFinite(width) ? width : 0 };
    })
    .filter(candidate => candidate.url);

  candidates.sort((a, b) => b.width - a.width);
  return candidates[0]?.url ?? null;
}

function isUsableNewsImage(value: string | null) {
  if (!value) return false;

  const normalized = value.toLowerCase();
  return (
    !normalized.startsWith("data:") &&
    !normalized.includes("transparent") &&
    !normalized.includes("placeholder") &&
    !normalized.includes("spacer.gif") &&
    !normalized.includes("favicon")
  );
}

function readListingImage(block: string) {
  const imageTags = block.match(/<img\b[^>]*>/gi) ?? [];

  for (const tag of imageTags) {
    const srcset =
      readAttribute(tag, "data-srcset") ?? readAttribute(tag, "srcset");
    const srcsetUrl = srcset ? readLargestSrcsetUrl(srcset) : null;
    const directUrl =
      readAttribute(tag, "data-lazy-src") ??
      readAttribute(tag, "data-src") ??
      readAttribute(tag, "src");
    const candidate = srcsetUrl ?? directUrl;

    if (isUsableNewsImage(candidate)) {
      return resolveSiteUrl(candidate as string);
    }
  }

  const backgroundMatch = block.match(
    /(?:background-image\s*:\s*url\(|data-bg\s*=\s*["']|data-background-image\s*=\s*["'])\s*["']?([^"')]+)["']?/i
  );
  const backgroundUrl = backgroundMatch?.[1] ?? null;

  return isUsableNewsImage(backgroundUrl)
    ? resolveSiteUrl(backgroundUrl as string)
    : null;
}

function readNewsPageImages(html: string, posts: ParsedPost[]) {
  const images = new Map<string, string>();

  for (const post of posts) {
    const canonicalPostUrl = canonicaliseUrl(post.url);
    const rawPostUrl = post.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pathOnly = post.url
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const postLinkPattern = new RegExp(
      `href\\s*=\\s*["'](?:${rawPostUrl}|${pathOnly})["']`,
      "gi"
    );

    for (const match of html.matchAll(postLinkPattern)) {
      const linkIndex = match.index ?? -1;
      if (linkIndex < 0) continue;

      const articleStart = html.lastIndexOf("<article", linkIndex);
      const articleEnd = html.indexOf("</article>", linkIndex);

      if (articleStart < 0 || articleEnd <= linkIndex) continue;

      const block = html.slice(articleStart, articleEnd + "</article>".length);
      const imageUrl = readListingImage(block);

      if (imageUrl) {
        images.set(canonicalPostUrl, imageUrl);
        break;
      }
    }
  }

  return images;
}

async function getNewsListingImages(posts: ParsedPost[], signal?: AbortSignal) {
  try {
    const response = await fetch(NITELIGHT_NEWS_URL, {
      headers: { Accept: "text/html" },
      signal,
    });

    if (!response.ok) return new Map<string, string>();

    const html = await response.text();
    return readNewsPageImages(html, posts);
  } catch (error) {
    if (signal?.aborted) throw error;
    console.warn("Could not load images from the NiteLight news page:", error);
    return new Map<string, string>();
  }
}

async function getFeaturedMediaUrl(mediaId: number, signal?: AbortSignal) {
  const response = await fetch(
    `${NITELIGHT_MEDIA_ENDPOINT}/${mediaId}?_fields=source_url,media_details`,
    {
      headers: { Accept: "application/json" },
      signal,
    }
  );

  if (!response.ok) return null;

  const body: unknown = await response.json();

  if (!body || typeof body !== "object") return null;

  return readMediaUrl(body as WordPressMedia);
}

export async function getNiteLightNews(signal?: AbortSignal) {
  const response = await fetch(NITELIGHT_NEWS_ENDPOINT, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`News request failed with status ${response.status}`);
  }

  const body: unknown = await response.json();

  if (!Array.isArray(body)) {
    throw new Error("The news service returned an unexpected response.");
  }

  const posts = body
    .map(post => parsePost(post as WordPressPost))
    .filter((post): post is ParsedPost => Boolean(post));

  const [listingImages, mediaEntries] = await Promise.all([
    getNewsListingImages(posts, signal),
    Promise.all(
      [
        ...new Set(
          posts
            .map(post => post.featuredMediaId)
            .filter((mediaId): mediaId is number => mediaId !== null)
        ),
      ].map(async mediaId => {
        try {
          const imageUrl = await getFeaturedMediaUrl(mediaId, signal);
          return [mediaId, imageUrl] as const;
        } catch (error) {
          if (signal?.aborted) throw error;
          console.warn(`Could not load featured image ${mediaId}:`, error);
          return [mediaId, null] as const;
        }
      })
    ),
  ]);

  const mediaUrls = new Map<number, string | null>(mediaEntries);

  return posts.map(({ featuredMediaId, ...post }) => ({
    ...post,
    imageUrl:
      listingImages.get(canonicaliseUrl(post.url)) ??
      (featuredMediaId === null ? null : mediaUrls.get(featuredMediaId) ?? null),
  }));
}
