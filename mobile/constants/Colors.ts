export const Colors = {
  // Primary Brand Colors
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Main primary
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },

  // Secondary (Orange for energy/motivation)
  secondary: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316", // Main secondary
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
  },

  // Success (Green)
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Error (Red)
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Warning (Yellow/Amber)
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Info (Blue)
  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Neutral/Gray Scale
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Light theme colors
  light: {
    background: "#ffffff",
    surface: "#f9fafb",
    surfaceSecondary: "#f3f4f6",
    border: "#e5e7eb",
    text: "#111827",
    textSecondary: "#374151",
    textMuted: "#6b7280",
  },

  // Dark theme colors
  dark: {
    background: "#111827",
    surface: "#1f2937",
    surfaceSecondary: "#374151",
    border: "#4b5563",
    text: "#f9fafb",
    textSecondary: "#e5e7eb",
    textMuted: "#9ca3af",
  },
};

// Helper function to get theme-specific colors
export function getThemeColors(isDark: boolean) {
  return {
    background: isDark ? Colors.dark.background : Colors.light.background,
    surface: isDark ? Colors.dark.surface : Colors.light.surface,
    surfaceSecondary: isDark
      ? Colors.dark.surfaceSecondary
      : Colors.light.surfaceSecondary,
    border: isDark ? Colors.dark.border : Colors.light.border,
    text: isDark ? Colors.dark.text : Colors.light.text,
    textSecondary: isDark
      ? Colors.dark.textSecondary
      : Colors.light.textSecondary,
    textMuted: isDark ? Colors.dark.textMuted : Colors.light.textMuted,

    // Brand colors (same for both themes)
    primary: Colors.primary,
    secondary: Colors.secondary,
    success: Colors.success,
    error: Colors.error,
    warning: Colors.warning,
    info: Colors.info,
    gray: Colors.gray,
  };
}
