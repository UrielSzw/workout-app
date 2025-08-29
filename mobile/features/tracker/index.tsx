import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Typography, Button } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DatePicker } from './elements/date-picker';
import { EmptyMetrics } from './elements/empty-metrics';
import { getTodayKey } from './utils/store-helpers';
import { TrackerHeader } from './elements/tracker-header';
import { useMetricActions } from './hooks/use-tracker-store';
import { MetricSelectorModal } from './elements/metric-selector-modal';
import { MetricCard } from './elements/metric-card';
import { UUID } from './types';
import { MetricModal } from './elements/metric-modal';

export const TrackerFeature = () => {
  const { colors } = useColorScheme();
  const { getMetrics } = useMetricActions();

  const [metricSelectorVisible, setMetricSelectorVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayKey);
  const [selectedMetricId, setSelectedMetricId] = useState<UUID | null>(null);

  const activeMetrics = getMetrics();

  const handleAddMetric = () => {
    setMetricSelectorVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TrackerHeader selectedDate={selectedDate} />

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

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
                  onPress={() => setSelectedMetricId(metric.id)}
                />
              ))}
            </View>
          ) : (
            <EmptyMetrics onAddMetric={handleAddMetric} />
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Metric Input Modal */}
      <MetricModal
        selectedDate={selectedDate}
        selectedMetricId={selectedMetricId}
        setSelectedMetricId={setSelectedMetricId}
      />

      {/* Metric Selector Modal */}
      <MetricSelectorModal
        visible={metricSelectorVisible}
        onClose={() => setMetricSelectorVisible(false)}
      />
    </SafeAreaView>
  );
};
