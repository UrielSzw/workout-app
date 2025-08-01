import React from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { Typography } from "@/components/ui";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Typography variant="body2" color="textMuted" style={{ marginTop: 16 }}>
          Cargando...
        </Typography>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};
