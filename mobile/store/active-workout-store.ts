import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  IActiveWorkout,
  IWorkoutHistory,
  IActiveBlock,
  IActiveExerciseInBlock,
  IActiveSet,
  ICompletedSetHistory,
  IActiveWorkoutRoutineSnapshot,
} from '@/types/active-workout';
import { IRoutine } from '@/types/routine';
import { mainStore } from './main-store';

type IFinishWorkout = {
  workoutHistory: IWorkoutHistory;
  originalRoutine: IActiveWorkout;
};

type ActiveWorkoutStore = {
  // Estado principal
  activeWorkout: IActiveWorkout | null;
  isWorkoutActive: boolean;
  isLoading: boolean;

  // Actions - Workout Lifecycle
  startWorkout: (routine: IRoutine) => Promise<void>;
  finishWorkout: () => Promise<IFinishWorkout>;
  cancelWorkout: () => void;

  // Actions - Modificaciones durante workout
  addBlock: (block: Omit<IActiveBlock, 'id' | 'wasAddedDuringWorkout'>) => void;
  addBlocks: (
    blocks: Omit<IActiveBlock, 'id' | 'wasAddedDuringWorkout'>[],
  ) => void;
  addExerciseToBlock: (
    blockId: string,
    exercise: Omit<IActiveExerciseInBlock, 'id' | 'wasAddedDuringWorkout'>,
  ) => void;
  addSetToExercise: (
    exerciseId: string,
    set: Omit<IActiveSet, 'id' | 'wasModifiedFromOriginal'>,
  ) => void;

  // Actions - Operaciones de sets
  completeSet: (
    exerciseId: string,
    setId: string,
    completionData: {
      actualWeight?: string;
      actualReps?: string;
      actualRpe?: number;
      restTimeUsedSeconds?: number;
    },
  ) => void;
  uncompleteSet: (exerciseId: string, setId: string) => void;
  updateSet: (
    exerciseId: string,
    setId: string,
    updates: Partial<IActiveSet>,
  ) => void;
  updateExercise: (
    exerciseId: string,
    updates: Partial<IActiveExerciseInBlock>,
  ) => void;
  updateBlock: (blockId: string, updates: Partial<IActiveBlock>) => void;

  // Actions - delete
  deleteSet: (exerciseId: string, setId: string) => void;
  deleteBlock: (blockId: string) => void;

  // Actions - Storage & History
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  getExerciseHistory: (
    exerciseId: string,
    limit?: number,
  ) => Promise<ICompletedSetHistory[]>;

  // Helpers/Getters
  getWorkoutProgress: () => {
    completed: number;
    total: number;
    percentage: number;
  };
  hasUnsavedChanges: () => boolean;
  getModificationsSummary: () => {
    addedBlocks: number;
    addedExercises: number;
    addedSets: number;
    modifiedSets: number;
  };
  calculateTotalVolume: () => number;
  getAverageRpe: () => number | undefined;
};

// Storage keys
const STORAGE_KEYS = {
  ACTIVE_WORKOUT: '@workout-app/active-workout',
  WORKOUT_HISTORY: '@workout-app/workout-history',
};

// Helper functions
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createActiveWorkoutFromRoutine = (routine: IRoutine): IActiveWorkout => {
  const snapshot: IActiveWorkoutRoutineSnapshot = {
    originalRoutineId: routine.id,
    originalRoutine: routine,
    snapshotTakenAt: new Date().toISOString(),
  };

  // Obtener ejercicios del store global para acceder a lastSets
  const { exercises } = mainStore.getState();

  const activeBlocks: IActiveBlock[] = routine.blocks.map((block) => ({
    id: generateId(),
    originalBlockId: block.id,
    type: block.type,
    name: block.name,
    exercises: block.exercises.map((exercise) => {
      // Buscar el ejercicio en el store global para obtener lastSets
      const globalExercise = exercises.find(
        (ex) => ex.id === exercise.exercise.id,
      );

      const prevSets = globalExercise?.userStats?.lastSets || [];

      return {
        id: generateId(),
        originalExerciseInBlockId: exercise.id,
        exercise: {
          ...exercise.exercise,
          userStats: {
            ...exercise.exercise.userStats,
            lastSets: prevSets, // Cargar los sets previos aquí
          },
        },
        sets: exercise.sets.map((set) => ({
          ...set,
          id: generateId(),
          completedAt: undefined,
          actualWeight: undefined,
          actualReps: undefined,
          actualRpe: undefined,
          restTimeUsedSeconds: undefined,
          wasModifiedFromOriginal: false,
          originalSetData: { ...set },
        })),
        orderIndex: exercise.orderIndex,
        notes: exercise.notes,
        wasAddedDuringWorkout: false,
        wasModifiedFromOriginal: false,
      };
    }) as IActiveExerciseInBlock[],
    restTimeSeconds: block.restTimeSeconds,
    restBetweenExercisesSeconds: block.restBetweenExercisesSeconds,
    orderIndex: block.orderIndex,
    wasAddedDuringWorkout: false,
    wasModifiedFromOriginal: false,
  }));

  const totalSetsPlanned = activeBlocks.reduce(
    (total, block) =>
      total +
      block.exercises.reduce(
        (blockTotal, exercise) => blockTotal + exercise.sets.length,
        0,
      ),
    0,
  );

  return {
    id: generateId(),
    routineSnapshot: snapshot,
    name: routine.name,
    blocks: activeBlocks,
    startedAt: new Date().toISOString(),
    totalPauseTimeSeconds: 0,
    stats: {
      totalSetsCompleted: 0,
      totalSetsPlanned,
      totalVolumeKg: 0,
    },
    hasModificationsFromOriginal: false,
    wasCompletedSuccessfully: false,
  };
};

// Store implementation
export const activeWorkoutStore = create<ActiveWorkoutStore>((set, get) => ({
  activeWorkout: null,
  isWorkoutActive: false,
  isLoading: false,

  startWorkout: async (routine: IRoutine) => {
    const activeWorkout = createActiveWorkoutFromRoutine(routine);
    set({
      activeWorkout,
      isWorkoutActive: true,
    });
    await get().saveToStorage();
  },

  finishWorkout: async () => {
    const { activeWorkout } = get();
    if (!activeWorkout) throw new Error('No active workout');

    const completedAt = new Date().toISOString();
    const startedAt = new Date(activeWorkout.startedAt);
    const completed = new Date(completedAt);
    const durationSeconds =
      Math.floor((completed.getTime() - startedAt.getTime()) / 1000) -
      activeWorkout.totalPauseTimeSeconds;

    // Crear historial detallado
    const exerciseData = activeWorkout.blocks
      .flatMap((block) =>
        block.exercises.map((exercise) => {
          const completedSets = exercise.sets.filter((set) => set.completedAt);
          const setsHistory: ICompletedSetHistory[] = completedSets.map(
            (set) => ({
              setId: set.id,
              setNumber: set.setNumber,
              type: set.type,
              weight: set.actualWeight || set.weight,
              reps: set.actualReps || set.reps,
              rpe: set.actualRpe || set.rpe,
              completedAt: set.completedAt!,
              notes: undefined, // No tenemos notas a nivel set
            }),
          );

          const totalVolumeKg = completedSets.reduce((total, set) => {
            const weight = parseFloat(set.actualWeight || set.weight || '0');
            const reps = parseFloat(set.actualReps || set.reps || '0');
            return total + weight * reps;
          }, 0);

          return {
            exerciseId: exercise.exercise.id,
            exerciseName: exercise.exercise.name,
            setsCompleted: setsHistory,
            totalVolumeKg,
          };
        }),
      )
      .filter((exercise) => exercise.setsCompleted.length > 0);

    const workoutHistory: IWorkoutHistory = {
      id: generateId(),
      originalRoutineId: activeWorkout.routineSnapshot.originalRoutineId,
      routineName: activeWorkout.name,
      completedAt,
      durationSeconds,
      totalSetsCompleted: activeWorkout.stats.totalSetsCompleted,
      totalVolumeKg: get().calculateTotalVolume(),
      averageRpe: get().getAverageRpe(),
      hadModifications: activeWorkout.hasModificationsFromOriginal,
      exerciseData,
      notes: activeWorkout.notes,
    };

    // Guardar en historial
    const existingHistory = await AsyncStorage.getItem(
      STORAGE_KEYS.WORKOUT_HISTORY,
    );
    const history: IWorkoutHistory[] = existingHistory
      ? JSON.parse(existingHistory)
      : [];
    history.unshift(workoutHistory); // Agregar al inicio
    await AsyncStorage.setItem(
      STORAGE_KEYS.WORKOUT_HISTORY,
      JSON.stringify(history),
    );

    const activeWorkoutSnapshot = { ...activeWorkout };

    // Limpiar workout activo
    set({
      activeWorkout: null,
      isWorkoutActive: false,
    });
    await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);

    return { workoutHistory, originalRoutine: activeWorkoutSnapshot };
  },

  cancelWorkout: () => {
    set({
      activeWorkout: null,
      isWorkoutActive: false,
    });
    AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  },

  addBlock: (blockData) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const newBlock: IActiveBlock = {
      ...blockData,
      id: generateId(),
      wasAddedDuringWorkout: true,
    };

    const updatedWorkout = {
      ...activeWorkout,
      blocks: [...activeWorkout.blocks, newBlock],
      hasModificationsFromOriginal: true,
      stats: {
        ...activeWorkout.stats,
        totalSetsPlanned:
          activeWorkout.stats.totalSetsPlanned +
          newBlock.exercises.reduce((total, ex) => total + ex.sets.length, 0),
      },
    };

    set({ activeWorkout: updatedWorkout });
    get().saveToStorage();
  },

  addBlocks: (blocks: Omit<IActiveBlock, 'id' | 'wasAddedDuringWorkout'>[]) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const newBlocks = blocks.map((block) => ({
      ...block,
      id: generateId(),
      wasAddedDuringWorkout: true,
    }));

    const updatedWorkout = {
      ...activeWorkout,
      blocks: [...activeWorkout.blocks, ...newBlocks],
      hasModificationsFromOriginal: true,
      stats: {
        ...activeWorkout.stats,
        totalSetsPlanned:
          activeWorkout.stats.totalSetsPlanned +
          newBlocks.reduce((total, block) => total + block.exercises.length, 0),
      },
    };

    set({ activeWorkout: updatedWorkout });
    get().saveToStorage();
  },

  addExerciseToBlock: (blockId, exerciseData) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const newExercise: IActiveExerciseInBlock = {
      ...exerciseData,
      id: generateId(),
      wasAddedDuringWorkout: true,
    };

    const updatedBlocks = activeWorkout.blocks.map((block) => {
      if (block.id === blockId) {
        return {
          ...block,
          exercises: [...block.exercises, newExercise],
          wasModifiedFromOriginal: true,
        };
      }
      return block;
    });

    const updatedWorkout = {
      ...activeWorkout,
      blocks: updatedBlocks,
      hasModificationsFromOriginal: true,
      stats: {
        ...activeWorkout.stats,
        totalSetsPlanned:
          activeWorkout.stats.totalSetsPlanned + newExercise.sets.length,
      },
    };

    set({ activeWorkout: updatedWorkout });
    get().saveToStorage();
  },

  addSetToExercise: (exerciseId, setData) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const newSet: IActiveSet = {
      ...setData,
      id: generateId(),
      wasModifiedFromOriginal: false,
    };

    let isBlockUpdated = false;

    const updatedBlocks = activeWorkout.blocks.map((block) => ({
      ...block,
      exercises: block.exercises.map((exercise, exerciseIndex) => {
        if (exerciseIndex === 0) {
          isBlockUpdated = false;
        }

        if (exercise.id === exerciseId) {
          isBlockUpdated = true;

          return {
            ...exercise,
            sets: [...exercise.sets, newSet],
            wasModifiedFromOriginal: true,
          };
        }

        return exercise;
      }),
      wasModifiedFromOriginal: isBlockUpdated,
    }));

    const updatedWorkout = {
      ...activeWorkout,
      blocks: updatedBlocks,
      hasModificationsFromOriginal: true,
      stats: {
        ...activeWorkout.stats,
        totalSetsPlanned: activeWorkout.stats.totalSetsPlanned + 1,
      },
    };

    set({ activeWorkout: updatedWorkout });
    get().saveToStorage();
  },

  completeSet: (exerciseId, setId, completionData) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const completedAt = new Date().toISOString();
    let wasCompleted = false;

    const updatedBlocks: IActiveBlock[] = activeWorkout.blocks.map((block) => ({
      ...block,
      exercises: block.exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) => {
              if (set.id === setId && !set.completedAt) {
                wasCompleted = true;
                return {
                  ...set,
                  completedAt,
                  ...completionData,
                };
              }
              return set;
            }),
          };
        }
        return exercise;
      }),
    }));

    if (wasCompleted) {
      const updatedWorkout: IActiveWorkout = {
        ...activeWorkout,
        blocks: updatedBlocks,
        stats: {
          ...activeWorkout.stats,
          totalSetsCompleted: activeWorkout.stats.totalSetsCompleted + 1,
          totalVolumeKg: get().calculateTotalVolume(),
        },
      };

      set({ activeWorkout: updatedWorkout });
      get().saveToStorage();
    }
  },

  uncompleteSet: (exerciseId, setId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    let wasUncompleted = false;

    const updatedBlocks = activeWorkout.blocks.map((block) => ({
      ...block,
      exercises: block.exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) => {
              if (set.id === setId && set.completedAt) {
                wasUncompleted = true;
                return {
                  ...set,
                  completedAt: undefined,
                  actualWeight: undefined,
                  actualReps: undefined,
                  actualRpe: undefined,
                  restTimeUsedSeconds: undefined,
                };
              }
              return set;
            }),
          };
        }
        return exercise;
      }),
    }));

    if (wasUncompleted) {
      const updatedWorkout = {
        ...activeWorkout,
        blocks: updatedBlocks,
        stats: {
          ...activeWorkout.stats,
          totalSetsCompleted: activeWorkout.stats.totalSetsCompleted - 1,
          totalVolumeKg: get().calculateTotalVolume(),
        },
      };

      set({ activeWorkout: updatedWorkout });
      get().saveToStorage();
    }
  },

  updateSet: (exerciseId, setId, updates) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    let isBlockUpdated = false;

    const updatedBlocks = activeWorkout.blocks.map((block) => ({
      ...block,
      exercises: block.exercises.map((exercise, exerciseIndex) => {
        if (exercise.id === exerciseId) {
          if (exerciseIndex === 0) {
            isBlockUpdated = false;
          }

          return {
            ...exercise,
            sets: exercise.sets.map((set) => {
              if (set.id === setId) {
                isBlockUpdated = true;

                return {
                  ...set,
                  ...updates,
                  wasModifiedFromOriginal: true,
                };
              }
              return set;
            }),
            wasModifiedFromOriginal: true,
          };
        }
        return exercise;
      }),
      wasModifiedFromOriginal: isBlockUpdated,
    }));

    const updatedWorkout = {
      ...activeWorkout,
      blocks: updatedBlocks,
      hasModificationsFromOriginal: true,
    };

    set({ activeWorkout: updatedWorkout });
    get().saveToStorage();
  },

  updateExercise: (exerciseId, updates) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const updatedBlocks = activeWorkout.blocks.map((block) => ({
      ...block,
      exercises: block.exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            ...updates,
            wasModifiedFromOriginal: true,
          };
        }
        return exercise;
      }),
    }));

    const updatedWorkout = {
      ...activeWorkout,
      blocks: updatedBlocks,
      hasModificationsFromOriginal: true,
    };

    set({ activeWorkout: updatedWorkout });
    get().saveToStorage();
  },

  updateBlock: (blockId, updates) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const updatedBlocks = activeWorkout.blocks.map((block) => {
      if (block.id === blockId) {
        return {
          ...block,
          ...updates,
          wasModifiedFromOriginal: true,
        };
      }
      return block;
    });

    const updatedWorkout = {
      ...activeWorkout,
      blocks: updatedBlocks,
      hasModificationsFromOriginal: true,
    };

    set({ activeWorkout: updatedWorkout });
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      set({ isLoading: true });
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);

      if (data) {
        const activeWorkout: IActiveWorkout = JSON.parse(data);
        set({
          activeWorkout,
          isWorkoutActive: true,
        });
      }
    } catch (error) {
      console.error('Error loading active workout:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSet: (exerciseId, setId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    let isBlockUpdated = false;

    const updatedBlocks = activeWorkout.blocks.map((block) => ({
      ...block,
      exercises: block.exercises.map((exercise, exerciseIndex) => {
        if (exerciseIndex === 0) {
          isBlockUpdated = false;
        }

        if (exercise.id === exerciseId) {
          isBlockUpdated = true;

          return {
            ...exercise,
            sets: exercise.sets.filter((set) => set.id !== setId),
            wasModifiedFromOriginal: true,
          };
        }
        return exercise;
      }),
      wasModifiedFromOriginal: isBlockUpdated,
    }));

    const updatedWorkout = {
      ...activeWorkout,
      blocks: updatedBlocks,
      hasModificationsFromOriginal: true,
    };

    set({ activeWorkout: updatedWorkout });
    get().saveToStorage();
  },

  deleteBlock: (blockId: string) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const updatedBlocks = activeWorkout.blocks.filter(
      (block) => block.id !== blockId,
    );

    const updatedWorkout = {
      ...activeWorkout,
      blocks: updatedBlocks,
      hasModificationsFromOriginal: true,
    };

    set({ activeWorkout: updatedWorkout });
    get().saveToStorage();
  },

  saveToStorage: async () => {
    try {
      const { activeWorkout } = get();
      if (activeWorkout) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.ACTIVE_WORKOUT,
          JSON.stringify(activeWorkout),
        );
      }
    } catch (error) {
      console.error('Error saving active workout:', error);
    }
  },

  getExerciseHistory: async (exerciseId: string, limit = 10) => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
      if (!data) return [];

      const history: IWorkoutHistory[] = JSON.parse(data);
      const exerciseHistory: ICompletedSetHistory[] = [];

      for (const workout of history) {
        const exerciseData = workout.exerciseData.find(
          (ex) => ex.exerciseId === exerciseId,
        );
        if (exerciseData) {
          exerciseHistory.push(...exerciseData.setsCompleted);
        }
        if (exerciseHistory.length >= limit) break;
      }

      return exerciseHistory.slice(0, limit);
    } catch (error) {
      console.error('Error loading exercise history:', error);
      return [];
    }
  },

  getWorkoutProgress: () => {
    const { activeWorkout } = get();
    if (!activeWorkout) return { completed: 0, total: 0, percentage: 0 };

    const { totalSetsCompleted, totalSetsPlanned } = activeWorkout.stats;
    const percentage =
      totalSetsPlanned > 0 ? (totalSetsCompleted / totalSetsPlanned) * 100 : 0;

    return {
      completed: totalSetsCompleted,
      total: totalSetsPlanned,
      percentage: Math.round(percentage),
    };
  },

  hasUnsavedChanges: () => {
    const { activeWorkout } = get();
    return !!activeWorkout?.hasModificationsFromOriginal;
  },

  getModificationsSummary: () => {
    const { activeWorkout } = get();
    if (!activeWorkout) {
      return {
        addedBlocks: 0,
        addedExercises: 0,
        addedSets: 0,
        modifiedSets: 0,
      };
    }

    let addedBlocks = 0;
    let addedExercises = 0;
    let addedSets = 0;
    let modifiedSets = 0;

    activeWorkout.blocks.forEach((block) => {
      if (block.wasAddedDuringWorkout) addedBlocks++;

      block.exercises.forEach((exercise) => {
        if (exercise.wasAddedDuringWorkout) addedExercises++;

        exercise.sets.forEach((set) => {
          if (!set.originalSetData) addedSets++;
          else if (set.wasModifiedFromOriginal) modifiedSets++;
        });
      });
    });

    return { addedBlocks, addedExercises, addedSets, modifiedSets };
  },

  calculateTotalVolume: () => {
    const { activeWorkout } = get();
    if (!activeWorkout) return 0;

    return activeWorkout.blocks.reduce((totalVolume, block) => {
      return (
        totalVolume +
        block.exercises.reduce((blockVolume, exercise) => {
          return (
            blockVolume +
            exercise.sets.reduce((exerciseVolume, set) => {
              if (!set.completedAt) return exerciseVolume;

              const weight = parseFloat(set.actualWeight || set.weight || '0');
              const reps = parseFloat(set.actualReps || set.reps || '0');
              return exerciseVolume + weight * reps;
            }, 0)
          );
        }, 0)
      );
    }, 0);
  },

  getAverageRpe: () => {
    const { activeWorkout } = get();
    if (!activeWorkout) return undefined;

    const completedSetsWithRpe: number[] = [];

    activeWorkout.blocks.forEach((block) => {
      block.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (set.completedAt && (set.actualRpe || set.rpe)) {
            completedSetsWithRpe.push(set.actualRpe || set.rpe!);
          }
        });
      });
    });

    if (completedSetsWithRpe.length === 0) return undefined;

    const sum = completedSetsWithRpe.reduce((total, rpe) => total + rpe, 0);
    return Math.round((sum / completedSetsWithRpe.length) * 10) / 10; // Redondear a 1 decimal
  },
}));
