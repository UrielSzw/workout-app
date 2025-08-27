import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Button, Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { X, Timer, Flag } from 'lucide-react-native';
import { ElapsedTime } from './elapsed-time';
import { ProgressLine } from './progress-line';
import {
  useActiveWorkoutActions,
  useActiveWorkoutState,
  useIsWorkoutActiveState,
} from '../../hooks/use-active-workout-store';
import { router } from 'expo-router';

export const ActiveWorkoutHeader = () => {
  const [elapsedTime, setElapsedTime] = useState(0);

  const { colors, isDarkMode } = useColorScheme();
  const activeWorkout = useActiveWorkoutState();
  const isWorkoutActive = useIsWorkoutActiveState();
  const { cancelWorkout } = useActiveWorkoutActions();

  const handleFinishWorkout = () => {
    // onFinishWorkout(elapsedTime);
  };

  const handleExitWorkout = () => {
    Alert.alert(
      'Confirmar',
      'Esto eliminará todo el progreso del entrenamiento. ¿Estás seguro?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, eliminar',
          style: 'destructive',
          onPress: () => {
            cancelWorkout();
            router.back();
          },
        },
      ],
    );
  };

  if (!activeWorkout) return null;

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Animated Progress Line */}
      <ProgressLine />

      {/* Top Navigation - Solo X para salir */}
      <TouchableOpacity
        onPress={handleExitWorkout}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={20} color={colors.text} />
      </TouchableOpacity>

      {/* Rutina y Tiempo en el centro */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Typography variant="h6" weight="semibold" align="center">
          {activeWorkout?.name}
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
          <ElapsedTime
            activeWorkout={activeWorkout}
            isWorkoutActive={isWorkoutActive}
            elapsedTime={elapsedTime}
            setElapsedTime={setElapsedTime}
          />
        </View>
      </View>

      {/* Espacio para mantener balance */}
      <View>
        <Button size="sm" onPress={handleFinishWorkout}>
          <Flag size={20} color="#fff" />
        </Button>
      </View>
    </View>
  );
};
