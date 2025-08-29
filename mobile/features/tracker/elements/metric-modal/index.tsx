import React, { useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UUID } from '../../types';
import {
  useDailyAggregateActions,
  useMetricActions,
} from '../../hooks/use-tracker-store';
import { DailySummary } from './daily-summary';
import { DailyHistory } from './daily-history';
import { ModalHeader } from './modal-header';
import { QuickActions } from './quick-actions';
import { ManualInput } from './manual-input';

type Props = {
  selectedMetricId: UUID | null;
  setSelectedMetricId: (metric: UUID | null) => void;
  selectedDate: string;
};

export const MetricModal: React.FC<Props> = ({
  selectedMetricId,
  setSelectedMetricId,
  selectedDate,
}) => {
  const { colors } = useColorScheme();
  const { getMetrics } = useMetricActions();
  const { getAggregate } = useDailyAggregateActions();

  const [inputValue, setInputValue] = useState('');

  const selectedMetric = getMetrics().find((m) => m.id === selectedMetricId);

  const currentValue = selectedMetricId
    ? getAggregate(selectedDate, selectedMetricId)?.sumNormalized
    : 0;

  const handleCloseModal = () => {
    setSelectedMetricId(null);
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  if (!selectedMetric) return null;

  return (
    <Modal
      visible={!!selectedMetricId}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setSelectedMetricId(null)}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <ModalHeader
            selectedMetric={selectedMetric}
            currentValue={currentValue}
            onClose={handleCloseModal}
          />

          <ScrollView
            style={{ flex: 1, padding: 20 }}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          >
            {/* Quick Actions */}
            <QuickActions
              selectedMetric={selectedMetric}
              selectedDate={selectedDate}
              onCloseModal={handleCloseModal}
              onClearInput={handleClearInput}
            />

            {/* Manual Input */}
            <ManualInput
              selectedMetric={selectedMetric}
              inputValue={inputValue}
              selectedDate={selectedDate}
              onCloseModal={handleCloseModal}
              onChangeInput={setInputValue}
            />

            {/* Historial del Día */}
            <DailyHistory
              selectedDate={selectedDate}
              selectedMetricId={selectedMetricId}
              unit={selectedMetric.unit}
            />

            {/* Daily Summary */}
            <DailySummary
              currentValue={currentValue}
              unit={selectedMetric.unit}
              defaultTarget={selectedMetric.defaultTarget}
              color={selectedMetric.color}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
