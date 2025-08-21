import { create } from 'zustand';
import {
  subscribeWithSelector,
  persist,
  createJSONStorage,
} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type QuickAction = {
  label: string;
  value: number;
  icon?: string; // Icon name from lucide-react-native
};

export type MetricDefinition = {
  id: string;
  label: string;
  unit: string;
  icon: string; // Icon name from lucide-react-native
  color: string;
  type: 'number' | 'time' | 'custom';
  dailyGoal?: number;
  quickActions?: QuickAction[];
  isActive: boolean; // Si el usuario lo tiene activado
  isPredefined: boolean; // Si es predefinido o custom
};

export type LogEntry = {
  id: string;
  metricId: string;
  value: number;
  timestamp: string; // ISO string
  description?: string;
};

export type DayLog = {
  date: string; // YYYY-MM-DD
  entries: LogEntry[];
  // Keep metrics for backward compatibility and easy access
  metrics: {
    [metricId: string]: number;
  };
};

interface TrackerState {
  // Data
  availableMetrics: MetricDefinition[]; // Todas las métricas (predefined + custom)
  activeMetrics: string[]; // IDs de métricas que el usuario tiene activas
  logs: DayLog[];

  // UI State
  selectedDate: string; // YYYY-MM-DD
  metricModalVisible: boolean;
  selectedMetricId: string | null;
}

interface TrackerActions {
  // Metric management
  addCustomMetric: (
    metric: Omit<MetricDefinition, 'id' | 'isPredefined'>,
  ) => void;
  toggleMetricActive: (metricId: string) => void;
  updateMetric: (metricId: string, updates: Partial<MetricDefinition>) => void;

  // Log management
  addMetricValue: (
    date: string,
    metricId: string,
    value: number,
    description?: string,
  ) => void;
  updateMetricValue: (date: string, metricId: string, value: number) => void;

  // Entry management (new)
  addEntry: (
    date: string,
    metricId: string,
    value: number,
    description?: string,
  ) => void;
  removeEntry: (date: string, entryId: string) => void;
  updateEntry: (
    date: string,
    entryId: string,
    value: number,
    description?: string,
  ) => void;
  getDayEntries: (date: string, metricId?: string) => LogEntry[];

  // UI actions
  setSelectedDate: (date: string) => void;
  showMetricModal: (metricId: string) => void;
  hideMetricModal: () => void;

  // Utility getters
  getTodaysLog: () => DayLog | null;
  getMetricValueForDate: (date: string, metricId: string) => number;
  getActiveMetricDefinitions: () => MetricDefinition[];
}

// Predefined metrics data
const PREDEFINED_METRICS: MetricDefinition[] = [
  {
    id: 'protein',
    label: 'Proteína',
    unit: 'g',
    icon: 'Beef',
    color: '#10B981', // green-500
    type: 'number',
    dailyGoal: 150,
    isActive: false,
    isPredefined: true,
    quickActions: [
      { label: 'Pollo (150g)', value: 35, icon: 'ChefHat' },
      { label: 'Huevos (2 unidades)', value: 12, icon: 'Egg' },
      { label: 'Shake de proteína', value: 25, icon: 'Coffee' },
      { label: 'Yogurt griego', value: 15, icon: 'Milk' },
      { label: 'Atún (lata)', value: 28, icon: 'Fish' },
      { label: 'Lentejas (1 taza)', value: 18, icon: 'Wheat' },
    ],
  },
  {
    id: 'water',
    label: 'Agua',
    unit: 'L',
    icon: 'Droplets',
    color: '#3B82F6', // blue-500
    type: 'number',
    dailyGoal: 2.5,
    isActive: false,
    isPredefined: true,
    quickActions: [
      { label: 'Vaso pequeño (200ml)', value: 0.2 },
      { label: 'Vaso grande (300ml)', value: 0.3 },
      { label: 'Botella (500ml)', value: 0.5 },
      { label: 'Botella grande (1L)', value: 1 },
    ],
  },
  {
    id: 'calories',
    label: 'Calorías',
    unit: 'kcal',
    icon: 'Flame',
    color: '#F59E0B', // amber-500
    type: 'number',
    dailyGoal: 2000,
    isActive: false,
    isPredefined: true,
  },
  {
    id: 'steps',
    label: 'Pasos',
    unit: 'pasos',
    icon: 'Footprints',
    color: '#8B5CF6', // violet-500
    type: 'number',
    dailyGoal: 10000,
    isActive: false,
    isPredefined: true,
  },
  {
    id: 'sleep',
    label: 'Sueño',
    unit: 'horas',
    icon: 'Moon',
    color: '#6366F1', // indigo-500
    type: 'time',
    dailyGoal: 8,
    isActive: false,
    isPredefined: true,
  },
  {
    id: 'weight',
    label: 'Peso',
    unit: 'kg',
    icon: 'Scale',
    color: '#EF4444', // red-500
    type: 'number',
    isActive: false,
    isPredefined: true,
  },
];

const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

const generateEntryId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const calculateMetricTotal = (
  entries: LogEntry[],
  metricId: string,
): number => {
  return entries
    .filter((entry) => entry.metricId === metricId)
    .reduce((sum, entry) => sum + entry.value, 0);
};

export const useTrackerStore = create<TrackerState & TrackerActions>()(
  persist(
    subscribeWithSelector((set, get) => ({
      // Initial state
      availableMetrics: PREDEFINED_METRICS,
      activeMetrics: [],
      logs: [],
      selectedDate: getTodayString(),
      metricModalVisible: false,
      selectedMetricId: null,

      // Metric management
      addCustomMetric: (metricData) => {
        const newMetric: MetricDefinition = {
          ...metricData,
          id: `custom-${Date.now()}`,
          isPredefined: false,
          isActive: true, // Auto-activate custom metrics
        };

        set((state) => ({
          availableMetrics: [...state.availableMetrics, newMetric],
          activeMetrics: [...state.activeMetrics, newMetric.id],
        }));
      },

      toggleMetricActive: (metricId) => {
        set((state) => {
          const isCurrentlyActive = state.activeMetrics.includes(metricId);
          const newActiveMetrics = isCurrentlyActive
            ? state.activeMetrics.filter((id) => id !== metricId)
            : [...state.activeMetrics, metricId];

          return {
            activeMetrics: newActiveMetrics,
            availableMetrics: state.availableMetrics.map((metric) =>
              metric.id === metricId
                ? { ...metric, isActive: !isCurrentlyActive }
                : metric,
            ),
          };
        });
      },

      updateMetric: (metricId, updates) => {
        set((state) => ({
          availableMetrics: state.availableMetrics.map((metric) =>
            metric.id === metricId ? { ...metric, ...updates } : metric,
          ),
        }));
      },

      // Log management
      addMetricValue: (date, metricId, value, description) => {
        set((state) => {
          const existingLogIndex = state.logs.findIndex(
            (log) => log.date === date,
          );

          const newEntry: LogEntry = {
            id: generateEntryId(),
            metricId,
            value,
            timestamp: new Date().toISOString(),
            description,
          };

          if (existingLogIndex >= 0) {
            // Update existing log
            const updatedLogs = [...state.logs];
            const currentLog = updatedLogs[existingLogIndex];
            const updatedEntries = [...currentLog.entries, newEntry];

            updatedLogs[existingLogIndex] = {
              ...currentLog,
              entries: updatedEntries,
              metrics: {
                ...currentLog.metrics,
                [metricId]: calculateMetricTotal(updatedEntries, metricId),
              },
            };
            return { logs: updatedLogs };
          } else {
            // Create new log
            const newLog: DayLog = {
              date,
              entries: [newEntry],
              metrics: { [metricId]: value },
            };
            return { logs: [...state.logs, newLog] };
          }
        });
      },

      updateMetricValue: (date, metricId, value) => {
        set((state) => {
          const existingLogIndex = state.logs.findIndex(
            (log) => log.date === date,
          );

          if (existingLogIndex >= 0) {
            const updatedLogs = [...state.logs];
            updatedLogs[existingLogIndex] = {
              ...updatedLogs[existingLogIndex],
              entries: updatedLogs[existingLogIndex].entries || [],
              metrics: {
                ...updatedLogs[existingLogIndex].metrics,
                [metricId]: value,
              },
            };
            return { logs: updatedLogs };
          } else {
            const newLog: DayLog = {
              date,
              entries: [],
              metrics: { [metricId]: value },
            };
            return { logs: [...state.logs, newLog] };
          }
        });
      },

      // Entry management (new functions)
      addEntry: (date, metricId, value, description) => {
        set((state) => {
          const existingLogIndex = state.logs.findIndex(
            (log) => log.date === date,
          );

          const newEntry: LogEntry = {
            id: generateEntryId(),
            metricId,
            value,
            timestamp: new Date().toISOString(),
            description,
          };

          if (existingLogIndex >= 0) {
            const updatedLogs = [...state.logs];
            const currentLog = updatedLogs[existingLogIndex];
            const updatedEntries = [...currentLog.entries, newEntry];

            updatedLogs[existingLogIndex] = {
              ...currentLog,
              entries: updatedEntries,
              metrics: {
                ...currentLog.metrics,
                [metricId]: calculateMetricTotal(updatedEntries, metricId),
              },
            };
            return { logs: updatedLogs };
          } else {
            const newLog: DayLog = {
              date,
              entries: [newEntry],
              metrics: { [metricId]: value },
            };
            return { logs: [...state.logs, newLog] };
          }
        });
      },

      removeEntry: (date, entryId) => {
        set((state) => {
          const existingLogIndex = state.logs.findIndex(
            (log) => log.date === date,
          );

          if (existingLogIndex >= 0) {
            const updatedLogs = [...state.logs];
            const currentLog = updatedLogs[existingLogIndex];
            const updatedEntries = currentLog.entries.filter(
              (entry) => entry.id !== entryId,
            );

            // Recalculate metrics for all affected metric types
            const affectedMetrics = new Set(
              currentLog.entries.map((e) => e.metricId),
            );
            const newMetrics = { ...currentLog.metrics };

            affectedMetrics.forEach((metricId) => {
              newMetrics[metricId] = calculateMetricTotal(
                updatedEntries,
                metricId,
              );
            });

            updatedLogs[existingLogIndex] = {
              ...currentLog,
              entries: updatedEntries,
              metrics: newMetrics,
            };
            return { logs: updatedLogs };
          }
          return state;
        });
      },

      updateEntry: (date, entryId, value, description) => {
        set((state) => {
          const existingLogIndex = state.logs.findIndex(
            (log) => log.date === date,
          );

          if (existingLogIndex >= 0) {
            const updatedLogs = [...state.logs];
            const currentLog = updatedLogs[existingLogIndex];
            const updatedEntries = currentLog.entries.map((entry) =>
              entry.id === entryId
                ? {
                    ...entry,
                    value,
                    description,
                    timestamp: new Date().toISOString(),
                  }
                : entry,
            );

            // Recalculate metrics
            const affectedMetrics = new Set(
              updatedEntries.map((e) => e.metricId),
            );
            const newMetrics = { ...currentLog.metrics };

            affectedMetrics.forEach((metricId) => {
              newMetrics[metricId] = calculateMetricTotal(
                updatedEntries,
                metricId,
              );
            });

            updatedLogs[existingLogIndex] = {
              ...currentLog,
              entries: updatedEntries,
              metrics: newMetrics,
            };
            return { logs: updatedLogs };
          }
          return state;
        });
      },

      getDayEntries: (date, metricId) => {
        const state = get();
        const dayLog = state.logs.find((log) => log.date === date);
        if (!dayLog) return [];

        return metricId
          ? dayLog.entries.filter((entry) => entry.metricId === metricId)
          : dayLog.entries;
      },

      // UI actions
      setSelectedDate: (date) => set({ selectedDate: date }),

      showMetricModal: (metricId) =>
        set({
          metricModalVisible: true,
          selectedMetricId: metricId,
        }),

      hideMetricModal: () =>
        set({
          metricModalVisible: false,
          selectedMetricId: null,
        }),

      // Utility getters
      getTodaysLog: () => {
        const today = getTodayString();
        return get().logs.find((log) => log.date === today) || null;
      },

      getMetricValueForDate: (date, metricId) => {
        const log = get().logs.find((log) => log.date === date);
        return log?.metrics[metricId] || 0;
      },

      getActiveMetricDefinitions: () => {
        const state = get();
        return state.availableMetrics.filter((metric) =>
          state.activeMetrics.includes(metric.id),
        );
      },
    })),
    {
      name: 'tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir data, no UI state
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Migrate old log format to new format
          state.logs = state.logs.map((log) => {
            if (!log.entries) {
              // Convert old format to new format
              const entries: LogEntry[] = Object.entries(log.metrics).map(
                ([metricId, value]) => ({
                  id: generateEntryId(),
                  metricId,
                  value,
                  timestamp: new Date(log.date + 'T12:00:00').toISOString(),
                  description: 'Migrated from old format',
                }),
              );

              return {
                ...log,
                entries,
              };
            }
            return log;
          });
        }
      },
      partialize: (state) => ({
        availableMetrics: state.availableMetrics,
        activeMetrics: state.activeMetrics,
        logs: state.logs,
      }),
    },
  ),
);
