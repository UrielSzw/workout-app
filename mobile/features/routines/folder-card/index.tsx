import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { MoreHorizontal } from "lucide-react-native";

import { Typography, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { Folder as FolderType, Routine } from "@/store/useAppStore";

interface FolderCardProps {
  folder: FolderType;
  routines: Routine[];
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  routines,
  onPress,
  onEdit,
  onDelete,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const handleMenuPress = () => {
    Alert.alert(folder.name, "¿Qué deseas hacer?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Editar",
        onPress: onEdit,
        style: "default",
      },
      {
        text: "Eliminar",
        onPress: onDelete,
        style: "destructive",
      },
    ]);
  };

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

        <TouchableOpacity onPress={handleMenuPress}>
          <MoreHorizontal size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};
