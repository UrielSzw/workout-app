import React from "react";
import { View } from "react-native";
import { Typography, Card } from "@/components/ui";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color,
}) => {
  return (
    <Card variant="outlined" padding="md" style={{ flex: 1 }}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: color + "20",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          {icon}
        </View>
        <Typography
          variant="h5"
          weight="bold"
          align="center"
          style={{ marginBottom: 2 }}
        >
          {value}
        </Typography>
        <Typography variant="caption" color="textMuted" align="center">
          {label}
        </Typography>
      </View>
    </Card>
  );
};
