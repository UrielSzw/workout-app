import React from "react";
import { View } from "react-native";
import { Typography, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

interface RoutineInfoFormProps {
  routineName: string;
  routineDescription: string;
}

export const RoutineInfoForm: React.FC<RoutineInfoFormProps> = ({
  routineName,
  routineDescription,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  return (
    <Card variant="outlined" padding="lg" style={{ marginBottom: 24 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Información de la Rutina
      </Typography>

      <View style={{ marginBottom: 16 }}>
        <Typography
          variant="body2"
          color="textMuted"
          style={{ marginBottom: 8 }}
        >
          Nombre de la rutina
        </Typography>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.background,
            padding: 12,
          }}
        >
          <Typography variant="body1">{routineName}</Typography>
        </View>
      </View>

      <View>
        <Typography
          variant="body2"
          color="textMuted"
          style={{ marginBottom: 8 }}
        >
          Descripción
        </Typography>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.background,
            padding: 12,
            minHeight: 80,
          }}
        >
          <Typography variant="body1" color="textMuted">
            {routineDescription}
          </Typography>
        </View>
      </View>
    </Card>
  );
};
