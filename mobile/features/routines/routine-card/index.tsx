import React from "react";
import { View } from "react-native";
import { Edit, Trash2, Play } from "lucide-react-native";

import { Typography, Button, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { Routine } from "@/store/useAppStore";

interface RoutineCardProps {
  routine: Routine;
  onEdit: (routine: Routine) => void;
  onDelete: (routine: Routine) => void;
  onStart: (routine: Routine) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onEdit,
  onDelete,
  onStart,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return colors.success[500];
      case "intermediate":
        return colors.warning[500];
      case "advanced":
        return colors.error[500];
      default:
        return colors.gray[500];
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case "beginner":
        return "Principiante";
      case "intermediate":
        return "Intermedio";
      case "advanced":
        return "Avanzado";
      default:
        return level;
    }
  };

  return (
    <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 4 }}
          >
            {routine.name}
          </Typography>

          {routine.description && (
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginBottom: 8 }}
            >
              {routine.description}
            </Typography>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                backgroundColor: getDifficultyColor(routine.difficultyLevel),
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
                marginRight: 8,
              }}
            >
              <Typography variant="caption" color="white" weight="medium">
                {getDifficultyLabel(routine.difficultyLevel)}
              </Typography>
            </View>

            <Typography variant="caption" color="textMuted">
              {routine.estimatedDurationMinutes} min
            </Typography>

            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginLeft: 8 }}
            >
              • {routine.blocks.length} bloque
              {routine.blocks.length !== 1 ? "s" : ""}
            </Typography>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => onEdit(routine)}
            icon={<Edit size={16} color={colors.textMuted} />}
          >
            {""}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => onDelete(routine)}
            icon={<Trash2 size={16} color={colors.error[500]} />}
          >
            {""}
          </Button>
        </View>
      </View>

      <Button
        variant="primary"
        fullWidth
        onPress={() => onStart(routine)}
        icon={<Play size={20} color="#ffffff" />}
        iconPosition="left"
        style={{ marginTop: 12 }}
      >
        Iniciar Entrenamiento
      </Button>
    </Card>
  );
};
