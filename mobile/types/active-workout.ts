import { IRoutine, IBlock, IExerciseInBlock, ISet } from './routine';

// Snapshot de la rutina original al momento de iniciar
export type IActiveWorkoutRoutineSnapshot = {
  originalRoutineId: string;
  originalRoutine: IRoutine;
  snapshotTakenAt: string;
};

// Set activo con datos de completion
export type IActiveSet = ISet & {
  completedAt?: string;
  actualWeight?: string;
  actualReps?: string;
  actualRpe?: number; // RPE real (puede diferir del planeado)
  restTimeUsedSeconds?: number;
  // Para tracking de modificaciones
  wasModifiedFromOriginal: boolean;
  originalSetData?: ISet; // Referencia al set original si fue modificado
};

// Ejercicio activo que puede tener sets agregados on-the-fly
export type IActiveExerciseInBlock = {
  id: string;
  originalExerciseInBlockId?: string; // null si fue agregado durante workout
  exercise: IExerciseInBlock['exercise'];
  sets: IActiveSet[];
  orderIndex: number;
  notes?: string;
  wasAddedDuringWorkout: boolean;
  wasModifiedFromOriginal: boolean;
};

// Bloque activo
export type IActiveBlock = {
  id: string;
  originalBlockId?: string; // null si fue agregado durante workout
  type: IBlock['type'];
  name?: string;
  exercises: IActiveExerciseInBlock[];
  restTimeSeconds: number;
  restBetweenExercisesSeconds: number;
  orderIndex: number;
  wasAddedDuringWorkout: boolean;
  wasModifiedFromOriginal: boolean;
};

// El workout activo principal
export type IActiveWorkout = {
  id: string;
  routineSnapshot: IActiveWorkoutRoutineSnapshot;

  // Estado actual del workout (puede diferir del original)
  name: string;
  blocks: IActiveBlock[];

  // Metadata del workout
  startedAt: string;
  pausedAt?: string;
  resumedAt?: string;
  completedAt?: string;
  totalPauseTimeSeconds: number;

  // Estadísticas en tiempo real
  stats: {
    totalSetsCompleted: number;
    totalSetsPlanned: number;
    totalVolumeKg: number;
  };

  // Flags importantes
  hasModificationsFromOriginal: boolean;
  wasCompletedSuccessfully: boolean;

  // Notas generales del workout
  notes?: string;
};

// Sets completados para historial detallado
export type ICompletedSetHistory = {
  setId: string;
  setNumber: number;
  type: ISet['type'];
  weight?: string;
  reps?: string;
  rpe?: number;
  completedAt: string;
  notes?: string;
};

// Para el historial
export type IWorkoutHistory = {
  id: string;
  originalRoutineId: string;
  routineName: string;
  completedAt: string;
  durationSeconds: number;
  totalSetsCompleted: number;
  totalVolumeKg: number;
  averageRpe?: number;
  hadModifications: boolean;

  // Datos detallados para análisis y referencia futura
  exerciseData: {
    exerciseId: string;
    exerciseName: string;
    setsCompleted: ICompletedSetHistory[]; // Sets detallados para referencia
    totalVolumeKg: number;
  }[];

  notes?: string;
};
