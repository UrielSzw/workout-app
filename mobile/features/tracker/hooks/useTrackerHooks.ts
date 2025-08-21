import { useMemo } from 'react';
import { useTrackerStore } from './useTrackerStore';

// Utility hooks para suscripciones específicas (performance)
export const useActiveMetrics = () => {
  const availableMetrics = useTrackerStore((state) => state.availableMetrics);
  const activeMetricsIds = useTrackerStore((state) => state.activeMetrics);

  return useMemo(
    () =>
      availableMetrics.filter((metric) => activeMetricsIds.includes(metric.id)),
    [availableMetrics, activeMetricsIds],
  );
};

export const useTodaysLog = () => {
  const logs = useTrackerStore((state) => state.logs);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  return useMemo(
    () => logs.find((log) => log.date === today) || null,
    [logs, today],
  );
};

export const useMetricValue = (metricId: string, date: string) => {
  const logs = useTrackerStore((state) => state.logs);

  return useMemo(() => {
    const log = logs.find((log) => log.date === date);
    return log?.metrics[metricId] || 0;
  }, [logs, metricId, date]);
};
