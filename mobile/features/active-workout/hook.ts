import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { activeWorkoutStore } from '@/store/active-workout-store';
import {
  IActiveSet,
  IActiveExerciseInBlock,
  IActiveBlock,
} from '@/types/active-workout';
import { IRoutine, IRepsType, ISetType } from '@/types/routine';
import { mainStore } from '@/store/main-store';

export const useActiveWorkout = () => {
  const { updateExercisesSets } = mainStore();
  const {
    activeWorkout,
    isWorkoutActive,
    isLoading,
    startWorkout,
    finishWorkout,
    cancelWorkout,
    completeSet,
    uncompleteSet,
    updateSet,
    addSetToExercise,
    getWorkoutProgress,
    calculateTotalVolume,
    getAverageRpe,
    getExerciseHistory,
    loadFromStorage,
  } = activeWorkoutStore();

  // UI State
  const [restTimer, setRestTimer] = useState<{
    timeRemaining: number;
    totalTime: number;
    isActive: boolean;
    startedAt: number; // timestamp para identificar timer único
  } | null>(null);

  // Bottom sheet refs
  const restTimerSheetRef = useRef<BottomSheetModal>(null);
  const repsTypeSheetRef = useRef<BottomSheetModal>(null);
  const setTypeSheetRef = useRef<BottomSheetModal>(null);
  const exerciseSelectorRef = useRef<BottomSheetModal>(null);

  // Current editing state
  const [currentSetData, setCurrentSetData] = useState<{
    exerciseId: string;
    setId: string;
    field: 'repsType' | 'type';
    current: IRepsType | ISetType;
  } | null>(null);

  // Exercise selector state
  const [exerciseSelectorVisible, setExerciseSelectorVisible] = useState(false);

  // Load active workout on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Initialize workout from routine
  const handleStartWorkout = async (routine: IRoutine) => {
    try {
      await startWorkout(routine);
    } catch {
      Alert.alert('Error', 'No se pudo iniciar el entrenamiento');
    }
  };

  // Workout contro
  const handleFinishWorkout = async (elapsedTime: number) => {
    if (!activeWorkout) return;

    const completedSets = getWorkoutProgress().completed;
    if (completedSets === 0) {
      Alert.alert(
        'Sin series completadas',
        '¿Estás seguro de que quieres finalizar sin completar ninguna serie?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Finalizar',
            onPress: () => performFinishWorkout(elapsedTime),
          },
        ],
      );
      return;
    }

    performFinishWorkout(elapsedTime);
  };

  const performFinishWorkout = async (elapsedTime: number) => {
    try {
      if (!activeWorkout) return;

      updateExercisesSets(activeWorkout);

      const workoutHistory = await finishWorkout();

      // Check if routine was modified and ask user
      if (workoutHistory.hadModifications) {
        Alert.alert(
          'Rutina Modificada',
          'Realizaste cambios durante el entrenamiento. ¿Quieres actualizar la rutina original?',
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Actualizar',
              onPress: () => handleUpdateOriginalRoutine(workoutHistory),
            },
          ],
        );
      }

      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo finalizar el entrenamiento');
    }
  };

  const handleUpdateOriginalRoutine = async (workoutHistory: any) => {
    // TODO: Implement logic to update original routine
    // This would involve converting the activeWorkout back to a routine format
    console.log('Update original routine:', workoutHistory);
  };

  const handleExitWorkout = () => {
    Alert.alert(
      'Confirmar',
      'Esto eliminará todo el progreso del entrenamiento. ¿Estás seguro?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, eliminar',
          style: 'destructive',
          onPress: () => {
            cancelWorkout();
            router.back();
          },
        },
      ],
    );
  };

  // Set operations
  const handleCompleteSet = async (
    exerciseId: string,
    setId: string,
    completionData: {
      actualWeight?: string;
      actualReps?: string;
      actualRpe?: number;
    },
  ) => {
    // Validate required data
    const set = findSetById(exerciseId, setId);
    if (!set) return;

    const weight = completionData.actualWeight || set.weight;
    const reps = completionData.actualReps || set?.repsRange?.min || set.reps;

    if (!weight || !reps) {
      Alert.alert('Datos incompletos', 'Por favor ingresa peso y repeticiones');
      return;
    }

    // Complete the set
    completeSet(exerciseId, setId, {
      ...completionData,
      restTimeUsedSeconds: 0, // Will be updated by rest timer
    });

    // Start rest timer if applicable
    const exercise = findExerciseById(exerciseId);
    const block = findBlockByExerciseId(exerciseId);

    if (exercise && block && shouldShowRestTimer(set, exercise, block)) {
      startRestTimer(block.restTimeSeconds);
    }
  };

  const handleUncompleteSet = (exerciseId: string, setId: string) => {
    uncompleteSet(exerciseId, setId);
  };

  const handleUpdateSetValue = (
    exerciseId: string,
    setId: string,
    field: string,
    value: string,
  ) => {
    updateSet(exerciseId, setId, { [field]: value });
  };

  // Rest timer operations
  const startRestTimer = (seconds: number) => {
    setRestTimer({
      timeRemaining: seconds,
      totalTime: seconds,
      isActive: true,
      startedAt: Date.now(), // timestamp único para este timer
    });
    console.log('SHOW');
    restTimerSheetRef.current?.present();
  };

  const skipRestTimer = () => {
    setRestTimer(null);
    restTimerSheetRef.current?.dismiss();
  };

  const adjustRestTimer = (newTimeSeconds: number) => {
    setRestTimer((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        timeRemaining: Math.max(0, newTimeSeconds),
      };
    });
  };

  // Bottom sheet operations
  const handleShowRepsTypeSheet = (
    exerciseId: string,
    setId: string,
    current: IRepsType,
  ) => {
    setCurrentSetData({
      exerciseId,
      setId,
      field: 'repsType',
      current,
    });
    repsTypeSheetRef.current?.present();
  };

  const handleShowSetTypeSheet = (
    exerciseId: string,
    setId: string,
    current: ISetType,
  ) => {
    setCurrentSetData({
      exerciseId,
      setId,
      field: 'type',
      current,
    });
    setTypeSheetRef.current?.present();
  };

  const handleRepsTypeSelect = (repsType: IRepsType) => {
    if (!currentSetData) return;

    updateSet(currentSetData.exerciseId, currentSetData.setId, { repsType });
    setCurrentSetData(null);
    repsTypeSheetRef.current?.dismiss();
  };

  const handleSetTypeSelect = (setType: ISetType) => {
    if (!currentSetData) return;

    updateSet(currentSetData.exerciseId, currentSetData.setId, {
      type: setType,
    });
    setCurrentSetData(null);
    setTypeSheetRef.current?.dismiss();
  };

  // Add operations
  const handleAddSetToExercise = (exerciseId: string) => {
    const exercise = findExerciseById(exerciseId);
    if (!exercise) return;

    const newSetNumber = exercise.sets.length + 1;
    addSetToExercise(exerciseId, {
      setNumber: newSetNumber,
      type: 'normal',
      completed: false,
      repsType: 'reps',
    });
  };

  const handleAddExercise = (blockId: string) => {
    setExerciseSelectorVisible(true);
    exerciseSelectorRef.current?.present();
    console.log('Add exercise to block:', blockId);
  };

  // Helper functions
  const findSetById = (
    exerciseId: string,
    setId: string,
  ): IActiveSet | null => {
    if (!activeWorkout) return null;

    for (const block of activeWorkout.blocks) {
      for (const exercise of block.exercises) {
        if (exercise.id === exerciseId) {
          const set = exercise.sets.find((s) => s.id === setId);
          return set || null;
        }
      }
    }
    return null;
  };

  const findExerciseById = (
    exerciseId: string,
  ): IActiveExerciseInBlock | null => {
    if (!activeWorkout) return null;

    for (const block of activeWorkout.blocks) {
      const exercise = block.exercises.find((e) => e.id === exerciseId);
      if (exercise) return exercise;
    }
    return null;
  };

  const findBlockByExerciseId = (exerciseId: string): IActiveBlock | null => {
    if (!activeWorkout) return null;

    for (const block of activeWorkout.blocks) {
      if (block.exercises.some((e) => e.id === exerciseId)) {
        return block;
      }
    }
    return null;
  };

  const shouldShowRestTimer = (
    set: IActiveSet,
    exercise: IActiveExerciseInBlock,
    block: IActiveBlock,
  ): boolean => {
    // Don't show rest timer for drop sets or rest-pause sets (should be done immediately)
    if (set.type === 'drop' || set.type === 'rest-pause') {
      return false;
    }

    // Don't show for the last set of the last exercise in a block
    const isLastExercise =
      block.exercises[block.exercises.length - 1].id === exercise.id;
    const isLastSet = exercise.sets[exercise.sets.length - 1].id === set.id;

    if (isLastExercise && isLastSet) {
      return false;
    }

    return block.restTimeSeconds > 0;
  };

  const getWorkoutStats = () => {
    if (!activeWorkout)
      return {
        completed: 0,
        total: 0,
        percentage: 0,
        volume: 0,
        averageRpe: undefined,
      };

    const progress = getWorkoutProgress();
    return {
      ...progress,
      volume: calculateTotalVolume(),
      averageRpe: getAverageRpe(),
    };
  };

  return {
    // State
    activeWorkout,
    isWorkoutActive,
    isLoading,
    restTimer,
    exerciseSelectorVisible,

    // Refs
    restTimerSheetRef,
    repsTypeSheetRef,
    setTypeSheetRef,
    exerciseSelectorRef,

    // Current editing
    currentSetData,

    // Workout controls
    handleStartWorkout,
    handleFinishWorkout,
    handleExitWorkout,

    // Set operations
    handleCompleteSet,
    handleUncompleteSet,
    handleUpdateSetValue,

    // Rest timer
    startRestTimer,
    skipRestTimer,
    adjustRestTimer,

    // Bottom sheets
    handleShowRepsTypeSheet,
    handleShowSetTypeSheet,
    handleRepsTypeSelect,
    handleSetTypeSelect,

    // Add operations
    handleAddSetToExercise,
    handleAddExercise,
    setExerciseSelectorVisible,

    // Getters
    getWorkoutStats,
    getExerciseHistory,
  };
};
