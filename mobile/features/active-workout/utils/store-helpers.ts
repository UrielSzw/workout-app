import { mainStore } from '@/store/main-store';
import {
  IActiveBlock,
  IActiveExerciseInBlock,
  IActiveSet,
  IActiveWorkout,
  IActiveWorkoutRoutineSnapshot,
} from '@/types/active-workout';
import { IBlock, IExercise, IRoutine } from '@/types/routine';

const createDefaultSets = (): IActiveSet[] => [
  {
    id: `set_${Date.now()}_1`,
    setNumber: 1,
    weight: '',
    reps: '',
    type: 'normal',
    completed: false,
    repsType: 'reps',
    wasModifiedFromOriginal: false,
  },
  {
    id: `set_${Date.now()}_2`,
    setNumber: 2,
    weight: '',
    reps: '',
    type: 'normal',
    completed: false,
    repsType: 'reps',
    wasModifiedFromOriginal: false,
  },
  {
    id: `set_${Date.now()}_3`,
    setNumber: 3,
    weight: '',
    reps: '',
    type: 'normal',
    completed: false,
    repsType: 'reps',
    wasModifiedFromOriginal: false,
  },
];

export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const createActiveWorkoutFromRoutine = (
  routine: IRoutine,
): IActiveWorkout => {
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

export const getExerciseSetsAmount = (exercises: IActiveExerciseInBlock[]) => {
  return exercises.flatMap((exercise) => exercise.sets).length;
};

export const createExercises = (
  exercises: IExercise[],
): IActiveExerciseInBlock[] => {
  return exercises.map((exercise, index) => ({
    id: `exercise_${Date.now()}_${index}`,
    exercise,
    sets: createDefaultSets(),
    orderIndex: 0,
    wasAddedDuringWorkout: true,
    wasModifiedFromOriginal: false,
  }));
};

export const createActiveMultiBlock = (
  exercises: IExercise[],
  totalBlocks: number,
) => {
  const newActiveBlock: IActiveBlock = {
    id: `block_${Date.now()}`,
    type: 'superset', // Always start as superset
    orderIndex: totalBlocks,
    exercises: createExercises(exercises),
    restTimeSeconds: 90,
    restBetweenExercisesSeconds: 0, // No rest = superset
    name: 'Superserie',
    wasAddedDuringWorkout: true,
    wasModifiedFromOriginal: false,
  };

  return newActiveBlock;
};

export const createActiveIndividualBlock = (
  exercises: IExercise[],
  totalBlocks: number,
) => {
  const newActiveBlocks: IActiveBlock[] = exercises.map((exercise, i) => ({
    id: `block_${Date.now()}_${i}`,
    type: 'individual' as const,
    orderIndex: totalBlocks + i,
    exercises: [
      {
        id: `exercise_${Date.now()}_${i}`,
        exercise,
        sets: createDefaultSets(),
        orderIndex: 0,
        wasAddedDuringWorkout: true,
        wasModifiedFromOriginal: false,
      },
    ] as IActiveExerciseInBlock[],
    restTimeSeconds: 90,
    restBetweenExercisesSeconds: 0,
    wasAddedDuringWorkout: true,
    wasModifiedFromOriginal: false,
  }));

  return newActiveBlocks;
};

export const findActiveBlockById = (
  blocks: IActiveBlock[],
  blockId: string,
): IActiveBlock | undefined => {
  return blocks.find((block) => block.id === blockId);
};

export const convertExercisesInActiveBlock = (
  block: IActiveBlock,
): IActiveBlock[] => {
  const individualBlocks: IActiveBlock[] = block.exercises.map(
    (exerciseInBlock, index) => ({
      id: Date.now().toString() + index,
      type: 'individual' as const,
      orderIndex: block.orderIndex + index,
      exercises: [exerciseInBlock],
      restTimeSeconds: block.restTimeSeconds,
      restBetweenExercisesSeconds: 0,
      name: `Ejercicio Individual ${block.orderIndex + index + 1}`,
      wasAddedDuringWorkout: true,
      wasModifiedFromOriginal: false,
    }),
  );

  return individualBlocks;
};

export const findActiveBlockByExerciseId = (
  blocks: IActiveBlock[],
  exerciseId: string,
): IActiveBlock | undefined => {
  return blocks.find((block) =>
    block.exercises.some((exercise) => exercise.id === exerciseId),
  );
};

export const findExerciseInActiveBlockById = (
  blocks: IActiveBlock[],
  exerciseInBlockId: string,
) => {
  const block = findActiveBlockByExerciseId(blocks, exerciseInBlockId);

  const exerciseInBlock = block?.exercises.find(
    (ex) => ex.id === exerciseInBlockId,
  );

  return exerciseInBlock;
};

export const createNewActiveSet = (exerciseInBlock: IActiveExerciseInBlock) => {
  const totalSets = exerciseInBlock.sets.length;

  const newActiveSet: IActiveSet = {
    id: Date.now().toString() + Math.random(),
    setNumber: totalSets + 1,
    weight: totalSets > 0 ? exerciseInBlock.sets[totalSets - 1].weight : '',
    reps: totalSets > 0 ? exerciseInBlock.sets[totalSets - 1].reps : '',
    type: 'normal',
    completed: false,
    repsType: 'reps',
    wasModifiedFromOriginal: false,
  };

  return newActiveSet;
};

export const findSetInActiveBlockById = (
  blocks: IActiveBlock[],
  setId: string,
  exerciseInBlockId: string,
) => {
  for (const block of blocks) {
    const exerciseInBlock = block.exercises.find(
      (ex) => ex.id === exerciseInBlockId,
    );

    if (exerciseInBlock) {
      const set = exerciseInBlock.sets.find((s) => s.id === setId);
      if (set) return set;
    }
  }
  return undefined;
};

const findNextSet = (
  set: IActiveSet,
  exercise: IActiveExerciseInBlock,
): IActiveSet | null => {
  const setIndex = exercise.sets.findIndex((s) => s.id === set.id);

  // Find the next set in the current exercise
  if (setIndex !== -1 && setIndex < exercise.sets.length - 1) {
    return exercise.sets[setIndex + 1];
  }

  // If it's the last set of the current exercise, find the next exercise
  return null;
};

export const shouldShowRestTimer = (
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
