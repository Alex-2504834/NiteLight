import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { seedPlaces } from "../dev/seedPlaces";
import { createTestPaymentSheet } from "../services/payments";
import {
  getNiteLightNews,
  NITELIGHT_NEWS_URL,
  type NewsArticle,
} from "../services/news";
import { homeStyles } from "../styles/global";
import { colors, opacity } from "../styles/theme";
import { useTheme } from "../styles/useTheme";

type LocalNewsSource = {
  name: string;
  shortName: string;
  area: string;
  url: string;
};

const DONATION_URL =
  "https://nitelightcic.co.uk/how-it-works/#:~:text=Donate%20by%20making%20a%20purchase";

const localNewsSources: LocalNewsSource[] = [
  {
    name: "Tees Valley",
    shortName: "Tees Valley",
    area: "Regional updates",
    url: "https://teesvalley-ca.gov.uk/news/",
  },
  {
    name: "Middlesbrough Council",
    shortName: "Middlesbrough",
    area: "Council news",
    url: "https://www.middlesbrough.gov.uk/latest-news/",
  },
  {
    name: "Stockton-on-Tees Council",
    shortName: "Stockton",
    area: "Borough updates",
    url: "https://www.stockton.gov.uk/news",
  },
  {
    name: "Hartlepool Council",
    shortName: "Hartlepool",
    area: "Local announcements",
    url: "https://www.hartlepool.gov.uk/news",
  },
  {
    name: "Redcar & Cleveland Council",
    shortName: "Redcar & Cleveland",
    area: "Community news",
    url: "https://www.redcar-cleveland.gov.uk/news",
  },
];

function formatArticleDate(value: string) {
  if (!value) return "NiteLight update";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "NiteLight update";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

async function openExternalUrl(url: string, fallbackMessage: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Unable to open link", fallbackMessage);
  }
}

export default function HomeScreen() {
  const { colour } = useTheme();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1, 6);

  const loadNews = useCallback(async (signal?: AbortSignal) => {
    try {
      setNewsError(null);
      const nextArticles = await getNiteLightNews(signal);
      setArticles(nextArticles);
    } catch (error) {
      if (signal?.aborted) return;

      console.error(error);
      setNewsError("NiteLight news could not be loaded right now.");
    } finally {
      if (!signal?.aborted) {
        setIsNewsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadNews(controller.signal);

    return () => controller.abort();
  }, [loadNews]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadNews();
  }

  async function handleSeedPlaces() {
    try {
      await seedPlaces();
      Alert.alert("Done", "Support locations seeded into Firebase.");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Failed to seed support locations. Check the console."
      );
    }
  }

  async function handleTestPayment() {
    try {
      setIsPaymentLoading(true);

      const paymentSheet = await createTestPaymentSheet();
      const initResult = await initPaymentSheet({
        merchantDisplayName: "NiteLight",
        paymentIntentClientSecret: paymentSheet.paymentIntentClientSecret,
        allowsDelayedPaymentMethods: false,
      });

      if (initResult.error) {
        Alert.alert("Payment setup failed", initResult.error.message);
        return;
      }

      const paymentResult = await presentPaymentSheet();

      if (paymentResult.error) {
        Alert.alert("Payment failed", paymentResult.error.message);
        return;
      }

      Alert.alert("Payment complete", "Stripe test payment succeeded.");
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      Alert.alert("Payment error", message);
    } finally {
      setIsPaymentLoading(false);
    }
  }

  function openArticle(article: NewsArticle) {
    return openExternalUrl(
      article.url,
      "Open the NiteLight news page in your browser."
    );
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[homeStyles.safeArea, { backgroundColor: colour.background }]}
    >
      <ScrollView
        style={homeStyles.page}
        contentContainerStyle={homeStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colour.primary]}
            tintColor={colour.primary}
          />
        }
      >
        <View style={homeStyles.compactHeader}>
          <View style={homeStyles.headerCopy}>
            <Text style={[homeStyles.title, { color: colour.text }]}>NiteLight</Text>
            <View
              style={[homeStyles.titleRule, { backgroundColor: colour.primary }]}
            />
            <Text style={[homeStyles.compactSubtitle, { color: colour.textSecondary }]}>
              News and community updates from across Tees Valley.
            </Text>
          </View>

          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Make a donation on the NiteLight website"
            onPress={() =>
              openExternalUrl(
                DONATION_URL,
                "Open the NiteLight donation page in your browser."
              )
            }
            style={({ pressed }) => [
              homeStyles.headerDonationButton,
              {
                backgroundColor: pressed ? colour.primaryHover : colour.primary,
                borderColor: colour.primaryHover,
              },
            ]}
            accessibilityHint="Opens the NiteLight donation section in your browser"
          >
            <Ionicons
              name="open-outline"
              size={15}
              color={colors.brandText}
              style={homeStyles.headerDonationExternalIcon}
            />
            <Ionicons name="heart-outline" size={21} color={colors.brandText} />
            <Text style={homeStyles.headerDonationLabel}>Make a donation</Text>
          </Pressable>
        </View>

        <View style={homeStyles.newsSection}>
          <View style={homeStyles.newsSectionHeading}>
            <View>
              <Text style={[homeStyles.newsEyebrow, { color: colour.primary }]}>LATEST</Text>
              <Text style={[homeStyles.newsSectionTitle, { color: colour.text }]}>From NiteLight</Text>
            </View>
            {articles.length > 0 ? (
              <Pressable
                accessibilityRole="link"
                onPress={() =>
                  openExternalUrl(
                    NITELIGHT_NEWS_URL,
                    "Visit the NiteLight news page in your browser."
                  )
                }
                style={({ pressed }) => [
                  homeStyles.smallTextAction,
                  { opacity: pressed ? opacity.disabled : 1 },
                ]}
              >
                <Text style={[homeStyles.smallTextActionLabel, { color: colour.text }]}>All news</Text>
                <Ionicons name="arrow-forward" size={16} color={colour.primary} />
              </Pressable>
            ) : null}
          </View>

          {isNewsLoading ? (
            <View
              style={[
                homeStyles.compactState,
                { backgroundColor: colour.surface, borderColor: colour.border },
              ]}
            >
              <ActivityIndicator color={colour.primary} />
              <Text style={[homeStyles.newsStateText, { color: colour.textSecondary }]}>Loading NiteLight news…</Text>
            </View>
          ) : featuredArticle ? (
            <>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`Read ${featuredArticle.title}`}
                onPress={() => openArticle(featuredArticle)}
                style={({ pressed }) => [
                  homeStyles.featuredCard,
                  {
                    borderColor: colour.border,
                    backgroundColor: colour.surface,
                    opacity: pressed ? opacity.subtle : 1,
                  },
                ]}
              >
                <View
                  style={[
                    homeStyles.featuredMedia,
                    { backgroundColor: colour.surfaceSecondary },
                  ]}
                >
                  {featuredArticle.imageUrl ? (
                    <Image
                      source={{ uri: featuredArticle.imageUrl }}
                      style={homeStyles.featuredImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons
                      name="newspaper-outline"
                      size={46}
                      color={colour.primary}
                    />
                  )}
                </View>

                <View style={homeStyles.featuredBody}>
                  <View style={homeStyles.featuredMetaRow}>
                    <View
                      style={[
                        homeStyles.dateTag,
                        { backgroundColor: colour.primary },
                      ]}
                    >
                      <Text style={homeStyles.dateTagText}>
                        {formatArticleDate(featuredArticle.publishedAt)}
                      </Text>
                    </View>

                    <View
                      style={[
                        homeStyles.featuredArrow,
                        { backgroundColor: colour.primary },
                      ]}
                    >
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color={colors.brandText}
                      />
                    </View>
                  </View>

                  <Text
                    style={[homeStyles.featuredBodyTitle, { color: colour.text }]}
                    numberOfLines={3}
                  >
                    {featuredArticle.title}
                  </Text>

                  {featuredArticle.summary ? (
                    <Text
                      style={[
                        homeStyles.featuredSummary,
                        { color: colour.textSecondary },
                      ]}
                      numberOfLines={3}
                    >
                      {featuredArticle.summary}
                    </Text>
                  ) : null}
                </View>
              </Pressable>

              {secondaryArticles.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={homeStyles.storyRail}
                  style={homeStyles.storyRailScroll}
                >
                  {secondaryArticles.map(article => (
                    <Pressable
                      key={article.id}
                      accessibilityRole="link"
                      accessibilityLabel={`Read ${article.title}`}
                      onPress={() => openArticle(article)}
                      style={({ pressed }) => [
                        homeStyles.storyCard,
                        {
                          backgroundColor: pressed
                            ? colour.surfaceSecondary
                            : colour.surface,
                          borderColor: colour.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          homeStyles.storyMedia,
                          { backgroundColor: colour.surfaceSecondary },
                        ]}
                      >
                        {article.imageUrl ? (
                          <Image
                            source={{ uri: article.imageUrl }}
                            style={homeStyles.storyImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <Ionicons
                            name="newspaper-outline"
                            size={28}
                            color={colour.primary}
                          />
                        )}
                      </View>
                      <View style={homeStyles.storyCopy}>
                        <Text style={[homeStyles.storyDate, { color: colour.textSecondary }]}>
                          {formatArticleDate(article.publishedAt)}
                        </Text>
                        <Text style={[homeStyles.storyTitle, { color: colour.text }]} numberOfLines={3}>
                          {article.title}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              ) : null}
            </>
          ) : (
            <View
              style={[
                homeStyles.compactState,
                { backgroundColor: colour.surface, borderColor: colour.border },
              ]}
            >
              <Ionicons name="newspaper-outline" size={28} color={colour.primary} />
              <Text style={[homeStyles.newsStateTitle, { color: colour.text }]}>
                {newsError ?? "No NiteLight updates are available yet."}
              </Text>
              <Pressable
                accessibilityRole="link"
                onPress={() =>
                  openExternalUrl(
                    NITELIGHT_NEWS_URL,
                    "Visit the NiteLight website in your browser."
                  )
                }
                style={({ pressed }) => [
                  homeStyles.inlineLink,
                  { opacity: pressed ? opacity.disabled : 1 },
                ]}
              >
                <Text style={[homeStyles.inlineLinkText, { color: colour.text }]}>Visit NiteLight news</Text>
                <Ionicons name="open-outline" size={16} color={colour.primary} />
              </Pressable>
            </View>
          )}
        </View>

        <View style={homeStyles.newsSection}>
          <View style={homeStyles.newsSectionHeading}>
            <View>
              <Text style={[homeStyles.newsEyebrow, { color: colour.primary }]}>AROUND YOU</Text>
              <Text style={[homeStyles.newsSectionTitle, { color: colour.text }]}>Local news</Text>
            </View>
          </View>

          <View style={homeStyles.localGrid}>
            {localNewsSources.map(source => (
              <Pressable
                key={source.name}
                accessibilityRole="link"
                accessibilityLabel={`Open news from ${source.name}`}
                onPress={() =>
                  openExternalUrl(
                    source.url,
                    `Visit ${source.name} in your browser.`
                  )
                }
                style={({ pressed }) => [
                  homeStyles.localCard,
                  {
                    backgroundColor: pressed
                      ? colour.surfaceSecondary
                      : colour.surface,
                    borderColor: colour.border,
                  },
                ]}
              >
                <View style={homeStyles.localCardTop}>
                  <Ionicons name="location-outline" size={20} color={colour.primary} />
                  <Ionicons name="open-outline" size={15} color={colour.textSecondary} />
                </View>
                <Text style={[homeStyles.localTitle, { color: colour.text }]} numberOfLines={2}>
                  {source.shortName}
                </Text>
                <Text style={[homeStyles.localDescription, { color: colour.textSecondary }]} numberOfLines={1}>
                  {source.area}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {__DEV__ && (
          <View style={homeStyles.section}>
            <View
              style={[
                homeStyles.sectionHeader,
                {
                  backgroundColor: colour.surfaceSecondary,
                  borderColor: colour.border,
                  borderLeftColor: colour.primary,
                },
              ]}
            >
              <Text style={[homeStyles.sectionTitle, { color: colour.text }]}>Developer tools</Text>
            </View>

            <View
              style={[
                homeStyles.panel,
                { backgroundColor: colour.surface, borderColor: colour.border },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                onPress={handleSeedPlaces}
                style={({ pressed }) => [
                  homeStyles.actionRow,
                  homeStyles.actionRowBorder,
                  {
                    borderBottomColor: colour.border,
                    backgroundColor: pressed
                      ? colour.surfaceSecondary
                      : colour.surface,
                  },
                ]}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={21}
                  color={colour.primary}
                  style={homeStyles.actionIcon}
                />
                <View style={homeStyles.actionCopy}>
                  <Text style={[homeStyles.actionTitle, { color: colour.text }]}>Seed support locations</Text>
                  <Text style={[homeStyles.actionDescription, { color: colour.textSecondary }]}>
                    Add the development support-service data to Firebase
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colour.textSecondary} />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={isPaymentLoading}
                onPress={handleTestPayment}
                style={({ pressed }) => [
                  homeStyles.actionRow,
                  {
                    backgroundColor: pressed
                      ? colour.surfaceSecondary
                      : colour.surface,
                    opacity: isPaymentLoading ? opacity.disabled : 1,
                  },
                ]}
              >
                <Ionicons
                  name="card-outline"
                  size={21}
                  color={colour.primary}
                  style={homeStyles.actionIcon}
                />
                <View style={homeStyles.actionCopy}>
                  <Text style={[homeStyles.actionTitle, { color: colour.text }]}>Test donation payment</Text>
                  <Text style={[homeStyles.actionDescription, { color: colour.textSecondary }]}>
                    Open the current Stripe test payment sheet
                  </Text>
                </View>
                <View style={homeStyles.activity}>
                  {isPaymentLoading ? (
                    <ActivityIndicator color={colour.primary} />
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={colour.textSecondary} />
                  )}
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
