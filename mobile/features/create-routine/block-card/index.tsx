import React from "react";
import { View } from "react-native";
import { Trash2 } from "lucide-react-native";
import { Typography, Card, Button } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

interface Block {
  id: string;
  type: string;
  name: string;
  exerciseCount: number;
}

interface BlockCardProps {
  block: Block;
  onDelete: (blockId: string) => void;
}

export const BlockCard: React.FC<BlockCardProps> = ({ block, onDelete }) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const getBlockTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      individual: "Bloque Individual",
      superset: "Superserie",
      circuit: "Circuito",
      dropset: "Drop Set",
    };
    return typeMap[type] || "Bloque";
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "superset":
        return colors.warning[500];
      case "circuit":
        return colors.info[500];
      default:
        return colors.primary[500];
    }
  };

  return (
    <Card
      variant="outlined"
      padding="lg"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: getBorderColor(block.type),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                backgroundColor: colors.gray[100],
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                marginRight: 8,
              }}
            >
              <Typography variant="caption" color="textMuted" weight="medium">
                {getBlockTypeDisplay(block.type)}
              </Typography>
            </View>
          </View>

          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 4 }}
          >
            {block.name}
          </Typography>

          <Typography variant="body2" color="textMuted">
            {block.exerciseCount} ejercicios • Sin configurar
          </Typography>
        </View>

        <Button
          variant="ghost"
          size="sm"
          onPress={() => onDelete(block.id)}
          icon={<Trash2 size={16} color={colors.error[500]} />}
        >
          {""}
        </Button>
      </View>

      <View style={{ marginTop: 12, gap: 8 }}>
        <Button variant="outline" size="sm" fullWidth>
          Agregar Ejercicios
        </Button>
      </View>
    </Card>
  );
};
