type ColourPalette = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryHover: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
};

export const lightColours: ColourPalette = {
  background: "#F8FAFB",
  surface: "#FFFFFF",
  surfaceSecondary: "#ECF6F9",

  text: "#1F2122",
  textSecondary: "#5B6163",

  primary: "#FFCC03",
  primaryHover: "#E6B800",

  border: "#D9E2E6",

  success: "#2E9E5B",
  warning: "#F4A000",
  error: "#D64545",

  shadow: "rgba(50, 52, 53, 0.08)",
};

export const darkColours: ColourPalette = {
  background: "#121314",
  surface: "#1B1D1E",
  surfaceSecondary: "#242728",

  text: "#F5F7F8",
  textSecondary: "#B4BCC0",

  primary: "#FFCC03",
  primaryHover: "#FFD633",

  border: "#34393B",

  success: "#49C174",
  warning: "#FFB020",
  error: "#FF6B6B",

  shadow: "rgba(0, 0, 0, 0.35)",
};

export type AppColours = ColourPalette;

export const colors = {
  brandText: "#1F2122",
  white: "#FFFFFF",
  black: "#000000",
  modalBackdrop: "rgba(0,0,0,0.42)",

  bulb: {
    bright: "#FFD84D",
    medium: "#D9A93B",
    low: "#8F7B4C",
    off: "#666666",
  },
} as const;

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 14,
  xxxl: 16,
  screen: 20,
  screenLarge: 24,
  brandGap: 26,
  topInset: 64,
} as const;

export const radius = {
  none: 0,
  md: 24,
  lg: 28,
  pill: 999,
} as const;

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  appName: {
    fontSize: 34,
    fontWeight: "800",
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "800",
  },
  body: {
    fontSize: 16,
  },
  bodySmall: {
    fontSize: 15,
    lineHeight: 21,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
  helper: {
    fontSize: 12,
    lineHeight: 17,
  },
  button: {
    fontSize: 16,
    fontWeight: "800",
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: "700",
  },
} as const;

export const sizes = {
  authInputHeight: 52,
  authButtonHeight: 54,
  logoMark: 68,
  logoIcon: 34,
  stepDotWidth: 34,
  stepDotHeight: 6,
  mapMarker: 54,
  recenterButtonHeight: 48,
  recenterButtonWidth: 132,
  recenterButtonCollapsedWidth: 56,
  placeInfoImageHeight: 132,
  placeInfoImageExpandedHeight: 220,
  placeInfoSheetOffset: 430,
  lightBulbMarkerPadding: 22,
} as const;

export const opacity = {
  disabled: 0.6,
  subtle: 0.9,
} as const;

export const shadows = {
  placeInfoCard: {
    elevation: 8,
    shadowColor: colors.black,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  recenterButton: {
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
} as const;
