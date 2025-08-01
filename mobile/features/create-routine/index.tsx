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
import { ExerciseRow } from "./ExerciseRow";
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
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
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
  const [currentRestTime, setCurrentRestTime] = useState<number>(90);

  // Bottom sheet refs
  const setTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const repsTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const restTimeBottomSheetRef = useRef<BottomSheetModal>(null);

  const calculateEstimatedDuration = () => {
    let totalMinutes = 0;
    exercises.forEach((exerciseData) => {
      const sets = exerciseData.sets.filter(
        (set) => set.type !== "warmup"
      ).length;
      const setsTime = sets * 0.5; // 30 seconds per set
      const restTime = (sets - 1) * (exerciseData.restTimeSeconds / 60);
      totalMinutes += setsTime + restTime;
    });
    return Math.max(15, Math.round(totalMinutes));
  };

  const handleSaveRoutine = () => {
    if (!routineName.trim()) {
      Alert.alert("Error", "El nombre de la rutina es obligatorio");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Error", "Agrega al menos un ejercicio a la rutina");
      return;
    }

    const newRoutine = {
      id: Date.now().toString(),
      name: routineName,
      description: routineDescription,
      estimatedDurationMinutes: calculateEstimatedDuration(),
      difficultyLevel: "intermediate" as const,
      exercises: exercises.map((exerciseData, index) => ({
        id: exerciseData.id,
        exerciseId: exerciseData.exercise.id,
        orderIndex: index,
        sets: exerciseData.sets.map((set, setIndex) => ({
          id: set.id,
          setNumber: setIndex + 1,
          type: set.type,
          targetWeight: set.weight,
          targetReps: set.reps,
          notes: set.notes,
        })),
        restTimeSeconds: exerciseData.restTimeSeconds,
        notes: exerciseData.notes,
        blockType: exerciseData.blockType || "individual",
        blockId: exerciseData.blockId,
      })),
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

  const handleExerciseSelectorClose = () => {
    if (selectedExercises.length > 0) {
      const newExercises = selectedExercises.map((exercise) => ({
        id: Date.now().toString() + Math.random(),
        exercise,
        sets: [
          {
            id: Date.now().toString() + Math.random(),
            setNumber: 1,
            weight: "",
            reps: "",
            type: "normal" as const,
            completed: false,
            repsType: "reps" as const,
          },
          {
            id: Date.now().toString() + Math.random() + 1,
            setNumber: 2,
            weight: "",
            reps: "",
            type: "normal" as const,
            completed: false,
            repsType: "reps" as const,
          },
          {
            id: Date.now().toString() + Math.random() + 2,
            setNumber: 3,
            weight: "",
            reps: "",
            type: "normal" as const,
            completed: false,
            repsType: "reps" as const,
          },
        ],
        restTimeSeconds: 90,
        blockType: "individual" as const,
      }));

      setExercises([...exercises, ...newExercises]);
    }

    setExerciseSelectorVisible(false);
    setSelectedExercises([]);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const handleUpdateExercise = (
    exerciseId: string,
    updatedExercise: Partial<ExerciseData>
  ) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, ...updatedExercise } : ex
      )
    );
  };

  const handleCreateSuperset = (exerciseIds: string[]) => {
    if (exerciseIds.length < 2) return;

    const supersetId = Date.now().toString();
    setExercises(
      exercises.map((ex) =>
        exerciseIds.includes(ex.id)
          ? { ...ex, blockType: "superset", blockId: supersetId }
          : ex
      )
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
      const exerciseIndex = exercises.findIndex(
        (ex) => ex.id === currentExerciseId
      );
      if (exerciseIndex !== -1) {
        const updatedExercise = { ...exercises[exerciseIndex] };
        const setIndex = updatedExercise.sets.findIndex(
          (set) => set.id === currentSetId
        );
        if (setIndex !== -1) {
          updatedExercise.sets[setIndex].type = setType;
          handleUpdateExercise(currentExerciseId, updatedExercise);
        }
      }
    }
    setTypeBottomSheetRef.current?.dismiss();
  };

  const handleDeleteSet = () => {
    if (currentSetId && currentExerciseId) {
      const exerciseIndex = exercises.findIndex(
        (ex) => ex.id === currentExerciseId
      );
      if (exerciseIndex !== -1) {
        const updatedExercise = { ...exercises[exerciseIndex] };
        updatedExercise.sets = updatedExercise.sets.filter(
          (set) => set.id !== currentSetId
        );
        // Renumber sets
        updatedExercise.sets.forEach((set, index) => {
          set.setNumber = index + 1;
        });
        handleUpdateExercise(currentExerciseId, updatedExercise);
      }
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
      handleUpdateExercise(currentExerciseId, { restTimeSeconds });
    }
    restTimeBottomSheetRef.current?.dismiss();
  };

  const handleBreakSuperset = (blockId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.blockId === blockId
          ? { ...ex, blockType: "individual", blockId: undefined }
          : ex
      )
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
                  Ejercicios ({exercises.length})
                </Typography>

                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setExerciseSelectorVisible(true)}
                >
                  + Agregar Ejercicio
                </Button>
              </View>

              {exercises.length === 0 ? (
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
                  {exercises.map((exerciseData, index) => (
                    <ExerciseRow
                      key={exerciseData.id}
                      exerciseData={exerciseData}
                      index={index}
                      onDelete={handleDeleteExercise}
                      onUpdate={handleUpdateExercise}
                      onCreateSuperset={handleCreateSuperset}
                      onBreakSuperset={handleBreakSuperset}
                      onShowSetTypeBottomSheet={handleShowSetTypeBottomSheet}
                      onShowRestTimeBottomSheet={handleShowRestTimeBottomSheet}
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
          onClose={handleExerciseSelectorClose}
          selectedExercises={selectedExercises}
          onSelectExercise={handleSelectExercise}
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
          onSelectRestTime={handleRestTimeSelect}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
