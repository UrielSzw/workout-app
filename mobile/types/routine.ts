export type ISetType =
  | 'normal'
  | 'warmup'
  | 'drop'
  | 'failure'
  | 'cluster'
  | 'rest-pause'
  | 'mechanical';

export type IRepsType = 'reps' | 'range' | 'time' | 'distance';

export type ISet = {
  id: string;
  setNumber: number;
  weight?: string;
  reps?: string;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  type: ISetType;
  completed: boolean;
  repsType: IRepsType;
  repsValue?: string;
  repsRange?: { min: string; max: string };
};

export type IExercise = {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string;
  instructions: string[];
  imageUrl?: string;
};

export type IExerciseInBlock = {
  id: string;
  exercise: IExercise;
  sets: ISet[];
  orderIndex: number;
  notes?: string;
};

export type IBlockType = 'individual' | 'superset' | 'circuit';

export type IBlock = {
  id: string;
  type: IBlockType;
  orderIndex: number;
  exercises: IExerciseInBlock[];
  restTimeSeconds: number;
  restBetweenExercisesSeconds: number;
  name?: string;
};

export type IRoutine = {
  id: string;
  name: string;
  description?: string;
  folderId?: string;
  blocks: IBlock[];
  createdAt: string;
  updatedAt: string;
};

export type IFolder = {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};
