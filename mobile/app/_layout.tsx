import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "./globals.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useAppStore } from "@/store/useAppStore";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { loadFromStorage } = useAppStore();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // Load data from storage when app starts
      loadFromStorage();
    }
  }, [loaded, loadFromStorage]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="workout/active"
            options={{
              presentation: "fullScreenModal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="routines/create"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="folders/create"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="reorder-blocks"
            options={{
              presentation: "modal",
              headerShown: false,
              title: "Reordenar Bloques",
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="reorder-exercises"
            options={{
              presentation: "modal",
              headerShown: false,
              title: "Reordenar Ejercicios",
              gestureEnabled: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
