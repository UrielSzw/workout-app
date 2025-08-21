import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar, Zap } from 'lucide-react-native';

import { Typography, Card } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTrackerStore } from '../../hooks/useTrackerStore';
import { useActiveMetrics } from '../../hooks/useTrackerHooks';

type Props = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export const DailySummary: React.FC<Props> = ({
  selectedDate,
  onDateChange,
}) => {
  const { colors } = useColorScheme();
  const activeMetrics = useActiveMetrics();
  const logs = useTrackerStore((state) => state.logs);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format for comparison (YYYY-MM-DD)
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];

    if (dateString === todayString) return 'Hoy';
    if (dateString === yesterdayString) return 'Ayer';

    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    const today = new Date().toISOString().split('T')[0];

    // Don't go beyond today
    if (selectedDate < today) {
      date.setDate(date.getDate() + 1);
      onDateChange(date.toISOString().split('T')[0]);
    }
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const completedMetrics = activeMetrics.filter((metric) => {
    const dayLog = logs.find((log) => log.date === selectedDate);
    const value = dayLog?.metrics[metric.id] || 0;
    return metric.dailyGoal ? value >= metric.dailyGoal : value > 0;
  }).length;

  return (
    <Card variant="outlined" padding="lg" style={{ marginBottom: 24 }}>
      {/* Date Navigation */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={goToPreviousDay}
          style={{ padding: 8 }}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToToday}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            // backgroundColor: isToday ? colors.primary[100] : 'transparent',
          }}
          activeOpacity={0.7}
        >
          <Calendar
            size={16}
            color={isToday ? colors.text : colors.textMuted}
          />
          <Typography
            variant="h6"
            weight="semibold"
            style={{ color: isToday ? colors.text : colors.textMuted }}
          >
            {formatDate(selectedDate)}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNextDay}
          style={{
            padding: 8,
            opacity: isToday ? 0.3 : 1,
          }}
          activeOpacity={isToday ? 0.3 : 0.7}
          disabled={isToday}
        >
          <ChevronRight size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Daily Stats */}

      {/* Empty State */}
      {activeMetrics.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
          <Typography variant="body2" color="textMuted" align="center">
            Agrega métricas para ver tu progreso diario
          </Typography>
        </View>
      )}
    </Card>
  );
};
