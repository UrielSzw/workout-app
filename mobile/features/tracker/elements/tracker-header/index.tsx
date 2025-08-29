import { Typography } from '@/components/ui';
import { Zap } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import {
  useEntryActions,
  useMetricActions,
} from '../../hooks/use-tracker-store';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  selectedDate: string;
};

export const TrackerHeader: React.FC<Props> = ({ selectedDate }) => {
  const { getMetrics } = useMetricActions();
  const { getDayEntries } = useEntryActions();
  const { colors } = useColorScheme();

  const activeMetrics = getMetrics();

  const completedMetrics = activeMetrics.filter((metric) => {
    const dayEntries = getDayEntries(selectedDate);
    const value =
      dayEntries.find((entry) => entry.metricId === metric.id)?.value || 0;
    return metric.defaultTarget ? value >= metric.defaultTarget : value > 0;
  }).length;

  return (
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
  );
};
