import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ArrowLeft, Play, Pause, X, Check } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';

interface Props {
  routineName: string;
  elapsedTime: string;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
  onFinish: () => void;
}

export const ActiveWorkoutHeader: React.FC<Props> = ({
  routineName,
  elapsedTime,
  isPaused,
  onPause,
  onResume,
  onExit,
  onFinish,
}) => {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      {/* Top Row - Navigation and Actions */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={onExit}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: colors.gray[100],
          }}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {/* Pause/Resume Button */}
          <TouchableOpacity
            onPress={isPaused ? onResume : onPause}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: isPaused
                ? colors.success[100]
                : colors.warning[100],
            }}
          >
            {isPaused ? (
              <Play size={20} color={colors.success[600]} />
            ) : (
              <Pause size={20} color={colors.warning[600]} />
            )}
          </TouchableOpacity>

          {/* Finish Button */}
          <TouchableOpacity
            onPress={onFinish}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: colors.primary[100],
            }}
          >
            <Check size={20} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Row - Routine Info */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Typography variant="h6" weight="bold" numberOfLines={1}>
            {routineName}
          </Typography>
          <Typography variant="body2" color="textMuted">
            {isPaused ? 'Pausado' : 'En progreso'}
          </Typography>
        </View>

        {/* Timer */}
        <View
          style={{
            backgroundColor: isPaused
              ? colors.warning[100]
              : colors.success[100],
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Typography
            variant="body1"
            weight="bold"
            style={{
              color: isPaused ? colors.warning[700] : colors.success[700],
            }}
          >
            ⏱️ {elapsedTime}
          </Typography>
        </View>
      </View>
    </View>
  );
};
