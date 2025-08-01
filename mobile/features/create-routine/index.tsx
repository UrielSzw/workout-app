import React, { useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import { Typography, Button, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { RoutineInfoForm } from "./routine-info-form";
import { BlockRow } from "./BlockRow";
import { ExerciseSelectorModal } from "./exercise-selector-modal";
import { SetTypeBottomSheet } from "./SetTypeBottomSheet";
import { RepsTypeBottomSheet } from "./RepsTypeBottomSheet";
import { RestTimeBottomSheet } from "./RestTimeBottomSheet";
import { Exercise } from "@/data/mockExercises";

interface SetData {
  id: string;
  setNumber: number;
  weight?: string;
  reps?: string;
  type:
    | "normal"
    | "warmup"
    | "drop"
    | "failure"
    | "cluster"
    | "rest-pause"
    | "mechanical";
  completed: boolean;
  notes?: string;
  repsType: "reps" | "range" | "time" | "distance";
  repsValue?: string;
  repsRange?: { min: string; max: string };
}

interface ExerciseInBlock {
  id: string;
  exercise: Exercise;
  sets: SetData[];
  orderIndex: number;
  notes?: string;
}

interface BlockData {
  id: string;
  type: "individual" | "superset" | "circuit";
  orderIndex: number;
  exercises: ExerciseInBlock[];
  restTimeSeconds: number;
  restBetweenExercisesSeconds: number;
  name?: string;
}

// Legacy interface para compatibilidad durante la transición
interface ExerciseData {
  id: string;
  exercise: Exercise;
  sets: SetData[];
  restTimeSeconds: number;
  notes?: string;
  blockType?: "individual" | "superset" | "circuit" | "dropset";
  blockId?: string;
}

export const CreateRoutineFeature = () => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const [routineName] = useState("Mi Nueva Rutina");
  const [routineDescription] = useState("Descripción de la rutina");
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [globalRepsType, setGlobalRepsType] = useState<
    "reps" | "range" | "time" | "distance"
  >("reps");

  // Modal states
  const [exerciseSelectorVisible, setExerciseSelectorVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  // Bottom sheet states
  const [currentSetId, setCurrentSetId] = useState<string | null>(null);
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(
    null
  );
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [currentRestTime, setCurrentRestTime] = useState<number>(90);
  const [currentRestTimeType, setCurrentRestTimeType] = useState<
    "between-rounds" | "between-exercises"
  >("between-rounds");

  // Bottom sheet refs
  const setTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const repsTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const restTimeBottomSheetRef = useRef<BottomSheetModal>(null);

  // Helper Functions
  const calculateBlockType = (block: BlockData): BlockData["type"] => {
    if (block.exercises.length === 1) return "individual";
    return block.restBetweenExercisesSeconds === 0 ? "superset" : "circuit";
  };

  const generateBlockName = (type: BlockData["type"]): string => {
    switch (type) {
      case "superset":
        return "Superserie";
      case "circuit":
        return "Circuito";
      default:
        return "";
    }
  };

  const createDefaultSets = (): SetData[] => [
    {
      id: `set_${Date.now()}_1`,
      setNumber: 1,
      weight: "",
      reps: "",
      type: "normal",
      completed: false,
      repsType: "reps",
    },
    {
      id: `set_${Date.now()}_2`,
      setNumber: 2,
      weight: "",
      reps: "",
      type: "normal",
      completed: false,
      repsType: "reps",
    },
    {
      id: `set_${Date.now()}_3`,
      setNumber: 3,
      weight: "",
      reps: "",
      type: "normal",
      completed: false,
      repsType: "reps",
    },
  ];

  const calculateEstimatedDuration = () => {
    let totalMinutes = 0;
    blocks.forEach((block) => {
      block.exercises.forEach((exerciseInBlock) => {
        const sets = exerciseInBlock.sets.filter(
          (set) => set.type !== "warmup"
        ).length;
        const setsTime = sets * 0.5; // 30 seconds per set
        const restTime = (sets - 1) * (block.restTimeSeconds / 60);
        totalMinutes += setsTime + restTime;
      });
    });
    return Math.max(15, Math.round(totalMinutes));
  };

  const handleSaveRoutine = () => {
    if (!routineName.trim()) {
      Alert.alert("Error", "El nombre de la rutina es obligatorio");
      return;
    }

    if (blocks.length === 0) {
      Alert.alert("Error", "Agrega al menos un ejercicio a la rutina");
      return;
    }

    // Flatten blocks to exercises for saving
    const exercisesForSave = blocks.flatMap((block, blockIndex) =>
      block.exercises.map((exerciseInBlock, exerciseIndex) => {
        const exerciseData: any = {
          id: exerciseInBlock.id,
          exerciseId: exerciseInBlock.exercise.id,
          orderIndex: blockIndex * 100 + exerciseIndex, // Ensure unique ordering
          sets: exerciseInBlock.sets.map((set, setIndex) => ({
            id: set.id,
            setNumber: setIndex + 1,
            type: set.type,
            targetWeight: set.weight,
            targetReps: set.reps,
            notes: set.notes,
          })),
          notes: exerciseInBlock.notes,
          blockType: calculateBlockType(block),
        };

        // For individual exercises: use restTimeSeconds (between sets)
        if (block.exercises.length === 1) {
          exerciseData.restTimeSeconds = block.restTimeSeconds;
        } else {
          // For blocks: use restBetweenExercisesSeconds as restTimeSeconds and add restBetweenRoundsSeconds
          exerciseData.restTimeSeconds = block.restBetweenExercisesSeconds;
          exerciseData.restBetweenRoundsSeconds = block.restTimeSeconds;
          exerciseData.blockId = block.id;
        }

        return exerciseData;
      })
    );

    const newRoutine = {
      id: Date.now().toString(),
      name: routineName,
      description: routineDescription,
      estimatedDurationMinutes: calculateEstimatedDuration(),
      difficultyLevel: "intermediate" as const,
      exercises: exercisesForSave,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("🚀 RUTINA CREADA:", JSON.stringify(newRoutine, null, 2));

    Alert.alert(
      "¡Rutina Creada! 🎉",
      `Tu rutina "${routineName}" ha sido creada exitosamente. Revisa la consola para ver los detalles completos.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const handleSelectExercise = (exercise: Exercise) => {
    if (selectedExercises.find((ex) => ex.id === exercise.id)) {
      setSelectedExercises(
        selectedExercises.filter((ex) => ex.id !== exercise.id)
      );
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleAddAsIndividual = () => {
    if (selectedExercises.length === 0) return;

    const newBlocks = selectedExercises.map((exercise, i) => ({
      id: `block_${Date.now()}_${i}`,
      type: "individual" as const,
      orderIndex: blocks.length + i,
      exercises: [
        {
          id: `exercise_${Date.now()}_${i}`,
          exercise,
          sets: createDefaultSets(),
          orderIndex: 0,
        },
      ],
      restTimeSeconds: 90,
      restBetweenExercisesSeconds: 0,
    }));

    setBlocks([...blocks, ...newBlocks]);
    setSelectedExercises([]);
    setExerciseSelectorVisible(false);
  };

  const handleAddAsBlock = () => {
    if (selectedExercises.length < 2) return;

    const newBlock: BlockData = {
      id: `block_${Date.now()}`,
      type: "superset", // Always start as superset
      orderIndex: blocks.length,
      exercises: selectedExercises.map((exercise, i) => ({
        id: `exercise_${Date.now()}_${i}`,
        exercise,
        sets: createDefaultSets(),
        orderIndex: i,
      })),
      restTimeSeconds: 90,
      restBetweenExercisesSeconds: 0, // No rest = superset
      name: "Superserie",
    };

    setBlocks([...blocks, newBlock]);
    setSelectedExercises([]);
    setExerciseSelectorVisible(false);
  };

  // FASE 4: Block Management Functions
  const handleDeleteBlock = (blockId: string) => {
    setBlocks((currentBlocks) =>
      currentBlocks.filter((block) => block.id !== blockId)
    );
  };

  const handleConvertToIndividual = (blockId: string) => {
    setBlocks((currentBlocks) => {
      const blockToConvert = currentBlocks.find(
        (block) => block.id === blockId
      );
      if (!blockToConvert) return currentBlocks;

      // Remove the original block and add individual blocks for each exercise
      const otherBlocks = currentBlocks.filter((block) => block.id !== blockId);
      const individualBlocks: BlockData[] = blockToConvert.exercises.map(
        (exerciseInBlock, index) => ({
          id: Date.now().toString() + index,
          type: "individual" as const,
          orderIndex: otherBlocks.length + index,
          exercises: [exerciseInBlock],
          restTimeSeconds: blockToConvert.restTimeSeconds,
          restBetweenExercisesSeconds: 0,
          name: `Ejercicio Individual ${otherBlocks.length + index + 1}`,
        })
      );

      return [...otherBlocks, ...individualBlocks];
    });
  };

  const handleUpdateBlock = (
    blockId: string,
    updatedData: Partial<BlockData>
  ) => {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === blockId ? { ...block, ...updatedData } : block
      )
    );
  };

  const handleShowBlockRestTimeBottomSheet = (
    blockId: string,
    currentRestTime: number,
    type: "between-rounds" | "between-exercises"
  ) => {
    setCurrentBlockId(blockId);
    setCurrentRestTime(currentRestTime);
    setCurrentRestTimeType(type);
    restTimeBottomSheetRef.current?.present();
  };

  const handleBlockRestTimeSelect = (restTimeSeconds: number) => {
    if (currentBlockId) {
      if (currentRestTimeType === "between-exercises") {
        // When updating rest between exercises, also update block type
        const updatedBlock: Partial<BlockData> = {
          restBetweenExercisesSeconds: restTimeSeconds,
        };

        // Auto-update block type based on rest time
        if (restTimeSeconds > 0) {
          updatedBlock.type = "circuit";
          updatedBlock.name = "Circuito";
        } else {
          updatedBlock.type = "superset";
          updatedBlock.name = "Superserie";
        }

        handleUpdateBlock(currentBlockId, updatedBlock);
      } else {
        handleUpdateBlock(currentBlockId, { restTimeSeconds });
      }
    }
    restTimeBottomSheetRef.current?.dismiss();
  };

  // Legacy handler for backward compatibility (we'll remove this later)

  const handleDeleteExercise = (exerciseId: string) => {
    setBlocks(
      (currentBlocks) =>
        currentBlocks
          .map((block) => ({
            ...block,
            exercises: block.exercises.filter((ex) => ex.id !== exerciseId),
          }))
          .filter((block) => block.exercises.length > 0) // Elimina bloques vacíos
    );
  };

  const handleUpdateExercise = (
    exerciseId: string,
    updatedData: Partial<ExerciseInBlock>
  ) => {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => ({
        ...block,
        exercises: block.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, ...updatedData } : ex
        ),
      }))
    );
  };

  const handleCreateSuperset = (exerciseIds: string[]) => {
    // Esta función será reemplazada por handleAddAsBlock
    // Por ahora comentada hasta completar la migración
    console.log(
      "handleCreateSuperset deprecated, use handleAddAsBlock instead"
    );
  };

  const handleShowSetTypeBottomSheet = (setId: string, exerciseId: string) => {
    setCurrentSetId(setId);
    setCurrentExerciseId(exerciseId);
    setTypeBottomSheetRef.current?.present();
  };

  const handleChangeGlobalRepsType = () => {
    repsTypeBottomSheetRef.current?.present();
  };

  const handleSetTypeSelect = (setType: SetData["type"]) => {
    if (currentSetId && currentExerciseId) {
      setBlocks((currentBlocks) =>
        currentBlocks.map((block) => ({
          ...block,
          exercises: block.exercises.map((ex) => {
            if (ex.id === currentExerciseId) {
              const updatedSets = ex.sets.map((set) =>
                set.id === currentSetId ? { ...set, type: setType } : set
              );
              return { ...ex, sets: updatedSets };
            }
            return ex;
          }),
        }))
      );
    }
    setTypeBottomSheetRef.current?.dismiss();
  };

  const handleDeleteSet = () => {
    if (currentSetId && currentExerciseId) {
      setBlocks((currentBlocks) =>
        currentBlocks.map((block) => ({
          ...block,
          exercises: block.exercises.map((ex) => {
            if (ex.id === currentExerciseId) {
              const filteredSets = ex.sets.filter(
                (set) => set.id !== currentSetId
              );
              // Renumber sets
              const renumberedSets = filteredSets.map((set, index) => ({
                ...set,
                setNumber: index + 1,
              }));
              return { ...ex, sets: renumberedSets };
            }
            return ex;
          }),
        }))
      );
    }
    setTypeBottomSheetRef.current?.dismiss();
  };

  const handleRepsTypeSelect = (
    repsType: "reps" | "range" | "time" | "distance"
  ) => {
    setGlobalRepsType(repsType);
    repsTypeBottomSheetRef.current?.dismiss();
  };

  const handleShowRestTimeBottomSheet = (
    exerciseId: string,
    restTime: number
  ) => {
    setCurrentExerciseId(exerciseId);
    setCurrentRestTime(restTime);
    restTimeBottomSheetRef.current?.present();
  };

  const handleRestTimeSelect = (restTimeSeconds: number) => {
    if (currentExerciseId) {
      // En la nueva estructura, restTimeSeconds se almacena a nivel de bloque
      setBlocks((currentBlocks) =>
        currentBlocks.map((block) => ({
          ...block,
          restTimeSeconds: block.exercises.some(
            (ex) => ex.id === currentExerciseId
          )
            ? restTimeSeconds
            : block.restTimeSeconds,
        }))
      );
    }
    restTimeBottomSheetRef.current?.dismiss();
  };

  const handleBreakSuperset = (blockId: string) => {
    // Esta función será reemplazada por un sistema de gestión de bloques
    console.log(
      "handleBreakSuperset deprecated, will be replaced by block management"
    );
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <Button variant="ghost" size="sm" onPress={() => router.back()}>
                ← Atrás
              </Button>

              <Typography variant="h6" weight="semibold">
                Crear Rutina
              </Typography>

              <Button variant="primary" size="sm" onPress={handleSaveRoutine}>
                Guardar
              </Button>
            </View>

            {/* Routine Information */}
            <RoutineInfoForm
              routineName={routineName}
              routineDescription={routineDescription}
            />

            {/* Exercises List */}
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
                  Ejercicios (
                  {blocks.reduce(
                    (total, block) => total + block.exercises.length,
                    0
                  )}
                  )
                </Typography>

                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setExerciseSelectorVisible(true)}
                >
                  + Agregar Ejercicio
                </Button>
              </View>

              {blocks.length === 0 ? (
                <Card variant="outlined" padding="lg">
                  <View style={{ alignItems: "center", padding: 32 }}>
                    <Typography
                      variant="body2"
                      color="textMuted"
                      style={{ textAlign: "center" }}
                    >
                      Comienza agregando ejercicios a tu rutina
                    </Typography>
                    <Button
                      variant="primary"
                      size="sm"
                      onPress={() => setExerciseSelectorVisible(true)}
                      style={{ marginTop: 16 }}
                    >
                      Seleccionar Ejercicios
                    </Button>
                  </View>
                </Card>
              ) : (
                <View style={{ gap: 16 }}>
                  {blocks.map((blockData, index) => (
                    <BlockRow
                      key={blockData.id}
                      blockData={blockData}
                      index={index}
                      onDeleteBlock={handleDeleteBlock}
                      onConvertToIndividual={handleConvertToIndividual}
                      onUpdateBlock={handleUpdateBlock}
                      onShowSetTypeBottomSheet={handleShowSetTypeBottomSheet}
                      onShowRestTimeBottomSheet={
                        handleShowBlockRestTimeBottomSheet
                      }
                      globalRepsType={globalRepsType}
                      onChangeGlobalRepsType={handleChangeGlobalRepsType}
                    />
                  ))}

                  {/* Add Exercise Button */}
                  <TouchableOpacity
                    onPress={() => setExerciseSelectorVisible(true)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 16,
                      marginTop: 16,
                      borderWidth: 2,
                      borderColor: colors.primary[500],
                      borderStyle: "dashed",
                      borderRadius: 8,
                      backgroundColor: colors.primary[500] + "10",
                    }}
                  >
                    <Plus size={20} color={colors.primary[500]} />
                    <Typography
                      variant="body1"
                      weight="medium"
                      style={{ color: colors.primary[500], marginLeft: 8 }}
                    >
                      Agregar Ejercicio
                    </Typography>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Exercise Selector Modal */}
        <ExerciseSelectorModal
          visible={exerciseSelectorVisible}
          onClose={() => setExerciseSelectorVisible(false)}
          selectedExercises={selectedExercises}
          onSelectExercise={handleSelectExercise}
          onAddAsIndividual={handleAddAsIndividual}
          onAddAsBlock={handleAddAsBlock}
        />

        {/* Bottom Sheets */}
        <SetTypeBottomSheet
          ref={setTypeBottomSheetRef}
          onSelectSetType={handleSetTypeSelect}
          onDeleteSet={handleDeleteSet}
        />

        <RepsTypeBottomSheet
          ref={repsTypeBottomSheetRef}
          currentRepsType={globalRepsType}
          onSelectRepsType={handleRepsTypeSelect}
        />

        <RestTimeBottomSheet
          ref={restTimeBottomSheetRef}
          currentRestTime={currentRestTime}
          onSelectRestTime={handleBlockRestTimeSelect}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
