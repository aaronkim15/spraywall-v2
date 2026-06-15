// src/constants/theme.ts

export const theme = {
    colors: {
    background: "#0d0d0f",
    foreground: "#f0ede8",

    card: "#161618",
    cardForeground: "#f0ede8",

    popover: "#1e1e22",
    popoverForeground: "#f0ede8",

    primary: "#ff6b35",
    primaryForeground: "#ffffff",

    secondary: "#1e1e22",
    secondaryForeground: "#f0ede8",

    muted: "#262628",
    mutedForeground: "#8a8a94",

    accent: "#a3e635",
    accentForeground: "#0d0d0f",

    destructive: "#ef4444",
    destructiveForeground: "#ffffff",

    border: "rgba(255, 255, 255, 0.08)",
    inputBackground: "#1e1e22",
    switchBackground: "#3a3a40",

    ring: "#ff6b35",
    },

    spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    },

    radius: {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 14,
    },

    typography: {
    fontSize: {
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
    },

    fontWeight: {
        normal: "400" as const,
        medium: "500" as const,
        semibold: "600" as const,
        bold: "700" as const,
        extrabold: "800" as const,
    },

    fontFamily: {
        heading: "Barlow Condensed",
        body: "Barlow",
    },
    },
};
