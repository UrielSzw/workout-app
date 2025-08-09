import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Button, Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { X, Timer, Flag } from 'lucide-react-native';

interface WorkoutProgress {
  completed: number;
  total: number;
  percentage: number;
  volume: number;
}

interface ActiveWorkoutHeaderProps {
  routineName: string;
  elapsedTime: string;
  isPaused: boolean;
  progress: WorkoutProgress;
  onExit: () => void;
}

export const ActiveWorkoutHeader: React.FC<ActiveWorkoutHeaderProps> = ({
  routineName,
  elapsedTime,
  isPaused,
  progress,
  onExit,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 20,
      }}
    >
      {/* Top Navigation - Solo X para salir */}
      <TouchableOpacity
        onPress={onExit}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: isDarkMode ? colors.gray[600] : colors.gray[100],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={20} color={colors.text} />
      </TouchableOpacity>

      {/* Rutina y Tiempo en el centro */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Typography variant="h6" weight="semibold" align="center">
          {routineName}
        </Typography>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginTop: 2,
          }}
        >
          <Timer size={14} color={colors.textMuted} />
          <Typography variant="body2" color="textMuted">
            {elapsedTime}
          </Typography>
          {isPaused && (
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 1,
                backgroundColor: colors.warning[100],
                borderRadius: 4,
                marginLeft: 8,
              }}
            >
              <Typography
                variant="caption"
                style={{ color: colors.warning[700], fontSize: 10 }}
                weight="medium"
              >
                PAUSADO
              </Typography>
            </View>
          )}
        </View>
      </View>

      {/* Espacio para mantener balance */}
      <View>
        <Button size="sm">
          <Flag size={20} color="#fff" />
        </Button>
      </View>
    </View>
  );
};
