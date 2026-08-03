import { Image } from "react-native";

import { apiFetch } from "./api";

export type PlacePhoto = {
  uri: string;
  attributions?: string[];
};

export type PlaceDetails = {
  id: string;
  name?: string;
  formattedAddress?: string;
  phoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
  openNow?: boolean;
  nextOpenTime?: string;
  nextCloseTime?: string;
  weekdayDescriptions?: string[];
  photoUri?: string;
  photoAttributions?: string[];
  photos?: PlacePhoto[];
};

type CachedPlaceDetails = {
  details: PlaceDetails;
  expiresAt: number;
};

const PLACE_DETAILS_CACHE_MS = 15 * 60 * 1000;
const pendingPlaceDetailRequests = new Map<string, Promise<PlaceDetails>>();
const placeDetailsCache = new Map<string, CachedPlaceDetails>();

function getCachedPlaceDetails(placeId: string) {
  const cached = placeDetailsCache.get(placeId);

  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    placeDetailsCache.delete(placeId);
    return null;
  }

  return cached.details;
}

function normalisePhotoAttributions(value: unknown) {
  if (!Array.isArray(value)) return undefined;

  const attributions = value
    .map(item => {
      if (typeof item === "string") return item;
      if (typeof item === "object" && item !== null) {
        if ("displayName" in item && typeof item.displayName === "string") {
          return item.displayName;
        }
        if ("text" in item && typeof item.text === "string") return item.text;
      }
      return null;
    })
    .filter((item): item is string => Boolean(item));

  return attributions.length ? attributions : undefined;
}

function normalisePlaceDetails(rawDetails: PlaceDetails & Record<string, unknown>): PlaceDetails {
  const rawPhotos = Array.isArray(rawDetails.photos)
    ? rawDetails.photos
    : Array.isArray(rawDetails.photoUris)
    ? rawDetails.photoUris
    : [];

  const photos = rawPhotos
    .map<PlacePhoto | null>(photo => {
      if (typeof photo === "string") return { uri: photo };
      if (typeof photo !== "object" || photo === null) return null;

      const candidate = photo as Record<string, unknown>;
      const uri = [candidate.uri, candidate.photoUri, candidate.url]
        .find(value => typeof value === "string");

      if (typeof uri !== "string") return null;

      return {
        uri,
        attributions: normalisePhotoAttributions(
          candidate.attributions ?? candidate.authorAttributions
        ),
      };
    })
    .filter((photo): photo is PlacePhoto => Boolean(photo));

  if (rawDetails.photoUri && !photos.some(photo => photo.uri === rawDetails.photoUri)) {
    photos.unshift({
      uri: rawDetails.photoUri,
      attributions: rawDetails.photoAttributions,
    });
  }

  return {
    ...rawDetails,
    photos,
    photoUri: rawDetails.photoUri ?? photos[0]?.uri,
    photoAttributions:
      rawDetails.photoAttributions ?? photos[0]?.attributions,
  };
}

function cachePlaceDetails(placeId: string, details: PlaceDetails) {
  placeDetailsCache.set(placeId, {
    details,
    expiresAt: Date.now() + PLACE_DETAILS_CACHE_MS,
  });

  details.photos?.slice(0, 4).forEach(photo => {
    Image.prefetch(photo.uri).catch(() => undefined);
  });

  if (!details.photos?.length && details.photoUri) {
    Image.prefetch(details.photoUri).catch(() => undefined);
  }
}

export async function getGooglePlaceDetails(placeId: string) {
  const cachedDetails = getCachedPlaceDetails(placeId);

  if (cachedDetails) {
    return cachedDetails;
  }

  const existingRequest = pendingPlaceDetailRequests.get(placeId);

  if (existingRequest) {
    return existingRequest;
  }

  const encodedPlaceId = encodeURIComponent(placeId);
  const request = (apiFetch(`/places/google-details/${encodedPlaceId}`, {
    requireAuth: false,
  }) as Promise<PlaceDetails & Record<string, unknown>>).then(rawDetails => {
    const details = normalisePlaceDetails(rawDetails);
    cachePlaceDetails(placeId, details);
    return details;
  });

  pendingPlaceDetailRequests.set(placeId, request);

  try {
    return await request;
  } finally {
    pendingPlaceDetailRequests.delete(placeId);
  }
}

export function clearPlaceDetailsCache() {
  placeDetailsCache.clear();
  pendingPlaceDetailRequests.clear();
}
