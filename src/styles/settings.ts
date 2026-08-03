import { StyleSheet } from "react-native";

import { spacing, typography } from "./theme";

export const settingsStyles = StyleSheet.create({
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
    alignItems: "flex-start",
    marginBottom: 28,
    paddingHorizontal: spacing.screen,
  },

  backButton: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: -spacing.md,
    marginBottom: spacing.xxxl,
    paddingHorizontal: spacing.md,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: spacing.xs,
  },

  headerCopy: {
    width: "100%",
  },

  title: {
    fontSize: 29,
    lineHeight: 36,
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

  menuRow: {
    minHeight: 94,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxl,
    flexDirection: "row",
    alignItems: "center",
  },

  menuRowIcon: {
    width: 32,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: spacing.xxl,
  },

  menuRowCopy: {
    flex: 1,
    paddingRight: spacing.xl,
  },

  menuRowTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
  },

  menuRowDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
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

  card: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },

  cardWithHeader: {
    borderTopWidth: 0,
  },

  row: {
    minHeight: 74,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxl,
    flexDirection: "row",
    alignItems: "center",
  },

  switchRow: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "stretch",
  },

  switchLabelPressable: {
    flex: 1,
    minHeight: 74,
    paddingLeft: spacing.xxxl,
    paddingVertical: spacing.xxl,
    flexDirection: "row",
    alignItems: "center",
  },

  switchControlPressable: {
    width: 78,
    minHeight: 74,
    alignItems: "center",
    justifyContent: "center",
  },

  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  rowIcon: {
    width: 28,
    minHeight: 32,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: spacing.xxl,
  },

  rowCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },

  rowTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "500",
  },

  rowDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
  },

  rowValue: {
    fontSize: 14,
    fontWeight: "500",
    maxWidth: "42%",
    textAlign: "right",
  },

  detailRow: {
    minHeight: 82,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxl,
    justifyContent: "center",
  },

  detailLabel: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    letterSpacing: 0.25,
    marginBottom: spacing.sm,
  },

  detailValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },

  bodyCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
    padding: spacing.xxxl,
    marginHorizontal: spacing.screen,
    marginBottom: spacing.screenLarge,
  },

  bodyTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    marginBottom: spacing.md,
  },

  bodyText: {
    ...typography.bodySmall,
  },

  actionButton: {
    minHeight: 54,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
    marginTop: spacing.xl,
  },

  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  footerText: {
    ...typography.helper,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  dialogBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    paddingHorizontal: spacing.screen,
    alignItems: "center",
    justifyContent: "center",
  },

  dialogCard: {
    width: "100%",
    maxWidth: 420,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.screenLarge,
    paddingVertical: spacing.screenLarge,
  },

  dialogIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },

  dialogTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600",
  },

  dialogMessage: {
    ...typography.bodySmall,
    marginTop: spacing.lg,
  },

  dialogActions: {
    marginTop: spacing.screenLarge,
    gap: spacing.xl,
  },

  dialogAction: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
  },

  dialogActionText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
  },

});
