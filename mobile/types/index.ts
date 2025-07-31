// Basic types for the workout app

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export type ExerciseCategory =
  | "strength"
  | "cardio"
  | "flexibility"
  | "sports"
  | "functional";

export type BlockType = "regular" | "superset" | "circuit";

export interface Block {
  id: string;
  type: BlockType;
  name: string;
  exercises: ExerciseInBlock[];
  sets: number;
  restBetweenSets: number; // seconds
  restBetweenRounds?: number; // seconds for circuits
  notes?: string;
}

export interface ExerciseInBlock {
  id: string;
  exerciseId: string;
  name: string;
  sets?: number; // overrides block sets if specified
  reps?: number;
  weight?: number;
  duration?: number; // seconds
  distance?: number; // meters
  restAfter?: number; // seconds
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  createdAt: string;
  updatedAt: string;
  folderId?: string | null;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  routineCount: number;
}

export interface WorkoutSession {
  id: string;
  routineId: string;
  routineName: string;
  startedAt: string;
  completedAt?: string;
  duration?: number; // minutes
  blocks: CompletedBlock[];
  notes?: string;
}

export interface CompletedBlock {
  blockId: string;
  blockName: string;
  blockType: BlockType;
  completedSets: CompletedSet[];
  totalSets: number;
  avgRestTime?: number;
}

export interface CompletedSet {
  setNumber: number;
  exercises: CompletedExercise[];
  completedAt: string;
  restTime?: number; // seconds
}

export interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
}

export interface ActiveWorkout {
  id: string;
  routineId: string;
  routineName: string;
  startedAt: string;
  currentBlockIndex: number;
  currentSetIndex: number;
  blocks: Block[];
  completedSets: CompletedSet[];
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  type: "max_weight" | "max_reps" | "max_volume" | "best_time";
  value: number;
  unit: string;
  achievedAt: string;
  workoutSessionId: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalDuration: number; // minutes
  totalVolume: number; // kg
  averageWorkoutDuration: number; // minutes
  currentStreak: number; // days
  longestStreak: number; // days
  favoriteExercises: string[];
  weeklyGoal: number; // workouts per week
  personalRecords: PersonalRecord[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  stats: UserStats;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultRestTime: number; // seconds
  units: "metric" | "imperial";
  notifications: {
    workoutReminders: boolean;
    achievements: boolean;
    weeklyProgress: boolean;
  };
  theme: "light" | "dark" | "auto";
  workoutMusic: boolean;
  autoStartTimer: boolean;
}
