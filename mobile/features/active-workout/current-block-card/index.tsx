import React from "react";
import { View } from "react-native";
import { Typography, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

export const CurrentBlockCard = () => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  return (
    <Card variant="outlined" padding="lg" style={{ marginBottom: 24 }}>
      <Typography
        variant="overline"
        color="primary"
        style={{ marginBottom: 8 }}
      >
        BLOQUE ACTUAL
      </Typography>
      <Typography variant="h4" weight="bold" style={{ marginBottom: 16 }}>
        Superserie - Ronda 1/3
      </Typography>

      {/* Exercise List */}
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.success[100],
            padding: 12,
            borderRadius: 12,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.success[500],
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Typography variant="caption" color="white" weight="bold">
              ✓
            </Typography>
          </View>
          <View style={{ flex: 1 }}>
            <Typography variant="h6" weight="semibold">
              Press de Banca
            </Typography>
            <Typography variant="body2" color="textMuted">
              Set 1: 80kg × 8
            </Typography>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.primary[100],
            padding: 12,
            borderRadius: 12,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.primary[500],
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Typography variant="caption" color="white" weight="bold">
              2
            </Typography>
          </View>
          <View style={{ flex: 1 }}>
            <Typography variant="h6" weight="semibold">
              Remo con Barra
            </Typography>
            <Typography variant="body2" color="textMuted">
              Set 1: 70kg × __
            </Typography>
          </View>
        </View>
      </View>

      {/* Progress */}
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Typography variant="body2" color="textMuted">
            Progreso del bloque
          </Typography>
          <Typography variant="body2" color="textMuted">
            1/3 rondas
          </Typography>
        </View>
        <View
          style={{
            height: 8,
            backgroundColor: colors.gray[200],
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: "33%",
              height: "100%",
              backgroundColor: colors.primary[500],
            }}
          />
        </View>
      </View>
    </Card>
  );
};
