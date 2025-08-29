import { Typography } from '@/components/ui';
import {
  useEntryActions,
  useEntryState,
} from '@/features/tracker/hooks/use-tracker-store';
import { UUID } from '@/features/tracker/types';
import { formatTime, formatValue } from '@/features/tracker/utils/helpers';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Clock, Trash2 } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  selectedDate: string;
  selectedMetricId: UUID | null;
  unit: string | null;
};

export const DailyHistory: React.FC<Props> = ({
  selectedDate,
  selectedMetricId,
  unit,
}) => {
  const { colors } = useColorScheme();
  const { removeEntry } = useEntryActions();
  const entries = useEntryState();

  const todayEntries = useMemo(() => {
    const dayEntries = entries[selectedDate] || [];

    return dayEntries.filter((e) => e.metricId === selectedMetricId);
  }, [entries, selectedDate, selectedMetricId]);

  const handleRemoveEntry = (entryId: string) => {
    removeEntry(entryId, selectedDate);
  };

  if (!todayEntries.length) return null;

  return (
    <View style={{ marginBottom: 32 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Historial de Hoy
      </Typography>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        }}
      >
        {todayEntries.map((entry, index) => (
          <View
            key={entry.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: index < todayEntries.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}
          >
            {/* Entry Info */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <Clock size={12} color={colors.textMuted} />
                <Typography variant="caption" color="textMuted">
                  {formatTime(entry.createdAt)}
                </Typography>
              </View>
              <Typography
                variant="body2"
                weight="medium"
                style={{ marginBottom: 2 }}
              >
                +{formatValue(entry.value)} {unit}
              </Typography>
              {entry.notes && (
                <Typography variant="caption" color="textMuted">
                  {entry.notes}
                </Typography>
              )}
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => handleRemoveEntry(entry.id)}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: colors.error[50],
              }}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color={colors.error[500]} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};
