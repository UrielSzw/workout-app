import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { activeWorkoutStore } from '@/store/active-workout-store';
import {
  IActiveSet,
  IActiveExerciseInBlock,
  IActiveBlock,
  IActiveWorkout,
} from '@/types/active-workout';
import {
  IRoutine,
  IRepsType,
  ISetType,
  IBlock,
  IExerciseInBlock,
  ISet,
} from '@/types/routine';
import { mainStore } from '@/store/main-store';

export const useActiveWorkout = () => {
  const { updateExercisesSets, updateRoutine } = mainStore();
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
    updateBlock,
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
  const restTimeBottomSheetRef = useRef<BottomSheetModal>(null);
  const repsTypeSheetRef = useRef<BottomSheetModal>(null);
  const setTypeSheetRef = useRef<BottomSheetModal>(null);
  const exerciseSelectorRef = useRef<BottomSheetModal>(null);

  // Current editing state
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [currentRestTime, setCurrentRestTime] = useState<number>(90);
  const [currentRestTimeType, setCurrentRestTimeType] = useState<
    'between-rounds' | 'between-exercises'
  >('between-rounds');
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

      const { workoutHistory, originalRoutine } = await finishWorkout();

      // Check if routine was modified and ask user
      if (workoutHistory.hadModifications) {
        Alert.alert(
          'Rutina Modificada',
          'Realizaste cambios durante el entrenamiento. ¿Quieres actualizar la rutina original?',
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Actualizar',
              onPress: () => handleUpdateOriginalRoutine(originalRoutine),
            },
          ],
        );
      }

      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo finalizar el entrenamiento');
    }
  };

  const handleUpdateOriginalRoutine = async (activeWorkout: IActiveWorkout) => {
    const { originalRoutineId, originalRoutine } =
      activeWorkout.routineSnapshot;

    // Crear un nuevo array de bloques basado en los cambios del activeWorkout
    const updatedBlocks: IBlock[] = [];

    for (const activeBlock of activeWorkout.blocks) {
      // Si el bloque fue agregado durante el workout, convertirlo a IBlock
      if (activeBlock.wasAddedDuringWorkout) {
        const newBlock: IBlock = {
          id: activeBlock.originalBlockId || generateNewId(),
          type: activeBlock.type,
          orderIndex: activeBlock.orderIndex,
          exercises: activeBlock.exercises.map((activeExercise) => ({
            id: activeExercise.originalExerciseInBlockId || generateNewId(),
            exercise: {
              id: activeExercise.exercise.id,
              name: activeExercise.exercise.name,
              muscleGroups: activeExercise.exercise.muscleGroups,
              mainMuscleGroup: activeExercise.exercise.mainMuscleGroup,
              equipment: activeExercise.exercise.equipment,
              instructions: activeExercise.exercise.instructions,
              imageUrl: activeExercise.exercise.imageUrl,
              // No incluir userStats en la rutina original
            },
            sets: activeExercise.sets.map((activeSet) => ({
              id: activeSet.originalSetData?.id || generateNewId(),
              setNumber: activeSet.setNumber,
              weight: activeSet.weight,
              reps: activeSet.reps,
              rpe: activeSet.rpe,
              type: activeSet.type,
              completed: false, // Resetear completed para la rutina
              repsType: activeSet.repsType,
              repsValue: activeSet.repsValue,
              repsRange: activeSet.repsRange,
            })),
            orderIndex: activeExercise.orderIndex,
            notes: activeExercise.notes,
          })),
          restTimeSeconds: activeBlock.restTimeSeconds,
          restBetweenExercisesSeconds: activeBlock.restBetweenExercisesSeconds,
          name: activeBlock.name,
        };
        updatedBlocks.push(newBlock);
      }
      // Si el bloque fue modificado, actualizar el bloque original
      else if (activeBlock.wasModifiedFromOriginal) {
        // Buscar el bloque original
        const originalBlock = originalRoutine.blocks.find(
          (block) => block.id === activeBlock.originalBlockId,
        );

        if (originalBlock) {
          const updatedExercises: IExerciseInBlock[] = [];

          for (const activeExercise of activeBlock.exercises) {
            // Si el ejercicio fue agregado durante el workout
            if (activeExercise.wasAddedDuringWorkout) {
              const newExercise: IExerciseInBlock = {
                id: generateNewId(),
                exercise: {
                  id: activeExercise.exercise.id,
                  name: activeExercise.exercise.name,
                  muscleGroups: activeExercise.exercise.muscleGroups,
                  mainMuscleGroup: activeExercise.exercise.mainMuscleGroup,
                  equipment: activeExercise.exercise.equipment,
                  instructions: activeExercise.exercise.instructions,
                  imageUrl: activeExercise.exercise.imageUrl,
                },
                sets: activeExercise.sets.map((activeSet) => ({
                  id: generateNewId(),
                  setNumber: activeSet.setNumber,
                  weight: activeSet.weight,
                  reps: activeSet.reps,
                  rpe: activeSet.rpe,
                  type: activeSet.type,
                  completed: false,
                  repsType: activeSet.repsType,
                  repsValue: activeSet.repsValue,
                  repsRange: activeSet.repsRange,
                })),
                orderIndex: activeExercise.orderIndex,
                notes: activeExercise.notes,
              };
              updatedExercises.push(newExercise);
            }
            // Si el ejercicio fue modificado
            else if (activeExercise.wasModifiedFromOriginal) {
              const originalExercise = originalBlock.exercises.find(
                (ex) => ex.id === activeExercise.originalExerciseInBlockId,
              );

              if (originalExercise) {
                const updatedSets: ISet[] = activeExercise.sets.map(
                  (activeSet) => ({
                    id: activeSet.originalSetData?.id || activeSet.id,
                    setNumber: activeSet.setNumber,
                    weight: activeSet.weight,
                    reps: activeSet.reps,
                    rpe: activeSet.rpe,
                    type: activeSet.type,
                    completed: false,
                    repsType: activeSet.repsType,
                    repsValue: activeSet.repsValue,
                    repsRange: activeSet.repsRange,
                  }),
                );

                const updatedExercise: IExerciseInBlock = {
                  ...originalExercise,
                  sets: updatedSets,
                  orderIndex: activeExercise.orderIndex,
                  notes: activeExercise.notes,
                };
                updatedExercises.push(updatedExercise);
              }
            }
            // Si el ejercicio no fue modificado, mantener el original
            else {
              const originalExercise = originalBlock.exercises.find(
                (ex) => ex.id === activeExercise.originalExerciseInBlockId,
              );
              if (originalExercise) {
                updatedExercises.push(originalExercise);
              }
            }
          }

          const updatedBlock: IBlock = {
            ...originalBlock,
            exercises: updatedExercises,
            restTimeSeconds: activeBlock.restTimeSeconds,
            restBetweenExercisesSeconds:
              activeBlock.restBetweenExercisesSeconds,
            name: activeBlock.name,
            orderIndex: activeBlock.orderIndex,
          };
          updatedBlocks.push(updatedBlock);
        }
      }
      // Si el bloque no fue modificado, mantener el original
      else {
        const originalBlock = originalRoutine.blocks.find(
          (block) => block.id === activeBlock.originalBlockId,
        );
        if (originalBlock) {
          updatedBlocks.push(originalBlock);
        }
      }
    }

    // Actualizar la rutina con los bloques modificados
    updateRoutine(originalRoutineId, {
      blocks: updatedBlocks,
      updatedAt: new Date().toISOString(),
    });
  };

  // Helper function para generar IDs únicos
  const generateNewId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

  const findNextSet = (
    set: IActiveSet,
    exercise: IActiveExerciseInBlock,
  ): IActiveSet | null => {
    if (!activeWorkout) return null;

    const setIndex = exercise.sets.findIndex((s) => s.id === set.id);

    // Find the next set in the current exercise
    if (setIndex !== -1 && setIndex < exercise.sets.length - 1) {
      return exercise.sets[setIndex + 1];
    }

    // If it's the last set of the current exercise, find the next exercise
    return null;
  };

  const shouldShowRestTimer = (
    set: IActiveSet,
    exercise: IActiveExerciseInBlock,
    block: IActiveBlock,
  ): boolean => {
    const blockType = block.type;
    const nextSet = findNextSet(set, exercise);
    const isLastExercise =
      block.exercises[block.exercises.length - 1].id === exercise.id;

    if (blockType === 'individual') {
      // Don't show for the last set of the last exercise in a block
      if (!nextSet) return false;

      // Don't show rest timer for drop sets or rest-pause sets (should be done immediately)
      if (nextSet.type === 'drop' || nextSet.type === 'rest-pause') {
        return false;
      }

      return block.restTimeSeconds > 0;
    } else if (blockType === 'superset') {
      if (!isLastExercise) return false;

      return block.restTimeSeconds > 0;
    } else {
      // Don't show for the last set of the last exercise in a block
      if (isLastExercise && !nextSet) return false;

      // Show rest timer for the last set of the last exercise in a block
      if (isLastExercise) return block.restTimeSeconds > 0;

      return block.restBetweenExercisesSeconds > 0;
    }
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

  // Update rest time
  const handleShowBlockRestTimeBottomSheet = (
    blockId: string,
    currentRestTime: number,
    type: 'between-rounds' | 'between-exercises',
  ) => {
    setCurrentBlockId(blockId);
    setCurrentRestTime(currentRestTime);
    setCurrentRestTimeType(type);
    restTimeBottomSheetRef.current?.present();
  };

  const handleBlockRestTimeSelect = (restTimeSeconds: number) => {
    if (currentBlockId) {
      if (currentRestTimeType === 'between-exercises') {
        // When updating rest between exercises, also update block type
        const updatedBlock: Partial<IActiveBlock> = {
          restBetweenExercisesSeconds: restTimeSeconds,
        };

        // Auto-update block type based on rest time
        if (restTimeSeconds > 0) {
          updatedBlock.type = 'circuit';
          updatedBlock.name = 'Circuito';
        } else {
          updatedBlock.type = 'superset';
          updatedBlock.name = 'Superserie';
        }

        updateBlock(currentBlockId, updatedBlock);
      } else {
        updateBlock(currentBlockId, { restTimeSeconds });
      }
    }

    restTimeBottomSheetRef.current?.dismiss();
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
    restTimeBottomSheetRef,

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

    // Update rest time
    handleBlockRestTimeSelect,
    handleShowBlockRestTimeBottomSheet,
    currentRestTime,
  };
};
