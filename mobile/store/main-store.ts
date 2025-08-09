import { IFolder, IRoutine } from '@/types/routine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type MainStore = {
  routines: IRoutine[];
  folders: IFolder[];

  // Edit
  selectedFolder: IFolder | null;
  setSelectedFolder: (folder: IFolder | null) => void;
  selectedRoutine: IRoutine | null;
  setSelectedRoutine: (routine: IRoutine | null) => void;

  // UI State
  isLoading: boolean;

  // Routines
  setRoutines: (routines: IRoutine[]) => void;
  addRoutine: (routine: IRoutine) => void;
  updateRoutine: (id: string, routine: Partial<IRoutine>) => void;
  deleteRoutine: (id: string) => void;
  moveRoutineToFolder: (routineId: string, folderId?: string) => void;

  // Folders
  setFolders: (folders: IFolder[]) => void;
  addFolder: (folder: IFolder) => void;
  updateFolder: (id: string, folder: Partial<IFolder>) => void;
  deleteFolder: (id: string) => void;
  reorderFolders: (folders: IFolder[]) => void;

  // Async Actions
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  setLoading: (loading: boolean) => void;
};

// Storage keys
const STORAGE_KEYS = {
  ROUTINES: '@workout-app/routines',
  FOLDERS: '@workout-app/folders',
};

export const mainStore = create<MainStore>((set, get) => ({
  routines: [],
  folders: [],

  // Edit
  selectedFolder: null,
  setSelectedFolder: (folder) => set({ selectedFolder: folder }),
  selectedRoutine: null,
  setSelectedRoutine: (routine) => set({ selectedRoutine: routine }),

  isLoading: false,

  // Routines
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
          : routine,
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
  moveRoutineToFolder: (routineId, folderId) => {
    set((state) => ({
      routines: state.routines.map((routine) =>
        routine.id === routineId
          ? { ...routine, folderId, updatedAt: new Date().toISOString() }
          : routine,
      ),
    }));
    get().saveToStorage();
  },

  // Folders
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
        folder.id === id ? { ...folder, ...updates } : folder,
      ),
    }));
    get().saveToStorage();
  },
  deleteFolder: (id) => {
    // Move routines from deleted folder to root
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
      routines: state.routines.map((routine) =>
        routine.folderId === id ? { ...routine, folderId: undefined } : routine,
      ),
    }));
    get().saveToStorage();
  },
  reorderFolders: (folders) => {
    set({ folders });
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      set({ isLoading: true });

      const [routinesData, foldersData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ROUTINES),
        AsyncStorage.getItem(STORAGE_KEYS.FOLDERS),
      ]);

      const routines = routinesData ? JSON.parse(routinesData) : [];
      const folders = foldersData ? JSON.parse(foldersData) : [];
      console.log('Loaded folders:', folders);
      set({
        routines,
        folders,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading data from storage:', error);
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
      console.error('Error saving data to storage:', error);
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
