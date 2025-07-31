import React from "react";
import { View } from "react-native";
import { Typography, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

interface TimerCardProps {
  startedAt: string;
}

export const TimerCard: React.FC<TimerCardProps> = ({ startedAt }) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / 60000
  );

  return (
    <Card
      variant="elevated"
      padding="lg"
      style={{ marginBottom: 24, backgroundColor: colors.primary[500] }}
    >
      <View style={{ alignItems: "center" }}>
        <Typography
          variant="h1"
          weight="bold"
          color="white"
          style={{ marginBottom: 8 }}
        >
          {elapsedMinutes}:00
        </Typography>
        <Typography variant="body1" color="white" style={{ opacity: 0.9 }}>
          Tiempo transcurrido
        </Typography>
      </View>
    </Card>
  );
};
