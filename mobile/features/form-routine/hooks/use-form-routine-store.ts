import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  IBlock,
  IExercise,
  IExerciseInBlock,
  IRepsType,
  IRoutine,
  ISet,
  ISetType,
} from '@/types/routine';
import {
  convertExercisesInBlock,
  createIndividualBlock,
  createMultiBlock,
  createNewSet,
  findBlockByExerciseId,
  findBlockById,
  findExerciseInBlockById,
  findSetInBlockById,
} from '../utils/store-helpers';
import { createExercises } from '@/features/active-workout/utils/store-helpers';

type IExerciseModalMode = 'add-new' | 'replace' | 'add-to-block' | null;

type IEdit = {
  blockId?: string | null;
  exerciseInBlockId?: string | null;
  exerciseName?: string | null;
  setId?: string | null;
  repsType?: IRepsType | null;
  currentRestTime?: number | null;
  currentRestTimeType?: 'between-exercises' | 'between-rounds' | null;
  isMultiBlock?: boolean;
  exerciseModalMode?: IExerciseModalMode;
  currentRepsType?: IRepsType | null;
  currentSetType?: ISetType | null;
  routineName?: string;
};

type IStore = {
  blocks: IBlock[];
  blockToReorder: IBlock | null;
  selectedExercises: IExercise[];
  isExerciseModalOpen: boolean;
  editState: IEdit;

  editStateActions: {
    setEditValues: ({ blockId, exerciseInBlockId, setId }: IEdit) => void;
    clearEditValues: () => void;
    setExerciseModal: (open: boolean, mode: IExerciseModalMode) => void;
    selectExercise: (exercise: IExercise) => void;
    clearRoutine: () => void;
    createRoutine: () => IRoutine;
    setRoutineName: (name: string) => void;
  };
  blockActions: {
    deleteBlock: () => void;
    addIndividualBlock: () => void;
    addMultiBlock: () => void;
    addToBlock: () => void;
    convertBlockToIndividual: () => void;
    updateBlock: (blockId: string, updatedData: Partial<IBlock>) => void;
    updateRestTime: (restTime: number) => void;
    reorderBlocks: (newBlocks: IBlock[]) => void;
    reorderBlockExercises: (newBlock: IBlock) => void;
    setBlockToReorder: (block: IBlock | null) => void;
    setBlocks: (blocks: IBlock[]) => void;
  };
  exerciseActions: {
    deleteExercise: () => void;
    updateRepsType: (repsType: IRepsType) => void;
    replaceExercise: () => void;
  };
  setActions: {
    addSet: (exerciseInBlockId: string) => void;
    updateSet: (
      exerciseInBlockId: string,
      setId: string,
      setIndex: number,
      updates: Partial<ISet>,
    ) => void;
    deleteSet: () => void;
    updateSetType: (setType: ISetType) => void;
  };
};

const useFormRoutineStore = create<IStore>()(
  immer((set, get) => ({
    blocks: [],
    blockToReorder: null,
    selectedExercises: [],
    isExerciseModalOpen: false,
    editState: {
      blockId: null,
      exerciseInBlockId: null,
      setId: null,
      repsType: null,
      currentRestTime: null,
      currentRestTimeType: null,
      isMultiBlock: false,
      exerciseModalMode: null,
      currentRepsType: null,
      currentSetType: null,
      routineName: '',
      exerciseName: null,
    },

    editStateActions: {
      setEditValues: ({
        blockId,
        exerciseInBlockId,
        setId,
        repsType,
        currentRestTime,
        currentRestTimeType,
        isMultiBlock,
        exerciseModalMode,
        currentRepsType,
        currentSetType,
        exerciseName,
        routineName,
      }) => {
        set((state) => {
          if (blockId) state.editState.blockId = blockId;
          if (exerciseInBlockId)
            state.editState.exerciseInBlockId = exerciseInBlockId;
          if (setId) state.editState.setId = setId;
          if (repsType) state.editState.repsType = repsType;
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
          if (routineName) state.editState.routineName = routineName;
        });
      },
      setRoutineName: (name: string) => {
        set((state) => {
          state.editState.routineName = name;
        });
      },
      clearEditValues: () => {
        set((state) => {
          state.editState.blockId = null;
          state.editState.exerciseInBlockId = null;
          state.editState.setId = null;
          state.editState.repsType = null;
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
      clearRoutine: () => {
        set((state) => {
          state.blocks = [];
          state.selectedExercises = [];
          state.isExerciseModalOpen = false;
          state.editState = {
            blockId: null,
            exerciseInBlockId: null,
            setId: null,
            repsType: null,
            currentRestTime: null,
            currentRestTimeType: null,
            isMultiBlock: false,
            exerciseModalMode: null,
            currentRepsType: null,
            currentSetType: null,
            routineName: '',
            exerciseName: null,
          };
        });
      },
      createRoutine: () => {
        const { editState, blocks } = get();

        const newRoutine: IRoutine = {
          id: Date.now().toString(),
          name: editState.routineName || '',
          description: '',
          folderId: undefined,
          blocks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return newRoutine;
      },
    },

    blockActions: {
      setBlocks: (blocks: IBlock[]) => {
        set((state) => {
          state.blocks = blocks;
        });
      },
      deleteBlock: () => {
        set((state) => ({
          blocks: state.blocks.filter(
            (block) => block.id !== state.editState.blockId,
          ),
        }));
      },
      convertBlockToIndividual: () => {
        set((state) => {
          if (!state.editState.blockId) return;

          const block = findBlockById(state.blocks, state.editState.blockId);

          if (block) {
            const newBlocks = convertExercisesInBlock(block);

            state.blocks.splice(state.blocks.indexOf(block), 1, ...newBlocks);
          }
        });
      },
      addIndividualBlock: () => {
        set((state) => {
          const { selectedExercises } = get();

          if (selectedExercises.length === 0) return;

          const newBlocks: IBlock[] = createIndividualBlock(
            selectedExercises,
            state.blocks.length,
          );

          state.blocks.push(...newBlocks);
          state.selectedExercises = [];
          state.isExerciseModalOpen = false;
        });
      },
      addMultiBlock: () => {
        set((state) => {
          const { selectedExercises } = get();

          if (selectedExercises.length === 0) return;

          const newBlock: IBlock = createMultiBlock(
            selectedExercises,
            state.blocks.length,
          );

          state.blocks.push(newBlock);
          state.selectedExercises = [];
          state.isExerciseModalOpen = false;
        });
      },
      addToBlock: () => {
        set((state) => {
          const { selectedExercises } = get();

          if (selectedExercises.length === 0) return;

          if (!state.editState.blockId) return;

          const block = findBlockById(state.blocks, state.editState.blockId);

          const newExercises: IExerciseInBlock[] =
            createExercises(selectedExercises);

          if (!block) return null;

          block.exercises.push(...newExercises);

          if (block.type === 'individual' && block.exercises.length > 1) {
            block.type = 'superset';
            block.name = 'Superserie';
            block.restBetweenExercisesSeconds = 0;
          }
        });
      },
      updateBlock: (blockId: string, updatedData: Partial<IBlock>) => {
        set((state) => {
          const block = findBlockById(state.blocks, blockId);

          if (block) {
            Object.assign(block, updatedData);
          }
        });
      },
      updateRestTime: (restTime: number) => {
        set((state) => {
          if (!state.editState.blockId) return;

          const block = findBlockById(state.blocks, state.editState.blockId);

          if (!block) return;

          if (state.editState.currentRestTimeType === 'between-exercises') {
            block.restBetweenExercisesSeconds = restTime;

            if (restTime > 0) {
              block.type = 'circuit';
              block.name = 'Circuito';
            } else {
              block.type = 'superset';
              block.name = 'Superserie';
            }
          } else {
            block.restTimeSeconds = restTime;
          }
        });
      },
      reorderBlocks: (newBlocks: IBlock[]) => {
        set((state) => {
          state.blocks = newBlocks;
        });
      },
      reorderBlockExercises: (newBlock: IBlock) => {
        set((state) => {
          const block = findBlockById(state.blocks, newBlock.id);

          if (block) {
            block.exercises = newBlock.exercises;
          }
        });
      },
      setBlockToReorder: (block: IBlock | null) => {
        set((state) => {
          state.blockToReorder = block;
        });
      },
    },

    exerciseActions: {
      deleteExercise: () => {
        set((state) => {
          if (!state.editState.exerciseInBlockId) return;

          const block = findBlockByExerciseId(
            state.blocks,
            state.editState.exerciseInBlockId,
          );

          if (block) {
            block.exercises = block.exercises.filter(
              (e) => e.id !== state.editState.exerciseInBlockId,
            );

            if (block.exercises.length === 0) {
              state.blocks = state.blocks.filter((b) => b.id !== block.id);
            }

            if (block.exercises.length === 1) {
              block.type = 'individual';
              block.name = undefined;
            }
          }
        });
      },
      updateRepsType: (repsType: IRepsType) => {
        set((state) => {
          if (!state.editState.exerciseInBlockId) return;

          const exerciseInBlock = findExerciseInBlockById(
            state.blocks,
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
          if (!state.editState.exerciseInBlockId) return;

          const exerciseInBlock = findExerciseInBlockById(
            state.blocks,
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
          const exerciseInBlock = findExerciseInBlockById(
            state.blocks,
            exerciseInBlockId,
          );

          if (exerciseInBlock) {
            const newSet: ISet = createNewSet(exerciseInBlock);

            exerciseInBlock?.sets.push(newSet);
          }
        });
      },
      updateSet: (
        exerciseInBlockId: string,
        setId: string,
        setIndex: number,
        updates: Partial<ISet>,
      ) => {
        set((state) => {
          const exerciseInBlock = findExerciseInBlockById(
            state.blocks,
            exerciseInBlockId,
          );

          if (exerciseInBlock) {
            const set = exerciseInBlock.sets[setIndex];

            if (set && set.id === setId) {
              // Obtener el valor original del set ANTES de modificarlo para la comparación
              const originalSet = { ...set };

              Object.assign(set, updates);

              // Auto-completar sets siguientes con lógica inteligente
              const nextSets = exerciseInBlock.sets.slice(setIndex + 1);

              nextSets.forEach((nextSet) => {
                const autoUpdates: Partial<ISet> = {};

                // Verificar cada campo que se está actualizando
                Object.entries(updates).forEach(([field, value]) => {
                  if (value !== '' && value !== undefined && value !== null) {
                    const currentFieldValue = (nextSet as any)[field];
                    const originalFieldValue = (originalSet as any)[field];

                    // Auto-completar solo si:
                    // 1. El campo está vacío, O
                    // 2. El campo actual es exactamente igual al valor anterior del set que estoy modificando
                    //    (esto permite que "1" → "10" funcione correctamente)
                    if (
                      currentFieldValue === '' ||
                      currentFieldValue === undefined ||
                      currentFieldValue === null ||
                      currentFieldValue === originalFieldValue
                    ) {
                      (autoUpdates as any)[field] = value;
                    }
                  }
                });

                // Solo aplicar auto-updates si hay campos para actualizar
                if (Object.keys(autoUpdates).length > 0) {
                  Object.assign(nextSet, autoUpdates);
                }
              });
            }
          }
        });
      },
      deleteSet: () => {
        set((state) => {
          if (!state.editState.exerciseInBlockId) return;

          const exerciseInBlock = findExerciseInBlockById(
            state.blocks,
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
          if (!state.editState.setId || !state.editState.exerciseInBlockId)
            return;

          const set = findSetInBlockById(
            state.blocks,
            state.editState.setId,
            state.editState.exerciseInBlockId,
          );

          if (set) {
            set.type = setType;
          }
        });
      },
    },
  })),
);

export const useBlocksState = () =>
  useFormRoutineStore((state) => state.blocks);

export const useBlockToReorderState = () =>
  useFormRoutineStore((state) => state.blockToReorder);

export const useEditValuesActions = () =>
  useFormRoutineStore((state) => state.editStateActions);

export const useSetActions = () =>
  useFormRoutineStore((state) => state.setActions);

export const useBlockActions = () =>
  useFormRoutineStore((state) => state.blockActions);

export const useExerciseActions = () =>
  useFormRoutineStore((state) => state.exerciseActions);

export const useSelectedExercises = () =>
  useFormRoutineStore((state) => state.selectedExercises);

export const useEditValuesState = () =>
  useFormRoutineStore((state) => state.editState);

export const useExerciseModal = () =>
  useFormRoutineStore((state) => state.isExerciseModalOpen);
