import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  IMetricDefinition,
  IEntry,
  IDailyAggregate,
  UUID,
  IQuickAction,
} from '../types';
import {
  generateUUID,
  getTodayKey,
  createEntry,
  updateAggregateWithEntry,
  recalcAggregateFromEntries,
} from '../utils/store-helpers';

type IStore = {
  // Datos centrales
  metrics: Record<UUID, IMetricDefinition>;
  entries: Record<string, IEntry[]>; // key = dayKey
  quickActions: Record<UUID, IQuickAction>;
  aggregates: Record<string, Record<UUID, IDailyAggregate>>;
  // aggregates[dayKey][metricId] -> aggregate

  // Estado de UI
  selectedDate: string; // YYYY-MM-DD
  metricModalVisible: boolean;
  selectedMetricId: UUID | null;

  // Acciones sobre métricas
  metricActions: {
    addMetric: (metric: Omit<IMetricDefinition, 'id' | 'createdAt'>) => void;
    updateMetric: (id: UUID, patch: Partial<IMetricDefinition>) => void;
    removeMetric: (id: UUID) => void;
    getMetrics: () => IMetricDefinition[];
  };

  // Acciones sobre entradas
  entryActions: {
    addEntry: (
      metricId: UUID,
      value: number,
      unit: string,
      dayKey: string,
      notes?: string,
    ) => void;
    updateEntry: (
      entryId: UUID,
      dayKey: string,
      patch: Partial<IEntry>,
    ) => void;
    removeEntry: (entryId: UUID, dayKey: string) => void;
    getDayEntries: (dayKey: string, metricId?: UUID) => IEntry[];
  };

  // Acciones sobre acciones rápidas
  quickActionActions: {
    getQuickActions: (metricId: UUID) => IQuickAction[];
  };

  // Acciones sobre agregados
  aggregateActions: {
    getAggregate: (dayKey: string, metricId: UUID) => IDailyAggregate | null;
    recalcDay: (dayKey: string, metricId: UUID) => void;
  };

  // Acciones de UI
  uiActions: {
    setSelectedDate: (date: string) => void;
    showMetricModal: (metricId: UUID) => void;
    hideMetricModal: () => void;
  };
};

const useTrackerStore = create<IStore>()(
  immer((set, get) => ({
    metrics: {},
    entries: {},
    aggregates: {},
    quickActions: {},
    selectedDate: getTodayKey(),
    metricModalVisible: false,
    selectedMetricId: null,

    metricActions: {
      addMetric: (metric) => {
        const id = generateUUID();
        const now = new Date().toISOString();
        set((state) => {
          state.metrics[id] = {
            ...metric,
            id,
            createdAt: now,
          };
        });
      },
      updateMetric: (id, patch) => {
        set((state) => {
          if (state.metrics[id]) {
            state.metrics[id] = {
              ...state.metrics[id],
              ...patch,
              updatedAt: new Date().toISOString(),
            };
          }
        });
      },
      removeMetric: (id) => {
        set((state) => {
          delete state.metrics[id];
          // opcional: también limpiar aggregates y entries asociadas
        });
      },
      getMetrics: () => Object.values(get().metrics),
    },

    entryActions: {
      addEntry: (metricId, value, unit, dayKey, notes) => {
        console.log('Adding entry:', { metricId, value, unit, dayKey, notes });

        const metric = get().metrics[metricId];

        console.log(metric);

        if (!metric) return;

        const entry = createEntry(metric, value, unit, dayKey, notes);
        console.log('entru', entry);
        set((state) => {
          if (!state.entries[dayKey]) state.entries[dayKey] = [];
          state.entries[dayKey].push(entry);

          if (!state.aggregates[dayKey]) state.aggregates[dayKey] = {};
          state.aggregates[dayKey][metricId] = updateAggregateWithEntry(
            state.aggregates[dayKey][metricId],
            entry,
          );
        });
      },
      updateEntry: (entryId, dayKey, patch) => {
        set((state) => {
          const entries = state.entries[dayKey];
          if (!entries) return;

          const idx = entries.findIndex((e) => e.id === entryId);
          if (idx === -1) return;

          const updated = {
            ...entries[idx],
            ...patch,
            updatedAt: new Date().toISOString(),
          };
          entries[idx] = updated;

          // Recalcular aggregate de ese metric
          state.aggregates[dayKey][updated.metricId] =
            recalcAggregateFromEntries(
              entries.filter((e) => e.metricId === updated.metricId),
            );
        });
      },
      removeEntry: (entryId, dayKey) => {
        set((state) => {
          const safeDayKey = String(dayKey).trim();

          const entries = state.entries[safeDayKey];

          if (!entries) return;

          const idx = entries.findIndex((e) => e.id === entryId);

          if (idx === -1) return;

          const [removed] = entries.splice(idx, 1);

          state.aggregates[safeDayKey][removed.metricId] =
            recalcAggregateFromEntries(
              entries.filter((e) => e.metricId === removed.metricId),
            );
        });
      },
      getDayEntries: (dayKey, metricId) => {
        const entries = get().entries[dayKey] || [];
        return metricId
          ? entries.filter((e) => e.metricId === metricId)
          : entries;
      },
    },

    quickActionActions: {
      getQuickActions: (metricId: UUID) => {
        return Object.values(get().quickActions).filter(
          (qa) => qa.metricId === metricId,
        );
      },
    },

    aggregateActions: {
      getAggregate: (dayKey, metricId) => {
        return get().aggregates[dayKey]?.[metricId] || null;
      },
      recalcDay: (dayKey, metricId) => {
        set((state) => {
          const entries = state.entries[dayKey] || [];
          state.aggregates[dayKey] = state.aggregates[dayKey] || {};
          state.aggregates[dayKey][metricId] = recalcAggregateFromEntries(
            entries.filter((e) => e.metricId === metricId),
          );
        });
      },
    },

    uiActions: {
      setSelectedDate: (date) =>
        set((s) => {
          s.selectedDate = date;
        }),
      showMetricModal: (metricId) =>
        set((s) => {
          s.metricModalVisible = true;
          s.selectedMetricId = metricId;
        }),
      hideMetricModal: () =>
        set((s) => {
          s.metricModalVisible = false;
          s.selectedMetricId = null;
        }),
    },
  })),
);

export const useMetricState = () => useTrackerStore((state) => state.metrics);

export const useEntryState = () => useTrackerStore((state) => state.entries);

export const useMetricActions = () =>
  useTrackerStore((state) => state.metricActions);

export const useEntryActions = () =>
  useTrackerStore((state) => state.entryActions);

export const useDailyAggregateActions = () =>
  useTrackerStore((state) => state.aggregateActions);
