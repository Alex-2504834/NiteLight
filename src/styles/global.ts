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
  primaryButton: {
    marginTop: spacing.screen,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.xl,
    borderRadius: radius.pill,
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
    alignItems: "center",
    marginBottom: spacing.brandGap,
  },

  logoMark: {
    width: sizes.logoMark,
    height: sizes.logoMark,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  appName: {
    ...typography.appName,
  },

  subtitle: {
    marginTop: spacing.md,
    ...typography.body,
    lineHeight: 22,
    textAlign: "center",
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
    marginBottom: 18,
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

  formSubtitle: {
    marginTop: spacing.sm,
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
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
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
    borderRadius: radius.pill,
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
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },

  placeInfoCard: {
    position: "absolute",
    left: spacing.none,
    right: spacing.none,
    bottom: spacing.none,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: radius.none,
    borderBottomRightRadius: radius.none,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: "hidden",
    ...shadows.placeInfoCard,
  },

  placeInfoImageWrap: {
    height: sizes.placeInfoImageHeight,
    position: "relative",
    overflow: "hidden",
  },

  placeInfoImageWrapExpanded: {
    height: sizes.placeInfoImageExpandedHeight,
  },

  placeInfoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    position: "absolute",
    left: spacing.none,
    right: spacing.none,
    top: spacing.none,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  placeInfoDragHandle: {
    width: 52,
    height: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    opacity: 0.92,
  },

  placeInfoImagePlaceholderIcon: {
    fontSize: 28,
    fontWeight: "800",
  },

  placeInfoImagePlaceholderText: {
    ...typography.helper,
    fontWeight: "700",
  },

  placeInfoPhotoCreditPill: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.xl,
    minHeight: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.modalBackdrop,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
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
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },

  placeInfoCloseText: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 22,
  },

  placeInfoMeta: {
    marginTop: spacing.xs,
    ...typography.label,
    lineHeight: 18,
  },

  placeInfoAddress: {
    marginTop: spacing.xl,
    ...typography.bodySmall,
  },

  placeInfoHint: {
    marginTop: spacing.lg,
    ...typography.helper,
    fontWeight: "700",
  },

  placeInfoRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xl,
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
    marginTop: spacing.screen,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.modalBackdrop,
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
  },

  placeInfoHoursToggleTextWrap: {
    flex: 1,
  },

  placeInfoHoursSummary: {
    ...typography.bodySmall,
  },

  placeInfoHoursToggleHint: {
    ...typography.helper,
    fontWeight: "800",
    textAlign: "right",
  },

  placeInfoHoursText: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },

  placeInfoActions: {
    marginTop: spacing.xxxl,
    flexDirection: "row",
    gap: spacing.lg,
  },

  placeInfoButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.pill,
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
    borderRadius: radius.pill,
    opacity: opacity.subtle,
  },

  cacheBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  recenterButtonWrapper: {
    position: "absolute",
    right: spacing.none,
    bottom: 110,
  },

  recenterButtonWrapperAbovePlaceInfo: {
    bottom: sizes.placeInfoSheetOffset + spacing.xl,
  },

  recenterButton: {
    height: sizes.recenterButtonHeight,
    borderTopLeftRadius: radius.pill,
    borderBottomLeftRadius: radius.pill,
    borderTopRightRadius: radius.none,
    borderBottomRightRadius: radius.none,
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
    borderRadius: radius.md,
    padding: spacing.xxxl,
  },

  permissionText: {
    fontSize: 15,
    marginBottom: spacing.xl,
  },

  permissionButton: {
    paddingVertical: spacing.xl,
    borderRadius: radius.pill,
    alignItems: "center",
  },

  permissionButtonText: {
    color: colors.brandText,
    fontWeight: "700",
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
      height: 120,
      paddingBottom: spacing.lg,
      paddingTop: spacing.lg,
    },

    tabBarActiveTintColor: colour.primary,
    tabBarInactiveTintColor: colour.textSecondary,

    headerStyle: {
      backgroundColor: colour.surface,
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
      borderRadius: radius.pill,
    },
  };
}

export function getLightBulbColour(value: number) {
  if (value >= 75) return colors.bulb.bright;
  if (value >= 45) return colors.bulb.medium;
  if (value > 0) return colors.bulb.low;
  return colors.bulb.off;
}
