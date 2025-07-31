import React from "react";
import { View } from "react-native";
import { Typography } from "@/components/ui";

interface StatItemProps {
  label: string;
  value: string;
  color: string;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value, color }) => {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Typography variant="h4" weight="bold" style={{ color, marginBottom: 4 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="textMuted" align="center">
        {label}
      </Typography>
    </View>
  );
};
