import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Plus, Settings, Zap } from 'lucide-react-native';

import { Typography, Button } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTrackerStore } from './hooks/useTrackerStore';
import { useActiveMetrics } from './hooks/useTrackerHooks';
import { MetricCard } from './components/metric-card';
import { MetricModal } from './components/metric-modal';
import { DailySummary } from './components/daily-summary';
import { MetricSelectorModal } from './components/metric-selector-modal';

export const TrackerFeature = () => {
  const { colors } = useColorScheme();
  const activeMetrics = useActiveMetrics();
  const { selectedDate, logs } = useTrackerStore((state) => state);

  const [metricSelectorVisible, setMetricSelectorVisible] = useState(false);

  const handleAddMetric = () => {
    setMetricSelectorVisible(true);
  };

  const handleSettings = () => {
    // TODO: Abrir configuración de métricas
    console.log('Settings');
  };

  const handleDateChange = (date: string) => {
    useTrackerStore.getState().setSelectedDate(date);
  };

  const handleMetricPress = (metricId: string) => {
    useTrackerStore.getState().showMetricModal(metricId);
  };

  const completedMetrics = activeMetrics.filter((metric) => {
    const dayLog = logs.find((log) => log.date === selectedDate);
    const value = dayLog?.metrics[metric.id] || 0;
    return metric.dailyGoal ? value >= metric.dailyGoal : value > 0;
  }).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          width: '100%',
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <View style={{ flex: 1 }}>
          <Typography variant="h2" weight="bold" style={{ marginBottom: 4 }}>
            Tracker
          </Typography>
          {activeMetrics.length > 0 && (
            <View
              style={{
                width: '100%',
              }}
            >
              {/* Progress Overview */}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <Typography variant="body2" color="textMuted">
                    Progreso del día
                  </Typography>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Zap size={16} color={colors.secondary[500]} />
                    <Typography
                      variant="h4"
                      weight="bold"
                      style={{ color: colors.secondary[500] }}
                    >
                      {activeMetrics.length > 0
                        ? Math.round(
                            (completedMetrics / activeMetrics.length) * 100,
                          )
                        : 0}
                      %
                    </Typography>
                  </View>
                </View>

                {/* Progress Bar */}
                <View
                  style={{
                    height: 8,
                    backgroundColor: colors.gray[200],
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      width: `${
                        activeMetrics.length > 0
                          ? Math.round(
                              (completedMetrics / activeMetrics.length) * 100,
                            )
                          : 0
                      }%`,
                      backgroundColor: colors.secondary[500],
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Daily Summary */}
        <DailySummary
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        {/* Daily Metrics Section */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Typography variant="h5" weight="semibold">
              Métricas Diarias
            </Typography>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleAddMetric}
              icon={<Plus size={16} color={colors.primary[500]} />}
            >
              Agregar
            </Button>
          </View>

          {/* Metrics Grid */}
          {activeMetrics.length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 24,
              }}
            >
              {activeMetrics.map((metric) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  date={selectedDate}
                  onPress={() => handleMetricPress(metric.id)}
                />
              ))}
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 40,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <Typography
                variant="h6"
                weight="semibold"
                style={{ marginBottom: 8 }}
              >
                No hay métricas activas
              </Typography>
              <Typography
                variant="body2"
                color="textMuted"
                align="center"
                style={{ marginBottom: 16 }}
              >
                Agrega métricas para comenzar a trackear tu progreso
              </Typography>
              <Button
                variant="primary"
                onPress={handleAddMetric}
                icon={<Plus size={20} color="#ffffff" />}
              >
                Agregar Primera Métrica
              </Button>
            </View>
          )}
        </View>

        {/* Habits Section (Future) */}
        <View style={{ marginBottom: 32 }}>
          <Typography
            variant="h5"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Hábitos
          </Typography>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 40,
              borderRadius: 12,
            }}
          >
            <Typography variant="body2" color="textMuted" align="center">
              Próximamente...
            </Typography>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Metric Input Modal */}
      <MetricModal />

      {/* Metric Selector Modal */}
      <MetricSelectorModal
        visible={metricSelectorVisible}
        onClose={() => setMetricSelectorVisible(false)}
      />
    </SafeAreaView>
  );
};
