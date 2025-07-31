import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
export interface Exercise {
  id: string;
  name: string;
  category:
    | "chest"
    | "back"
    | "legs"
    | "shoulders"
    | "arms"
    | "core"
    | "cardio";
  muscleGroups: string[];
  equipment:
    | "barbell"
    | "dumbbell"
    | "machine"
    | "bodyweight"
    | "cable"
    | "other";
  instructions?: string;
}

export interface BlockExercise {
  id: string;
  exerciseId: string;
  orderIndex: number;
  sets: number;
  repsMin?: number;
  repsMax?: number;
  durationSeconds?: number;
  weightKg?: number;
  notes?: string;
}

export interface Block {
  id: string;
  orderIndex: number;
  type: "individual" | "superset" | "circuit" | "dropset";
  restTimeSeconds: number;
  restBetweenExercisesSeconds?: number;
  exercises: BlockExercise[];
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  folderId?: string;
  estimatedDurationMinutes?: number;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weightKg?: number;
  reps?: number;
  durationSeconds?: number;
  rpe?: number;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface ActiveWorkout {
  id: string;
  routineId: string;
  routineName: string;
  startedAt: string;
  currentBlockIndex: number;
  currentExerciseIndex: number;
  currentSetIndex: number;
  completedSets: Record<string, WorkoutSet[]>; // blockExerciseId -> sets
  totalDurationSeconds?: number;
  notes?: string;
}

// Store interface
interface AppState {
  // Routines & Folders
  routines: Routine[];
  folders: Folder[];

  // Active workout
  activeWorkout: ActiveWorkout | null;

  // UI State
  isLoading: boolean;

  // Actions
  setRoutines: (routines: Routine[]) => void;
  addRoutine: (routine: Routine) => void;
  updateRoutine: (id: string, routine: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;

  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, folder: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;

  startWorkout: (routine: Routine) => void;
  completeSet: (blockExerciseId: string, set: WorkoutSet) => void;
  finishWorkout: () => void;
  pauseWorkout: () => void;

  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

// Storage keys
const STORAGE_KEYS = {
  ROUTINES: "@workout-app/routines",
  FOLDERS: "@workout-app/folders",
  ACTIVE_WORKOUT: "@workout-app/active-workout",
};

// Store implementation
export const useAppStore = create<AppState>((set, get) => ({
  routines: [],
  folders: [],
  activeWorkout: null,
  isLoading: false,

  setRoutines: (routines) => {
    set({ routines });
    get().saveToStorage();
  },

  addRoutine: (routine) => {
    set((state) => ({
      routines: [...state.routines, routine],
    }));
    get().saveToStorage();
  },

  updateRoutine: (id, updates) => {
    set((state) => ({
      routines: state.routines.map((routine) =>
        routine.id === id
          ? { ...routine, ...updates, updatedAt: new Date().toISOString() }
          : routine
      ),
    }));
    get().saveToStorage();
  },

  deleteRoutine: (id) => {
    set((state) => ({
      routines: state.routines.filter((routine) => routine.id !== id),
    }));
    get().saveToStorage();
  },

  setFolders: (folders) => {
    set({ folders });
    get().saveToStorage();
  },

  addFolder: (folder) => {
    set((state) => ({
      folders: [...state.folders, folder],
    }));
    get().saveToStorage();
  },

  updateFolder: (id, updates) => {
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      ),
    }));
    get().saveToStorage();
  },

  deleteFolder: (id) => {
    // Move routines from deleted folder to root
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
      routines: state.routines.map((routine) =>
        routine.folderId === id ? { ...routine, folderId: undefined } : routine
      ),
    }));
    get().saveToStorage();
  },

  startWorkout: (routine) => {
    const activeWorkout: ActiveWorkout = {
      id: `workout_${Date.now()}`,
      routineId: routine.id,
      routineName: routine.name,
      startedAt: new Date().toISOString(),
      currentBlockIndex: 0,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      completedSets: {},
    };

    set({ activeWorkout });
    AsyncStorage.setItem(
      STORAGE_KEYS.ACTIVE_WORKOUT,
      JSON.stringify(activeWorkout)
    );
  },

  completeSet: (blockExerciseId, workoutSet) => {
    set((state) => {
      if (!state.activeWorkout) return state;

      const updatedCompletedSets = { ...state.activeWorkout.completedSets };
      if (!updatedCompletedSets[blockExerciseId]) {
        updatedCompletedSets[blockExerciseId] = [];
      }
      updatedCompletedSets[blockExerciseId].push(workoutSet);

      const updatedActiveWorkout = {
        ...state.activeWorkout,
        completedSets: updatedCompletedSets,
      };

      AsyncStorage.setItem(
        STORAGE_KEYS.ACTIVE_WORKOUT,
        JSON.stringify(updatedActiveWorkout)
      );

      return { activeWorkout: updatedActiveWorkout };
    });
  },

  finishWorkout: () => {
    set({ activeWorkout: null });
    AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  },

  pauseWorkout: () => {
    // Keep the workout in state but save to storage
    const { activeWorkout } = get();
    if (activeWorkout) {
      AsyncStorage.setItem(
        STORAGE_KEYS.ACTIVE_WORKOUT,
        JSON.stringify(activeWorkout)
      );
    }
  },

  loadFromStorage: async () => {
    try {
      set({ isLoading: true });

      const [routinesData, foldersData, activeWorkoutData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ROUTINES),
        AsyncStorage.getItem(STORAGE_KEYS.FOLDERS),
        AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT),
      ]);

      const routines = routinesData ? JSON.parse(routinesData) : [];
      const folders = foldersData ? JSON.parse(foldersData) : [];
      const activeWorkout = activeWorkoutData
        ? JSON.parse(activeWorkoutData)
        : null;

      set({
        routines,
        folders,
        activeWorkout,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading data from storage:", error);
      set({ isLoading: false });
    }
  },

  saveToStorage: async () => {
    try {
      const { routines, folders } = get();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines)),
        AsyncStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders)),
      ]);
    } catch (error) {
      console.error("Error saving data to storage:", error);
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
