import { StyleSheet } from "react-native";
import type { ViewStyle } from "react-native";

import {
  AppColours,
  colors,
  opacity,
  radius,
  shadows,
  sizes,
  spacing,
  typography,
} from "./theme";

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  screenFill: {
    flex: 1,
  },

  title: {
    ...typography.title,
  },
});

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  page: {
    flex: 1,
  },

  content: {
    paddingTop: spacing.xxxl,
    paddingBottom: 48,
  },

  header: {
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.screen,
  },

  compactHeader: {
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.screenLarge,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  headerCopy: {
    flex: 1,
    paddingRight: spacing.screen,
  },

  compactSubtitle: {
    ...typography.bodySmall,
    marginTop: spacing.xl,
    maxWidth: 420,
  },

  headerDonationButton: {
    width: 108,
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  headerDonationExternalIcon: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
  },

  headerDonationLabel: {
    color: colors.brandText,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
    marginTop: spacing.xs,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.35,
  },

  newsSection: {
    marginBottom: spacing.screenLarge,
  },

  newsSectionHeading: {
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.xl,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  newsEyebrow: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  newsSectionTitle: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "600",
    marginTop: spacing.xxs,
  },

  smallTextAction: {
    minHeight: 40,
    paddingLeft: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  smallTextActionLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  compactState: {
    minHeight: 150,
    marginHorizontal: spacing.screen,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.screenLarge,
    alignItems: "center",
    justifyContent: "center",
  },

  featuredCard: {
    marginHorizontal: spacing.screen,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },

  featuredMedia: {
    height: 206,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  featuredImage: {
    width: "100%",
    height: "100%",
  },

  featuredBody: {
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxl,
  },

  featuredMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },

  dateTag: {
    alignSelf: "flex-start",
    borderRadius: radius.actionSmall,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  dateTagText: {
    color: colors.brandText,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  featuredBodyTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
  },

  featuredArrow: {
    width: 40,
    height: 40,
    borderRadius: radius.action,
    alignItems: "center",
    justifyContent: "center",
  },

  featuredSummary: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.md,
  },

  storyRailScroll: {
    marginTop: spacing.xl,
  },

  storyRail: {
    paddingHorizontal: spacing.screen,
    gap: spacing.xl,
  },

  storyCard: {
    width: 208,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },


  storyMedia: {
    width: "100%",
    height: 116,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  storyImage: {
    width: "100%",
    height: "100%",
  },


  storyCopy: {
    minHeight: 98,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
  },

  storyDate: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.35,
    marginBottom: spacing.sm,
  },

  storyTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },

  localGrid: {
    paddingHorizontal: spacing.screen,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl,
  },

  localCard: {
    width: "48%",
    minHeight: 112,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },

  localCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },

  localTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },

  localDescription: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: spacing.xs,
  },


  title: {
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "600",
  },

  titleRule: {
    width: 44,
    height: 3,
    marginTop: spacing.xl,
  },

  subtitle: {
    ...typography.bodySmall,
    marginTop: spacing.xl,
    maxWidth: 520,
  },

  mapShortcutWrap: {
    marginHorizontal: spacing.screen,
    marginBottom: spacing.screenLarge,
  },

  mapShortcut: {
    minHeight: 68,
    borderWidth: 1,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxl,
    flexDirection: "row",
    alignItems: "center",
  },

  mapShortcutCopy: {
    flex: 1,
    marginLeft: spacing.xxl,
    paddingRight: spacing.md,
  },

  mapShortcutTitle: {
    color: colors.brandText,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "700",
  },

  mapShortcutDescription: {
    color: colors.brandText,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xxs,
  },

  section: {
    marginHorizontal: spacing.screen,
    marginBottom: spacing.screenLarge,
  },

  sectionHeader: {
    minHeight: 42,
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
    paddingHorizontal: spacing.xxl,
  },

  sectionTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  panel: {
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    overflow: "hidden",
  },

  actionRow: {
    minHeight: 72,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxl,
    flexDirection: "row",
    alignItems: "center",
  },

  actionRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  actionIcon: {
    width: 32,
    marginRight: spacing.xxl,
  },

  actionCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },

  actionTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },

  actionDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
  },

  newsArticle: {
    minHeight: 112,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxl,
    flexDirection: "row",
    alignItems: "center",
  },

  newsImage: {
    width: 82,
    height: 82,
    marginRight: spacing.xxxl,
  },

  newsImageFallback: {
    width: 82,
    height: 82,
    marginRight: spacing.xxxl,
    alignItems: "center",
    justifyContent: "center",
  },

  newsCopy: {
    flex: 1,
    paddingRight: spacing.xl,
  },

  newsMeta: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.35,
    marginBottom: spacing.xs,
  },

  newsTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },

  newsSummary: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
  },

  newsState: {
    minHeight: 138,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.screenLarge,
    alignItems: "center",
    justifyContent: "center",
  },

  newsStateTitle: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.xl,
  },

  newsStateText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: spacing.xl,
  },

  inlineLink: {
    minHeight: 42,
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  inlineLinkText: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600",
  },

  viewAllRow: {
    minHeight: 54,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.xxxl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  viewAllText: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600",
  },

  activity: {
    width: 22,
    alignItems: "center",
  },

  bodyPanel: {
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxl,
  },

  bodyText: {
    ...typography.bodySmall,
    lineHeight: 21,
  },

  primaryButton: {
    minHeight: 54,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.xl,
    borderRadius: radius.action,
    borderWidth: 1,
    minWidth: 180,
    alignItems: "center",
  },

  primaryButtonText: {
    color: colors.brandText,
    fontWeight: "700",
  },
});

export const authStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenLarge,
    paddingBottom: spacing.screenLarge,
  },

  choiceContent: {
    justifyContent: "center",
    paddingTop: spacing.screenLarge,
  },

  upperContent: {
    justifyContent: "flex-start",
    paddingTop: spacing.topInset,
  },

  signUpContent: {
    justifyContent: "flex-start",
    paddingTop: spacing.topInset,
  },

  brandLockup: {
    alignItems: "flex-start",
    marginBottom: spacing.brandGap,
    width: "100%",
  },

  logoMark: {
    width: 58,
    height: 58,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  appName: {
    ...typography.appName,
  },

  brandRule: {
    width: 44,
    height: 3,
    marginTop: spacing.xl,
  },

  subtitle: {
    marginTop: spacing.xl,
    ...typography.body,
    lineHeight: 22,
    textAlign: "left",
  },

  choiceStack: {
    gap: spacing.xl,
  },

  generalError: {
    marginTop: spacing.xxl,
    ...typography.label,
    lineHeight: 18,
    textAlign: "center",
  },

  securityNote: {
    marginTop: spacing.screen,
    ...typography.helper,
    textAlign: "center",
  },

  loadingOverlay: {
    marginTop: spacing.xxxl,
    alignItems: "center",
  },

  formStack: {
    gap: spacing.xxl,
  },

  signUpPanel: {
    flex: 1,
  },

  topBackButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
    marginLeft: -spacing.md,
    marginBottom: 18,
    paddingHorizontal: spacing.md,
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },

  formHeader: {
    marginBottom: spacing.xxs,
  },

  formTitle: {
    ...typography.formTitle,
  },

  formRule: {
    width: 44,
    height: 3,
    marginTop: spacing.xl,
  },

  formSubtitle: {
    marginTop: spacing.xl,
    ...typography.bodySmall,
  },

  stepDots: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  stepDot: {
    width: sizes.stepDotWidth,
    height: sizes.stepDotHeight,
    borderRadius: radius.pill,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.modalBackdrop,
    justifyContent: "flex-end",
  },

  countrySheet: {
    paddingTop: 18,
    paddingBottom: spacing.screenLarge,
    paddingHorizontal: spacing.screen,
    borderTopLeftRadius: radius.none,
    borderTopRightRadius: radius.none,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  countrySheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing.lg,
  },

  countryOption: {
    minHeight: 48,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  countryText: {
    fontSize: 15,
    fontWeight: "600",
  },

  countryCodeText: {
    fontSize: 15,
    fontWeight: "800",
  },

  actionButton: {
    minHeight: sizes.authButtonHeight,
    borderRadius: radius.action,
    borderWidth: 1,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },

  actionButtonText: {
    ...typography.button,
  },

  inputGroup: {
    gap: 7,
  },

  inputLabel: {
    ...typography.label,
  },

  input: {
    minHeight: sizes.authInputHeight,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 18,
    ...typography.body,
  },

  helperText: {
    ...typography.helper,
  },

  fieldError: {
    ...typography.helper,
    fontWeight: "700",
  },

  phoneRow: {
    minHeight: sizes.authInputHeight,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  countryButton: {
    height: "100%",
    paddingHorizontal: spacing.xxl,
    borderRightWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 1,
  },

  countryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },

  phoneInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: spacing.xxl,
    ...typography.body,
  },
});

export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  placeMarker: {
    width: sizes.mapMarker,
    height: sizes.mapMarker,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },

  placeInfoTopPadding: {
    position: "absolute",
    left: spacing.none,
    right: spacing.none,
    top: spacing.none,
  },

  placeInfoCard: {
    position: "absolute",
    left: spacing.none,
    right: spacing.none,
    bottom: spacing.none,
    borderTopLeftRadius: radius.none,
    borderTopRightRadius: radius.none,
    borderBottomLeftRadius: radius.none,
    borderBottomRightRadius: radius.none,
    borderWidth: 1,
    borderTopWidth: 3,
    borderBottomWidth: 0,
    overflow: "hidden",
    ...shadows.placeInfoCard,
  },

  placeInfoImageWrap: {
    height: sizes.placeInfoImageHeight,
    position: "relative",
    overflow: "hidden",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.16)",
  },

  placeInfoImageButton: {
    flex: 1,
    position: "relative",
  },

  placeInfoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  placeInfoImageCloseIcon: {
    position: "absolute",
    left: spacing.xl,
    top: spacing.xl,
    width: 40,
    height: 40,
    borderRadius: radius.action,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.62)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.38)",
  },

  placeInfoImageExpandIcon: {
    position: "absolute",
    right: spacing.xl,
    top: spacing.xl,
    width: 40,
    height: 40,
    borderRadius: radius.action,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.62)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.38)",
  },

  placeInfoImagePlaceholder: {
    height: sizes.placeInfoImageHeight,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    position: "relative",
    overflow: "hidden",
  },

  placeInfoDragHandleTouchArea: {
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  placeInfoDragHandle: {
    width: 46,
    height: 3,
    borderRadius: radius.none,
    borderWidth: 0,
    opacity: 0.9,
  },

  placeInfoImagePlaceholderText: {
    ...typography.helper,
    fontWeight: "700",
  },

  placeInfoPhotoCreditPill: {
    position: "absolute",
    left: spacing.none,
    right: spacing.none,
    bottom: spacing.none,
    minHeight: 28,
    borderRadius: radius.none,
    backgroundColor: "rgba(0, 0, 0, 0.66)",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },

  placeInfoPhotoCreditText: {
    ...typography.helper,
    color: colors.white,
    fontWeight: "700",
  },

  placeInfoScroll: {
    flex: 1,
  },

  placeInfoBody: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.screen,
  },

  placeInfoPreviewMeasure: {
    height: 1,
  },

  placeInfoDetailsReveal: {
    paddingTop: spacing.xl,
  },

  placeInfoBodyCollapsed: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },

  placeInfoBodyExpanded: {
    paddingBottom: spacing.screenLarge + spacing.screen,
  },

  placeInfoGrabber: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    marginBottom: spacing.xl,
  },

  placeInfoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  placeInfoHeaderCollapsed: {
    paddingBottom: spacing.lg,
  },

  placeInfoContent: {
    flex: 1,
  },

  placeInfoTitle: {
    ...typography.formTitle,
    fontSize: 20,
    lineHeight: 25,
  },

  placeInfoCloseButton: {
    width: 38,
    height: 38,
    borderRadius: radius.action,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },

  placeInfoMeta: {
    marginTop: spacing.xs,
    ...typography.label,
    lineHeight: 18,
  },

  placeInfoAddress: {
    marginTop: spacing.xxxl,
    paddingBottom: spacing.none,
    ...typography.bodySmall,
  },

  placeInfoAddressCollapsed: {
    marginTop: spacing.lg,
    paddingBottom: spacing.sm,
  },

  placeInfoHint: {
    marginTop: spacing.lg,
    ...typography.helper,
    fontWeight: "700",
  },

  placeInfoRow: {
    marginTop: spacing.none,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.lg,
  },

  placeInfoLabel: {
    ...typography.helper,
    fontWeight: "700",
  },

  placeInfoValue: {
    ...typography.bodySmall,
    fontWeight: "700",
    textAlign: "right",
    flexShrink: 1,
  },

  placeInfoLoadingRow: {
    marginTop: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  placeInfoLoadingText: {
    ...typography.bodySmall,
  },

  placeInfoDetailLine: {
    marginTop: spacing.lg,
    ...typography.bodySmall,
  },

  placeInfoError: {
    marginTop: spacing.xl,
    ...typography.helper,
  },

  placeInfoExpandedSection: {
    marginTop: spacing.xl,
    paddingVertical: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  placeInfoSectionTitle: {
    ...typography.label,
    fontSize: 14,
    marginBottom: spacing.xs,
  },

  placeInfoHoursToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xl,
    minHeight: 52,
  },

  placeInfoHoursToggleTextWrap: {
    flex: 1,
  },

  placeInfoHoursSummary: {
    ...typography.bodySmall,
  },

  placeInfoHoursToggleHint: {
    ...typography.helper,
    fontWeight: "700",
    textAlign: "right",
  },

  placeInfoHoursToggleAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  placeInfoHoursText: {
    ...typography.bodySmall,
    paddingVertical: spacing.sm,
  },

  placeInfoActions: {
    marginTop: spacing.xxxl,
    flexDirection: "row",
    gap: spacing.lg,
    paddingTop: spacing.xxxl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  placeInfoActionsCollapsed: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
  },

  placeInfoButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.none,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },

  placeInfoButtonSecondary: {
    borderWidth: 1,
  },

  placeInfoButtonText: {
    ...typography.buttonSmall,
    color: colors.brandText,
  },

  placeInfoSecondaryButtonText: {
    ...typography.buttonSmall,
  },

  cacheBadge: {
    position: "absolute",
    left: spacing.xxxl,
    top: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.none,
    borderWidth: StyleSheet.hairlineWidth,
    opacity: opacity.subtle,
  },

  cacheBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  recenterButtonWrapper: {
    position: "absolute",
    right: 0,
    bottom: 110,
    alignItems: "flex-end",
  },

  recenterButtonWrapperAbovePlaceInfo: {
    bottom: sizes.placeInfoSheetOffset + spacing.xl,
  },

  recenterButton: {
    height: sizes.recenterButtonHeight,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderRightWidth: 0,
    ...shadows.recenterButton,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  recenterIcon: {
    fontSize: 22,
    fontWeight: "700",
  },

  recenterButtonText: {
    marginLeft: spacing.md,
    ...typography.buttonSmall,
  },

  permissionCard: {
    position: "absolute",
    left: spacing.screen,
    right: spacing.screen,
    bottom: 30,
    borderRadius: radius.none,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
    padding: spacing.xxxl,
  },

  permissionText: {
    fontSize: 15,
    marginBottom: spacing.xl,
  },

  permissionButton: {
    paddingVertical: spacing.xl,
    borderRadius: radius.action,
    alignItems: "center",
  },

  placeInfoBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
  },

  permissionButtonText: {
    color: colors.brandText,
    fontWeight: "700",
  },

  imageViewer: {
    flex: 1,
    backgroundColor: colors.black,
  },

  imageViewerSlide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  imageViewerImage: {
    width: "100%",
    height: "100%",
  },

  imageViewerTopBar: {
    position: "absolute",
    left: spacing.screen,
    right: spacing.screen,
    top: spacing.topInset,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  imageViewerCloseButton: {
    width: 48,
    height: 48,
    borderRadius: radius.action,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.38)",
  },

  imageViewerCloseText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "300",
  },

  imageViewerCounter: {
    color: colors.white,
    borderRadius: radius.actionSmall,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.38)",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    fontSize: 13,
    fontWeight: "700",
  },

  imageViewerAttribution: {
    position: "absolute",
    left: spacing.screen,
    right: spacing.screen,
    bottom: spacing.screenLarge,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.24)",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  imageViewerAttributionText: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 16,
  },
});

export const markerStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },

  glow: {
    position: "absolute",
    backgroundColor: colors.bulb.bright,
  },
});

export function createTabBarStyles(colour: AppColours) {
  return {
    tabBarStyle: {
      backgroundColor: colour.surface,
      borderTopColor: colour.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      height: 78,
      paddingBottom: spacing.md,
      paddingTop: spacing.md,
      elevation: 0,
      shadowOpacity: 0,
    },

    tabBarItemStyle: {
      borderRadius: radius.none,
    },

    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "600" as const,
    },

    tabBarActiveTintColor: colour.primary,
    tabBarInactiveTintColor: colour.textSecondary,

    headerStyle: {
      backgroundColor: colour.surface,
      elevation: 0,
      shadowOpacity: 0,
    },

    headerTintColor: colour.text,
  };
}

type LightBulbDynamicStyleInput = {
  size: number;
  glow: number;
  isLit: boolean;
};

export function createLightBulbMarkerDynamicStyles({
  size,
  glow,
  isLit,
}: LightBulbDynamicStyleInput): {
  container: ViewStyle;
  glow: ViewStyle;
} {
  return {
    container: {
      width: size + sizes.lightBulbMarkerPadding,
      height: size + sizes.lightBulbMarkerPadding,
      shadowColor: colors.bulb.bright,
      shadowOpacity: glow * 0.9,
      shadowRadius: 4 + glow * 12,
      shadowOffset: { width: 0, height: 0 },
      elevation: isLit ? 6 : 0,
    },
    glow: {
      opacity: glow * 0.45,
      width: size + glow * sizes.lightBulbMarkerPadding,
      height: size + glow * sizes.lightBulbMarkerPadding,
      borderRadius: radius.round,
    },
  };
}

export function getLightBulbColour(value: number) {
  if (value >= 75) return colors.bulb.bright;
  if (value >= 45) return colors.bulb.medium;
  if (value > 0) return colors.bulb.low;
  return colors.bulb.off;
}
