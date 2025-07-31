import React, { useState } from "react";
import { View, SafeAreaView, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, Plus } from "lucide-react-native";

import { Typography, Button, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { useAppStore } from "@/store/useAppStore";
import { RoutineInfoForm } from "./routine-info-form";
import { BlockCard } from "./block-card";

export const CreateRoutineFeature = () => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");
  const { addRoutine } = useAppStore();

  const [routineName, setRoutineName] = useState("Mi Nueva Rutina");
  const [routineDescription, setRoutineDescription] = useState(
    "Descripción de la rutina"
  );
  const [blocks, setBlocks] = useState<any[]>([]);

  const handleSaveRoutine = () => {
    if (!routineName.trim()) {
      Alert.alert("Error", "El nombre de la rutina es obligatorio");
      return;
    }

    const newRoutine = {
      id: Date.now().toString(),
      name: routineName,
      description: routineDescription,
      folderId: undefined,
      estimatedDurationMinutes: 45,
      difficultyLevel: "intermediate" as const,
      blocks: blocks.map((block, index) => ({
        id: block.id,
        orderIndex: index,
        type: block.type as "individual" | "superset" | "circuit" | "dropset",
        restTimeSeconds: 90,
        exercises: [],
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addRoutine(newRoutine);
    router.back();
  };

  const addBlock = (type: string) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      name:
        type === "superset"
          ? "Nueva Superserie"
          : type === "circuit"
            ? "Nuevo Circuito"
            : "Nuevo Bloque",
      exerciseCount: 0,
    };

    setBlocks([...blocks, newBlock]);
  };

  const deleteBlock = (blockId: string) => {
    setBlocks(blocks.filter((b) => b.id !== blockId));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          icon={<ArrowLeft size={20} color={colors.text} />}
        >
          {""}
        </Button>

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Typography variant="h5" weight="semibold">
            Nueva Rutina
          </Typography>
        </View>

        <Button variant="primary" size="sm" onPress={handleSaveRoutine}>
          Guardar
        </Button>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          {/* Routine Info */}
          <RoutineInfoForm
            routineName={routineName}
            routineDescription={routineDescription}
          />

          {/* Blocks Section */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Typography variant="h6" weight="semibold">
                Bloques de Entrenamiento
              </Typography>
              <Typography variant="body2" color="textMuted">
                {blocks.length} {blocks.length === 1 ? "bloque" : "bloques"}
              </Typography>
            </View>

            {/* Add Block Buttons */}
            <View style={{ gap: 12, marginBottom: 20 }}>
              <Button
                variant="outline"
                fullWidth
                icon={<Plus size={20} color={colors.primary[500]} />}
                iconPosition="left"
                onPress={() => addBlock("individual")}
              >
                Agregar Bloque Individual
              </Button>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <Button
                  variant="outline"
                  style={{ flex: 1 }}
                  icon={<Plus size={18} color={colors.primary[500]} />}
                  onPress={() => addBlock("superset")}
                >
                  Superserie
                </Button>
                <Button
                  variant="outline"
                  style={{ flex: 1 }}
                  icon={<Plus size={18} color={colors.primary[500]} />}
                  onPress={() => addBlock("circuit")}
                >
                  Circuito
                </Button>
              </View>
            </View>

            {/* Blocks List */}
            {blocks.length === 0 ? (
              <Card variant="outlined" padding="lg">
                <View style={{ alignItems: "center", paddingVertical: 20 }}>
                  <Typography
                    variant="body1"
                    color="textMuted"
                    style={{ marginBottom: 8 }}
                  >
                    No hay bloques agregados
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textMuted"
                    style={{ textAlign: "center" }}
                  >
                    Agrega bloques para estructurar tu rutina de entrenamiento
                  </Typography>
                </View>
              </Card>
            ) : (
              <View style={{ gap: 12 }}>
                {blocks.map((block) => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    onDelete={deleteBlock}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
