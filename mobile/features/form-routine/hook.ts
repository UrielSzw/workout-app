import { formRoutineStore } from '@/store/form-routine-store';
import { mainStore } from '@/store/main-store';
import {
  IBlock,
  IBlockType,
  IExercise,
  IExerciseInBlock,
  IRepsType,
  IRoutine,
  ISet,
  ISetType,
} from '@/types/routine';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useRef, useState } from 'react';

type Params = {
  isEditMode?: boolean;
};

export const useFormRoutine = ({ isEditMode }: Params) => {
  const { blocks, setBlocks, setReorderedBlock } = formRoutineStore(
    (state) => state,
  );
  const { addRoutine, updateRoutine, selectedRoutine, setSelectedRoutine } =
    mainStore((state) => state);

  // Bottom sheet refs
  const setTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const repsTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const restTimeBottomSheetRef = useRef<BottomSheetModal>(null);
  const blockOptionsBottomSheetRef = useRef<BottomSheetModal>(null);
  const exerciseOptionsBottomSheetRef = useRef<BottomSheetModal>(null);

  // Routine information state
  const [routineName, setRoutineName] = useState('');
  const [currentSetId, setCurrentSetId] = useState<string | null>(null);
  const [currentRepsType, setCurrentRepsType] = useState<IRepsType>('reps');
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(
    null,
  );
  const [isInMultipleExerciseBlock, setIsInMultipleExerciseBlock] =
    useState<boolean>(false);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [exercisesLength, setCurrentExercisesLength] = useState<number>(0);
  const [currentRestTime, setCurrentRestTime] = useState<number>(90);
  const [currentRestTimeType, setCurrentRestTimeType] = useState<
    'between-rounds' | 'between-exercises'
  >('between-rounds');
  const [exerciseSelectorVisible, setExerciseSelectorVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<IExercise[]>([]);
  const [currentSetType, setCurrentSetType] = useState<ISetType | null>(null);

  const defaultRoutineName = routineName || selectedRoutine?.name || '';
  const defaultBlocks =
    blocks.length > 0 ? blocks : selectedRoutine?.blocks || [];

  const handleSaveRoutine = () => {
    if (!defaultRoutineName.trim()) {
      alert('Por favor, ingresa un nombre para la rutina.');
      return;
    }

    if (isEditMode && selectedRoutine) {
      const updatedRoutine: IRoutine = {
        ...selectedRoutine,
        blocks: defaultBlocks,
        name: defaultRoutineName,
      };

      updateRoutine(selectedRoutine.id, updatedRoutine);
    } else {
      const newRoutine: IRoutine = {
        id: Date.now().toString(),
        name: defaultRoutineName,
        description: '',
        folderId: undefined,
        blocks: defaultBlocks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addRoutine(newRoutine);
    }

    // Reset form values
    handleClearRoutine();

    router.back();
  };

  // Block management functions
  const handleClearRoutine = () => {
    setSelectedRoutine(null);
    setBlocks([]);
    setRoutineName('');
    setCurrentSetId(null);
    setCurrentRepsType('reps');
    setCurrentExerciseId(null);
    setCurrentBlockId(null);
    setCurrentRestTime(90);
    setCurrentRestTimeType('between-rounds');
    setExerciseSelectorVisible(false);
    setSelectedExercises([]);
    setCurrentSetType(null);
    setReorderedBlock(null);
  };

  const handleDeleteBlock = () => {
    const updatedBlocks = defaultBlocks.filter(
      (block) => block.id !== currentBlockId,
    );

    setBlocks(updatedBlocks);
    blockOptionsBottomSheetRef.current?.dismiss();
  };

  const handleConvertToIndividual = () => {
    const blockToConvert = defaultBlocks.find(
      (block) => block.id === currentBlockId,
    );

    if (!blockToConvert) return;

    // Remove the original block and add individual blocks for each exercise
    const otherBlocks = defaultBlocks.filter(
      (block) => block.id !== currentBlockId,
    );

    const individualBlocks: IBlock[] = blockToConvert.exercises.map(
      (exerciseInBlock, index) => ({
        id: Date.now().toString() + index,
        type: 'individual' as const,
        orderIndex: otherBlocks.length + index,
        exercises: [exerciseInBlock],
        restTimeSeconds: blockToConvert.restTimeSeconds,
        restBetweenExercisesSeconds: 0,
        name: `Ejercicio Individual ${otherBlocks.length + index + 1}`,
      }),
    );

    setBlocks([...otherBlocks, ...individualBlocks]);
    blockOptionsBottomSheetRef.current?.dismiss();
  };

  const handleUpdateBlock = (blockId: string, updatedData: Partial<IBlock>) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, ...updatedData } : block,
    );

    setBlocks(updatedBlocks);
  };

  // Reorder functions
  const handleReorderBlocks = () => {
    setBlocks(defaultBlocks);

    // Navigate to reorder screen with blocks data using push (not modal)
    router.push({
      pathname: '/reorder-blocks',
    });
  };

  const handleReorderExercises = (blockToReorder: IBlock) => {
    setReorderedBlock(blockToReorder);
    // Navigate to reorder exercises screen with block data
    router.push({
      pathname: '/reorder-exercises',
    });
  };

  // Exercise modal functions
  const createDefaultSets = (): ISet[] => [
    {
      id: `set_${Date.now()}_1`,
      setNumber: 1,
      weight: '',
      reps: '',
      type: 'normal',
      completed: false,
      repsType: 'reps',
    },
    {
      id: `set_${Date.now()}_2`,
      setNumber: 2,
      weight: '',
      reps: '',
      type: 'normal',
      completed: false,
      repsType: 'reps',
    },
    {
      id: `set_${Date.now()}_3`,
      setNumber: 3,
      weight: '',
      reps: '',
      type: 'normal',
      completed: false,
      repsType: 'reps',
    },
  ];

  const handleSelectExercise = (exercise: IExercise) => {
    if (selectedExercises.find((ex) => ex.id === exercise.id)) {
      setSelectedExercises(
        selectedExercises.filter((ex) => ex.id !== exercise.id),
      );
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleAddAsIndividual = () => {
    if (selectedExercises.length === 0) return;

    const newBlocks: IBlock[] = selectedExercises.map((exercise, i) => ({
      id: `block_${Date.now()}_${i}`,
      type: 'individual' as const,
      orderIndex: defaultBlocks.length + i,
      exercises: [
        {
          id: `exercise_${Date.now()}_${i}`,
          exercise,
          sets: createDefaultSets(),
          orderIndex: 0,
        },
      ] as IExerciseInBlock[],
      restTimeSeconds: 90,
      restBetweenExercisesSeconds: 0,
    }));

    setBlocks([...defaultBlocks, ...newBlocks]);
    setSelectedExercises([]);
    setExerciseSelectorVisible(false);
  };

  const handleAddAsBlock = () => {
    if (selectedExercises.length < 2) return;

    const newBlock: IBlock = {
      id: `block_${Date.now()}`,
      type: 'superset', // Always start as superset
      orderIndex: defaultBlocks.length,
      exercises: selectedExercises.map((exercise, i) => ({
        id: `exercise_${Date.now()}_${i}`,
        exercise,
        sets: createDefaultSets(),
        orderIndex: i,
      })),
      restTimeSeconds: 90,
      restBetweenExercisesSeconds: 0, // No rest = superset
      name: 'Superserie',
    };

    setBlocks([...defaultBlocks, newBlock]);
    setSelectedExercises([]);
    setExerciseSelectorVisible(false);
  };

  // Sets modal functions
  const handleSetTypeSelect = (setType: ISetType) => {
    if (currentSetId && currentExerciseId) {
      const updatedBlocks = defaultBlocks.map((block) => ({
        ...block,
        exercises: block.exercises.map((ex) => {
          if (ex.id === currentExerciseId) {
            const updatedSets = ex.sets.map((set) =>
              set.id === currentSetId ? { ...set, type: setType } : set,
            );
            return { ...ex, sets: updatedSets };
          }
          return ex;
        }),
      }));

      setBlocks(updatedBlocks);
    }

    setCurrentSetType(null);
    setTypeBottomSheetRef.current?.dismiss();
  };

  const handleDeleteSet = () => {
    if (currentSetId && currentExerciseId) {
      const updatedBlocks = defaultBlocks.map((block) => ({
        ...block,
        exercises: block.exercises.map((ex) => {
          if (ex.id === currentExerciseId) {
            const filteredSets = ex.sets.filter(
              (set) => set.id !== currentSetId,
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
      }));

      setBlocks(updatedBlocks);
    }

    setTypeBottomSheetRef.current?.dismiss();
  };

  // Reps type modal function
  const handleRepsTypeSelect = (repsType: IRepsType) => {
    if (currentExerciseId) {
      const updatedBlocks = defaultBlocks.map((block) => ({
        ...block,
        exercises: block.exercises.map((ex) => {
          if (ex.id === currentExerciseId) {
            return {
              ...ex,
              sets: ex.sets.map((set) => ({ ...set, repsType })),
            };
          }
          return ex;
        }),
      }));

      setBlocks(updatedBlocks);
    }

    repsTypeBottomSheetRef.current?.dismiss();
  };

  // Rest time modal function

  const handleBlockRestTimeSelect = (restTimeSeconds: number) => {
    if (currentBlockId) {
      if (currentRestTimeType === 'between-exercises') {
        // When updating rest between exercises, also update block type
        const updatedBlock: Partial<IBlock> = {
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

        handleUpdateBlock(currentBlockId, updatedBlock);
      } else {
        handleUpdateBlock(currentBlockId, { restTimeSeconds });
      }
    }

    restTimeBottomSheetRef.current?.dismiss();
  };

  // Bottom sheet methods

  const handleShowSetTypeBottomSheet = (
    setId: string,
    exerciseId: string,
    current: ISetType,
  ) => {
    setCurrentSetId(setId);
    setCurrentExerciseId(exerciseId);
    setCurrentSetType(current);
    setTypeBottomSheetRef.current?.present();
  };

  const handleShowRepsTypeBottomSheet = (
    exerciseId: string,
    current: IRepsType,
  ) => {
    setCurrentExerciseId(exerciseId);
    setCurrentRepsType(current);
    repsTypeBottomSheetRef.current?.present();
  };

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

  const handleShowBlockOptionsBottomSheet = (
    blockId: string,
    exercisesLength: number,
  ) => {
    setCurrentBlockId(blockId);
    setCurrentExercisesLength(exercisesLength);
    blockOptionsBottomSheetRef.current?.present();
  };

  const handleShowExerciseOptionsBottomSheet = (
    blockId: string,
    exerciseId: string,
    isInMultiExerciseBlock: boolean,
  ) => {
    setCurrentBlockId(blockId);
    setCurrentExerciseId(exerciseId);
    setIsInMultipleExerciseBlock(isInMultiExerciseBlock);
    exerciseOptionsBottomSheetRef.current?.present();
  };

  const handleDeleteExercise = () => {
    const updatedBlocks = blocks.map((block) => {
      if (block.id === currentBlockId) {
        const updateExercises = block.exercises.filter(
          (exercise) => exercise.id !== currentExerciseId,
        );

        if (updateExercises.length === 1) {
          return {
            ...block,
            exercises: updateExercises,
            type: 'individual' as IBlockType,
          };
        }

        return { ...block, exercises: updateExercises };
      }

      return block;
    });

    setBlocks(updatedBlocks);
    setCurrentBlockId(null);
    setCurrentExerciseId(null);
    setIsInMultipleExerciseBlock(false);
    exerciseOptionsBottomSheetRef.current?.dismiss();
  };

  return {
    // Routine info
    routineName: defaultRoutineName,
    setRoutineName,
    handleSaveRoutine,
    handleClearRoutine,

    // Blocks methods
    blocks: defaultBlocks,
    handleDeleteBlock,
    handleConvertToIndividual,
    handleUpdateBlock,
    handleReorderBlocks,
    handleAddAsIndividual,
    handleAddAsBlock,
    blockOptionsBottomSheetRef,
    handleShowBlockOptionsBottomSheet,
    exercisesLength,

    // Exercises methods
    handleReorderExercises,
    exerciseSelectorVisible,
    setExerciseSelectorVisible,
    selectedExercises,
    handleSelectExercise,
    exerciseOptionsBottomSheetRef,
    handleDeleteExercise,
    handleShowExerciseOptionsBottomSheet,
    isInMultipleExerciseBlock,

    // Reps and rest time
    currentRestTime,
    handleRepsTypeSelect,
    handleBlockRestTimeSelect,
    currentSetType,
    currentRepsType,
    handleSetTypeSelect,
    handleDeleteSet,

    // Bottom sheet methods
    setTypeBottomSheetRef,
    repsTypeBottomSheetRef,
    restTimeBottomSheetRef,
    handleShowSetTypeBottomSheet,
    handleShowRepsTypeBottomSheet,
    handleShowBlockRestTimeBottomSheet,
  };
};
