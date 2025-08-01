import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { getThemeColors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Home, Dumbbell, BarChart3, User } from "lucide-react-native";
import { HapticTab } from "@/components/ui/haptic-tab";
import { TabBarBackground } from "@/components/ui/tabbar-background";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary[500],
          tabBarInactiveTintColor: colors.textMuted,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
              backgroundColor: "transparent",
            },
            default: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              borderTopWidth: 1,
            },
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="routines"
          options={{
            title: "Rutinas",
            tabBarIcon: ({ color, size }) => (
              <Dumbbell size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "Historial",
            tabBarIcon: ({ color, size }) => (
              <BarChart3 size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
