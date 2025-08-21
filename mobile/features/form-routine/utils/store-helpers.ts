import { IBlock, IExercise, IExerciseInBlock, ISet } from '@/types/routine';

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

export const createIndividualBlock = (
  exercises: IExercise[],
  totalBlocks: number,
) => {
  const newBlocks: IBlock[] = exercises.map((exercise, i) => ({
    id: `block_${Date.now()}_${i}`,
    type: 'individual' as const,
    orderIndex: totalBlocks + i,
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

  return newBlocks;
};

export const createMultiBlock = (
  exercises: IExercise[],
  totalBlocks: number,
) => {
  const newBlock: IBlock = {
    id: `block_${Date.now()}`,
    type: 'superset', // Always start as superset
    orderIndex: totalBlocks,
    exercises: exercises.map((exercise, i) => ({
      id: `exercise_${Date.now()}_${i}`,
      exercise,
      sets: createDefaultSets(),
      orderIndex: i,
    })),
    restTimeSeconds: 90,
    restBetweenExercisesSeconds: 0, // No rest = superset
    name: 'Superserie',
  };

  return newBlock;
};

export const findBlockById = (
  blocks: IBlock[],
  blockId: string,
): IBlock | undefined => {
  return blocks.find((block) => block.id === blockId);
};

export const findBlockByExerciseId = (
  blocks: IBlock[],
  exerciseId: string,
): IBlock | undefined => {
  return blocks.find((block) =>
    block.exercises.some((exercise) => exercise.id === exerciseId),
  );
};

export const findExerciseInBlockById = (
  blocks: IBlock[],
  exerciseInBlockId: string,
) => {
  const block = findBlockByExerciseId(blocks, exerciseInBlockId);

  const exerciseInBlock = block?.exercises.find(
    (ex) => ex.id === exerciseInBlockId,
  );

  return exerciseInBlock;
};

export const findSetInBlockById = (
  blocks: IBlock[],
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

export const convertExercisesInBlock = (block: IBlock): IBlock[] => {
  const individualBlocks: IBlock[] = block.exercises.map(
    (exerciseInBlock, index) => ({
      id: Date.now().toString() + index,
      type: 'individual' as const,
      orderIndex: block.orderIndex + index,
      exercises: [exerciseInBlock],
      restTimeSeconds: block.restTimeSeconds,
      restBetweenExercisesSeconds: 0,
      name: `Ejercicio Individual ${block.orderIndex + index + 1}`,
    }),
  );

  return individualBlocks;
};

export const createNewSet = (exerciseInBlock: IExerciseInBlock) => {
  const totalSets = exerciseInBlock.sets.length;

  const newSet: ISet = {
    id: Date.now().toString() + Math.random(),
    setNumber: totalSets + 1,
    weight: totalSets > 0 ? exerciseInBlock.sets[totalSets - 1].weight : '',
    reps: totalSets > 0 ? exerciseInBlock.sets[totalSets - 1].reps : '',
    type: 'normal',
    completed: false,
    repsType: 'reps',
  };

  return newSet;
};
