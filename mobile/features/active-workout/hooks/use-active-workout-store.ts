import {
  IActiveBlock,
  IActiveExerciseInBlock,
  IActiveSet,
  IActiveWorkout,
} from '@/types/active-workout';
import { IExercise, IRepsType, IRoutine, ISetType } from '@/types/routine';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  createActiveWorkoutFromRoutine,
  createActiveMultiBlock,
  getExerciseSetsAmount,
  createActiveIndividualBlock,
  findActiveBlockById,
  convertExercisesInActiveBlock,
  findActiveBlockByExerciseId,
  findExerciseInActiveBlockById,
  createNewActiveSet,
  findSetInActiveBlockById,
  shouldShowRestTimer,
  createExercises,
} from '../utils/store-helpers';

type IExerciseModalMode = 'add-new' | 'replace' | 'add-to-block' | null;

type IRestTimer = {
  timeRemaining: number;
  totalTime: number;
  isActive: boolean;
  startedAt: number;
};

type IEdit = {
  blockId?: string | null;
  exerciseInBlockId?: string | null;
  exerciseName?: string | null;
  setId?: string | null;
  currentRestTime?: number | null;
  currentRestTimeType?: 'between-exercises' | 'between-rounds' | null;
  isMultiBlock?: boolean;
  exerciseModalMode?: IExerciseModalMode;
  currentRepsType?: IRepsType | null;
  currentSetType?: ISetType | null;
};

type IStore = {
  activeWorkout: IActiveWorkout | null;
  isWorkoutActive: boolean;
  selectedExercises: IExercise[];
  editState: IEdit;
  isExerciseModalOpen: boolean;
  restTimer: IRestTimer | null;

  editStateActions: {
    setEditValues: (editValues: IEdit) => void;
    clearEditValues: () => void;
    setExerciseModal: (open: boolean, mode: IExerciseModalMode) => void;
    selectExercise: (exercise: IExercise) => void;
  };

  workoutActions: {
    startWorkout: (routine: IRoutine) => void;
    // finishWorkout: () => Promise<IFinishWorkout>;
    cancelWorkout: () => void;
  };

  blockActions: {
    addMultiBlock: () => void;
    addIndividualBlock: () => void;
    addToBlock: () => void;
    deleteBlock: () => void;
    convertBlockToIndividual: () => void;
    updateRestTime: (restTime: number) => void;
  };

  exerciseActions: {
    deleteExercise: () => void;
    updateRepsType: (repsType: IRepsType) => void;
    replaceExercise: () => void;
  };

  setActions: {
    addSet: (exerciseInBlockId: string) => void;
    deleteSet: () => void;
    updateSetType: (setType: ISetType) => void;
    completeSet: (
      exerciseId: string,
      setId: string,
      completionData: {
        actualWeight?: string;
        actualReps?: string;
        actualRpe?: number;
        restTimeUsedSeconds?: number;
      },
    ) => number | null;
    uncompleteSet: (exerciseId: string, setId: string) => void;
  };

  timerActions: {
    startRestTimer: (seconds: number) => void;
    skipRestTimer: () => void;
    adjustRestTimer: (newSeconds: number) => void;
  };
};

const useActiveWorkoutStore = create<IStore>()(
  immer((set, get) => ({
    activeWorkout: null,
    isWorkoutActive: false,
    selectedExercises: [],
    isExerciseModalOpen: false,
    editState: {
      blockId: null,
      exerciseInBlockId: null,
      setId: null,
      currentRestTime: null,
      currentRestTimeType: null,
      isMultiBlock: false,
      isReplaceMode: false,
      currentRepsType: null,
      currentSetType: null,
      exerciseName: null,
    },
    restTimer: null,

    editStateActions: {
      setEditValues: ({
        blockId,
        exerciseInBlockId,
        setId,
        currentRestTime,
        currentRestTimeType,
        isMultiBlock,
        exerciseModalMode,
        currentRepsType,
        currentSetType,
        exerciseName,
      }) => {
        set((state) => {
          if (blockId) state.editState.blockId = blockId;
          if (exerciseInBlockId)
            state.editState.exerciseInBlockId = exerciseInBlockId;
          if (setId) state.editState.setId = setId;
          if (currentRestTime !== undefined)
            state.editState.currentRestTime = currentRestTime;
          if (currentRestTimeType !== undefined)
            state.editState.currentRestTimeType = currentRestTimeType;
          if (isMultiBlock !== undefined)
            state.editState.isMultiBlock = isMultiBlock;
          if (exerciseModalMode)
            state.editState.exerciseModalMode = exerciseModalMode;
          if (currentRepsType)
            state.editState.currentRepsType = currentRepsType;
          if (currentSetType) state.editState.currentSetType = currentSetType;
          if (exerciseName) state.editState.exerciseName = exerciseName;
        });
      },
      clearEditValues: () => {
        set((state) => {
          state.editState.blockId = null;
          state.editState.exerciseInBlockId = null;
          state.editState.setId = null;
          state.editState.currentRestTime = null;
          state.editState.currentRestTimeType = null;
          state.editState.isMultiBlock = false;
          state.editState.exerciseModalMode = null;
          state.editState.currentRepsType = null;
          state.editState.currentSetType = null;
          state.editState.exerciseName = null;

          state.isExerciseModalOpen = false;
          state.selectedExercises = [];
        });
      },
      setExerciseModal: (open: boolean, mode: IExerciseModalMode) => {
        set((state) => {
          state.isExerciseModalOpen = open;
          state.editState.exerciseModalMode = mode;
        });
      },
      selectExercise: (exercise: IExercise) => {
        set((state) => {
          if (!state.selectedExercises.some((e) => e.id === exercise.id)) {
            state.selectedExercises.push(exercise);
          } else {
            state.selectedExercises = state.selectedExercises.filter(
              (e) => e.id !== exercise.id,
            );
          }
        });
      },
    },

    workoutActions: {
      startWorkout: (routine) => {
        const newActiveWorkout = createActiveWorkoutFromRoutine(routine);

        set({ activeWorkout: newActiveWorkout, isWorkoutActive: true });
      },
      cancelWorkout: () => {
        set({
          activeWorkout: null,
          isWorkoutActive: false,
          selectedExercises: [],
        });
      },
    },

    blockActions: {
      addMultiBlock: () => {
        set((state) => {
          const { selectedExercises } = get();

          if (selectedExercises.length === 0) return;

          if (!state.activeWorkout) return;

          const newActiveBlock: IActiveBlock = createActiveMultiBlock(
            selectedExercises,
            state.activeWorkout.blocks.length,
          );

          state.activeWorkout.blocks.push(newActiveBlock);

          const setAmount = getExerciseSetsAmount(newActiveBlock.exercises);

          state.activeWorkout.stats.totalSetsPlanned += setAmount;
        });
      },
      addIndividualBlock: () => {
        set((state) => {
          const { selectedExercises } = get();

          if (selectedExercises.length === 0) return;

          if (!state.activeWorkout) return;

          const newActiveBlocks: IActiveBlock[] = createActiveIndividualBlock(
            selectedExercises,
            state.activeWorkout.blocks.length,
          );

          state.activeWorkout.blocks.push(...newActiveBlocks);

          const setAmount = getExerciseSetsAmount(
            newActiveBlocks.flatMap((block) => block.exercises),
          );

          state.activeWorkout.stats.totalSetsPlanned += setAmount;
        });
      },
      addToBlock: () => {
        set((state) => {
          const { selectedExercises } = get();

          if (selectedExercises.length === 0) return;

          if (!state.activeWorkout || !state.editState.blockId) return;

          const activeBlock = findActiveBlockById(
            state.activeWorkout.blocks,
            state.editState.blockId,
          );

          const newActiveExercises: IActiveExerciseInBlock[] =
            createExercises(selectedExercises);

          if (!activeBlock) return;

          activeBlock.exercises.push(...newActiveExercises);

          const setAmount = getExerciseSetsAmount(activeBlock.exercises);

          state.activeWorkout.stats.totalSetsPlanned += setAmount;

          if (
            activeBlock.type === 'individual' &&
            activeBlock.exercises.length > 1
          ) {
            activeBlock.type = 'superset';
            activeBlock.name = 'Superserie';
            activeBlock.restBetweenExercisesSeconds = 0;
          }
        });
      },
      deleteBlock: () => {
        set((state) => {
          if (!state.activeWorkout || !state.editState.blockId) return;

          state.activeWorkout.blocks = state.activeWorkout.blocks.filter(
            (block) => block.id !== state.editState.blockId,
          );
        });
      },
      convertBlockToIndividual: () => {
        set((state) => {
          if (!state.editState.blockId || !state.activeWorkout) return;

          const activeBlocks = findActiveBlockById(
            state.activeWorkout.blocks,
            state.editState.blockId,
          );

          if (activeBlocks) {
            const newBlocks = convertExercisesInActiveBlock(activeBlocks);

            state.activeWorkout.blocks.splice(
              state.activeWorkout.blocks.indexOf(activeBlocks),
              1,
              ...newBlocks,
            );
          }
        });
      },
      updateRestTime: (restTime: number) => {
        set((state) => {
          if (!state.editState.blockId || !state.activeWorkout) return;

          const activeBlock = findActiveBlockById(
            state.activeWorkout.blocks,
            state.editState.blockId,
          );

          if (!activeBlock) return;

          if (state.editState.currentRestTimeType === 'between-exercises') {
            activeBlock.restBetweenExercisesSeconds = restTime;

            if (restTime > 0) {
              activeBlock.type = 'circuit';
              activeBlock.name = 'Circuito';
            } else {
              activeBlock.type = 'superset';
              activeBlock.name = 'Superserie';
            }
          } else {
            activeBlock.restTimeSeconds = restTime;
          }
        });
      },
    },

    exerciseActions: {
      deleteExercise: () => {
        set((state) => {
          if (!state.editState.exerciseInBlockId || !state.activeWorkout)
            return;

          const activeBlock = findActiveBlockByExerciseId(
            state.activeWorkout.blocks,
            state.editState.exerciseInBlockId,
          );

          if (activeBlock) {
            activeBlock.exercises = activeBlock.exercises.filter(
              (e) => e.id !== state.editState.exerciseInBlockId,
            );

            activeBlock.wasModifiedFromOriginal = true;

            if (activeBlock.exercises.length === 0) {
              state.activeWorkout.blocks = state.activeWorkout.blocks.filter(
                (b) => b.id !== activeBlock.id,
              );
            }

            if (activeBlock.exercises.length === 1) {
              activeBlock.type = 'individual';
              activeBlock.name = undefined;
            }
          }
        });
      },
      updateRepsType: (repsType: IRepsType) => {
        set((state) => {
          if (!state.editState.exerciseInBlockId || !state.activeWorkout)
            return;

          const exerciseInBlock = findExerciseInActiveBlockById(
            state.activeWorkout.blocks,
            state.editState.exerciseInBlockId,
          );

          if (exerciseInBlock) {
            exerciseInBlock.sets.forEach((set) => {
              set.repsType = repsType;
            });
          }
        });
      },
      replaceExercise: () => {
        set((state) => {
          if (!state.editState.exerciseInBlockId || !state.activeWorkout)
            return;

          const exerciseInBlock = findExerciseInActiveBlockById(
            state.activeWorkout.blocks,
            state.editState.exerciseInBlockId,
          );

          if (exerciseInBlock) {
            exerciseInBlock.exercise = state.selectedExercises[0];
          }
        });
      },
    },

    setActions: {
      addSet: (exerciseInBlockId: string) => {
        set((state) => {
          if (!state.activeWorkout) return;

          const exerciseInBlock = findExerciseInActiveBlockById(
            state.activeWorkout.blocks,
            exerciseInBlockId,
          );

          if (exerciseInBlock) {
            const newSet: IActiveSet = createNewActiveSet(exerciseInBlock);

            exerciseInBlock?.sets.push(newSet);

            state.activeWorkout.stats.totalSetsPlanned += 1;
          }
        });
      },
      deleteSet: () => {
        set((state) => {
          if (!state.editState.exerciseInBlockId || !state.activeWorkout)
            return;

          const exerciseInBlock = findExerciseInActiveBlockById(
            state.activeWorkout.blocks,
            state.editState.exerciseInBlockId,
          );

          if (exerciseInBlock) {
            exerciseInBlock.sets = exerciseInBlock.sets.filter(
              (set) => set.id !== state.editState.setId,
            );
          }
        });
      },
      updateSetType: (setType: ISetType) => {
        set((state) => {
          console.log('editState', state.editState);
          if (
            !state.editState.setId ||
            !state.editState.exerciseInBlockId ||
            !state.activeWorkout
          )
            return;

          const set = findSetInActiveBlockById(
            state.activeWorkout.blocks,
            state.editState.setId,
            state.editState.exerciseInBlockId,
          );

          console.log('found set', set);

          if (set) {
            set.type = setType;
          }
        });
      },
      completeSet: (exerciseId, setId, completionData) => {
        let restTimeResult: number | null = null;

        set((state) => {
          if (!state.activeWorkout) return;

          const exerciseInBlock = findExerciseInActiveBlockById(
            state.activeWorkout.blocks,
            exerciseId,
          );

          if (exerciseInBlock) {
            const setObj = exerciseInBlock.sets.find((s) => s.id === setId);

            if (setObj) {
              setObj.completed = true;
              setObj.completedAt = new Date().toISOString();
              setObj.actualWeight = completionData.actualWeight;
              setObj.actualReps = completionData.actualReps;
              setObj.actualRpe = completionData.actualRpe;
              setObj.restTimeUsedSeconds = completionData.restTimeUsedSeconds;

              state.activeWorkout.stats.totalSetsCompleted += 1;

              const block = state.activeWorkout.blocks.find((b) =>
                b.exercises.some((ex) => ex.id === exerciseId),
              );

              if (
                block &&
                shouldShowRestTimer(setObj, exerciseInBlock, block)
              ) {
                restTimeResult =
                  block.type === 'individual'
                    ? block.restTimeSeconds
                    : block.type === 'superset'
                      ? block.restTimeSeconds
                      : block.restBetweenExercisesSeconds;

                state.restTimer = {
                  timeRemaining: restTimeResult,
                  totalTime: restTimeResult,
                  isActive: true,
                  startedAt: Date.now(),
                };
              }
            }
          }
        });

        return restTimeResult;
      },
      uncompleteSet: (exerciseId, setId) => {
        set((state) => {
          if (!state.activeWorkout) return;

          const exerciseInBlock = findExerciseInActiveBlockById(
            state.activeWorkout.blocks,
            exerciseId,
          );

          if (exerciseInBlock) {
            const set = exerciseInBlock.sets.find((s) => s.id === setId);
            if (set) {
              set.completed = false;
              set.completedAt = undefined;
              set.actualWeight = undefined;
              set.actualReps = undefined;
              set.actualRpe = undefined;
              set.restTimeUsedSeconds = undefined;

              state.activeWorkout.stats.totalSetsCompleted -= 1;
            }
          }
        });
      },
    },

    timerActions: {
      startRestTimer: (seconds: number) => {
        set((state) => {
          if (!state.activeWorkout) return;

          state.restTimer = {
            timeRemaining: seconds,
            totalTime: seconds,
            isActive: true,
            startedAt: Date.now(),
          };
        });
      },
      skipRestTimer: () => {
        set((state) => {
          if (!state.activeWorkout) return;

          state.restTimer = null;
        });
      },
      adjustRestTimer: (newSeconds: number) => {
        set((state) => {
          if (!state.activeWorkout || !state.restTimer) return;

          state.restTimer.timeRemaining = Math.max(0, newSeconds);
        });
      },
    },
  })),
);

export const useActiveEditValuesActions = () =>
  useActiveWorkoutStore((state) => state.editStateActions);

export const useActiveEditValuesState = () =>
  useActiveWorkoutStore((state) => state.editState);

export const useActiveWorkoutState = () =>
  useActiveWorkoutStore((state) => state.activeWorkout);

export const useIsWorkoutActiveState = () =>
  useActiveWorkoutStore((state) => state.isWorkoutActive);

export const useActiveSetActions = () =>
  useActiveWorkoutStore((state) => state.setActions);

export const useActiveBlockActions = () =>
  useActiveWorkoutStore((state) => state.blockActions);

export const useActiveExerciseActions = () =>
  useActiveWorkoutStore((state) => state.exerciseActions);

export const useActiveSelectedExercises = () =>
  useActiveWorkoutStore((state) => state.selectedExercises);

export const useActiveExerciseModal = () =>
  useActiveWorkoutStore((state) => state.isExerciseModalOpen);

export const useActiveWorkoutActions = () =>
  useActiveWorkoutStore((state) => state.workoutActions);

export const useActiveRestTimer = () =>
  useActiveWorkoutStore((state) => state.restTimer);

export const useActiveRestTimerActions = () =>
  useActiveWorkoutStore((state) => state.timerActions);
