import React from "react";
import { View } from "react-native";
import { Typography, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  rightElement,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  return (
    <Card
      variant="outlined"
      padding="md"
      pressable={!!onPress}
      onPress={onPress}
      style={{ marginBottom: 8 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.gray[100],
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          {icon}
        </View>

        <View style={{ flex: 1 }}>
          <Typography
            variant="h6"
            weight="medium"
            style={{ marginBottom: subtitle ? 2 : 0 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textMuted">
              {subtitle}
            </Typography>
          )}
        </View>

        {rightElement && <View style={{ marginLeft: 12 }}>{rightElement}</View>}
      </View>
    </Card>
  );
};
