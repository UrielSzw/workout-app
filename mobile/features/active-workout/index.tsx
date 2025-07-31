import React from "react";
import { View, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { X, Play, Pause, SkipForward } from "lucide-react-native";

import { Typography, Button } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { useAppStore } from "@/store/useAppStore";
import { TimerCard } from "./timer-card";
import { CurrentBlockCard } from "./current-block-card";

export const ActiveWorkoutFeature = () => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");
  const { activeWorkout, finishWorkout } = useAppStore();

  const handleFinishWorkout = () => {
    finishWorkout();
    router.back();
  };

  const handlePauseWorkout = () => {
    router.back();
  };

  if (!activeWorkout) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Typography
            variant="h5"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            No hay entrenamiento activo
          </Typography>
          <Button variant="primary" onPress={() => router.back()}>
            Volver
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View style={{ flex: 1 }}>
          <Typography variant="h5" weight="semibold">
            {activeWorkout.routineName}
          </Typography>
          <Typography variant="body2" color="textMuted">
            Entrenamiento en progreso
          </Typography>
        </View>

        <Button
          variant="ghost"
          size="sm"
          onPress={handlePauseWorkout}
          icon={<X size={20} color={colors.textMuted} />}
        >
          {""}
        </Button>
      </View>

      {/* Content */}
      <View style={{ flex: 1, padding: 20 }}>
        {/* Timer Card */}
        <TimerCard startedAt={activeWorkout.startedAt} />

        {/* Current Block */}
        <CurrentBlockCard />

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<Play size={24} color="#ffffff" />}
            iconPosition="left"
          >
            Completar Set Actual
          </Button>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button
              variant="outline"
              style={{ flex: 1 }}
              icon={<Pause size={20} color={colors.primary[500]} />}
            >
              Pausar
            </Button>
            <Button
              variant="outline"
              style={{ flex: 1 }}
              icon={<SkipForward size={20} color={colors.primary[500]} />}
            >
              Saltar Set
            </Button>
          </View>

          <Button variant="error" fullWidth onPress={handleFinishWorkout}>
            Finalizar Entrenamiento
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
