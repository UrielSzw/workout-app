import { Button, Typography } from "@/components/ui";
import { getThemeColors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Folder } from "lucide-react-native";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";

type Props = {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  handleCreateRoutine: () => void;
  handleCreateFolder: () => void;
};

export const EmptyState: React.FC<Props> = ({
  refreshing,
  onRefresh,
  handleCreateRoutine,
  handleCreateFolder,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 60,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.gray[100],
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Folder size={32} color={colors.textMuted} />
        </View>

        <Typography variant="h6" weight="semibold" style={{ marginBottom: 8 }}>
          No tienes rutinas aún
        </Typography>

        <Typography
          variant="body2"
          color="textMuted"
          align="center"
          style={{ marginBottom: 24 }}
        >
          Crea tu primera rutina para empezar a entrenar
        </Typography>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button variant="primary" onPress={handleCreateRoutine}>
            Crear Primera Rutina
          </Button>
          <Button variant="outline" onPress={handleCreateFolder}>
            Crear Carpeta
          </Button>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};
