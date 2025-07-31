import React from "react";
import { View } from "react-native";
import { Typography, Card } from "@/components/ui";

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  color: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  color,
}) => {
  return (
    <Card
      variant="outlined"
      padding="md"
      pressable
      onPress={onPress}
      style={{ flex: 1 }}
    >
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: color + "20",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          {icon}
        </View>
        <Typography
          variant="h6"
          weight="semibold"
          align="center"
          style={{ marginBottom: 4 }}
        >
          {title}
        </Typography>
        <Typography variant="caption" color="textMuted" align="center">
          {subtitle}
        </Typography>
      </View>
    </Card>
  );
};
