import React from "react";
import { View } from "react-native";
import { MoreHorizontal } from "lucide-react-native";

import { Typography, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { Folder as FolderType, Routine } from "@/store/useAppStore";

interface FolderCardProps {
  folder: FolderType;
  routines: Routine[];
  onPress: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  routines,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  return (
    <Card
      variant="outlined"
      padding="md"
      pressable
      onPress={onPress}
      style={{ marginBottom: 12 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: folder.color + "20",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Typography variant="h6">{folder.icon}</Typography>
        </View>

        <View style={{ flex: 1 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 2 }}
          >
            {folder.name}
          </Typography>
          <Typography variant="body2" color="textMuted">
            {routines.length} rutinas
          </Typography>
        </View>

        <View>
          <MoreHorizontal size={20} color={colors.textMuted} />
        </View>
      </View>
    </Card>
  );
};
