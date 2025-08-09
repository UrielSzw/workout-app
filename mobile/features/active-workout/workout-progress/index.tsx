import React from 'react';
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';
import { Typography } from '@/components/ui';

type Props = {
  completed: number;
  total: number;
  percentage: number;
  volume: number;
  averageRpe?: number;
};

export const WorkoutProgress: React.FC<Props> = ({
  completed,
  total,
  percentage,
  volume,
  averageRpe,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {/* Progress Bar */}
      <View
        style={{
          height: 8,
          backgroundColor: colors.gray[200],
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: colors.success[500],
            borderRadius: 4,
          }}
        />
      </View>

      {/* Stats Row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Typography variant="caption" color="textMuted">
            Series
          </Typography>
          <Typography variant="body2" weight="semibold">
            {completed}/{total}
          </Typography>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Typography variant="caption" color="textMuted">
            Progreso
          </Typography>
          <Typography variant="body2" weight="semibold">
            {percentage}%
          </Typography>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Typography variant="caption" color="textMuted">
            Volumen
          </Typography>
          <Typography variant="body2" weight="semibold">
            {Math.round(volume)}kg
          </Typography>
        </View>

        {averageRpe && (
          <View style={{ alignItems: 'center' }}>
            <Typography variant="caption" color="textMuted">
              RPE Prom.
            </Typography>
            <Typography variant="body2" weight="semibold">
              {averageRpe}
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
};
