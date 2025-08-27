import React, { forwardRef, useCallback } from 'react';
import { View, TouchableOpacity, Vibration } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Timer, Pause, Play } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTimer } from '@/features/active-workout/hooks/use-timer';
import {
  useActiveRestTimer,
  useActiveRestTimerActions,
} from '../../hooks/use-active-workout-store';

export const RestTimerBottomSheet = forwardRef<BottomSheetModal>(
  (_props, ref) => {
    const { colors, isDarkMode } = useColorScheme();
    const { adjustRestTimer, skipRestTimer } = useActiveRestTimerActions();
    const { totalTime, startedAt } = useActiveRestTimer() || {};

    // Función para la vibración de completado
    const playCompletionAlert = useCallback(() => {
      Vibration.vibrate([100, 50, 500, 50, 100]);
      console.log('🔔 Timer completed!');
    }, []);

    const restTimeSeconds = totalTime || 0;

    // Hook del timer con callbacks
    const {
      timeRemaining,
      isRunning,
      isPaused,
      progress,
      startTimer,
      pauseTimer,
      resumeTimer,
      skipTimer,
      addTime,
      subtractTime,
    } = useTimer({
      onComplete: () => {
        playCompletionAlert();
        // onTimerComplete();
        setTimeout(() => {
          if (ref && 'current' in ref && ref.current) {
            ref.current.dismiss();
          }
        }, 1000);
      },
    });

    // Iniciar timer cuando cambia el startedAt
    React.useEffect(() => {
      if (startedAt && restTimeSeconds > 0) {
        startTimer(
          restTimeSeconds,
          'Tiempo de descanso terminado',
          'Tu descanso ha terminado. ¡Continúa con tu entrenamiento!',
        );
      }
    }, [startedAt, restTimeSeconds, startTimer]);

    // Formatear tiempo
    const formatTime = useCallback((seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Handlers
    const handlePauseResume = useCallback(() => {
      if (isPaused) {
        resumeTimer();
      } else {
        pauseTimer();
      }
    }, [isPaused, pauseTimer, resumeTimer]);

    const handleAddTime = useCallback(
      (additionalSeconds: number) => {
        addTime(additionalSeconds);
        adjustRestTimer(timeRemaining + additionalSeconds);
      },
      [addTime, timeRemaining, adjustRestTimer],
    );

    const handleSubtractTime = useCallback(
      (subtractSeconds: number) => {
        const newTime = Math.max(0, timeRemaining - subtractSeconds);
        subtractTime(subtractSeconds);
        adjustRestTimer(newTime);
      },
      [subtractTime, timeRemaining, adjustRestTimer],
    );

    const handleSkip = useCallback(() => {
      skipTimer();
      skipRestTimer();
      if (ref && 'current' in ref && ref.current) {
        ref.current.dismiss();
      }
    }, [skipTimer, skipRestTimer, ref]);

    const handleDismiss = useCallback(() => {
      if (isRunning && timeRemaining > 0) {
        skipTimer();
        skipRestTimer();
      }
    }, [isRunning, timeRemaining, skipTimer, skipRestTimer]);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['60%']}
        enablePanDownToClose={true}
        onDismiss={handleDismiss}
        backgroundStyle={{
          backgroundColor: colors.background,
          shadowColor: colors.primary[500],
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 16,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 26,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Timer size={24} color={colors.primary[500]} />
              <Typography
                variant="h3"
                weight="semibold"
                style={{ marginLeft: 8 }}
              >
                Descanso
              </Typography>
            </View>
            <TouchableOpacity
              onPress={handleSkip}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: colors.gray[100],
                borderRadius: 8,
              }}
            >
              <Typography variant="caption" weight="medium" color="textMuted">
                Saltar
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Timer Display */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: 26,
            }}
          >
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: colors.primary[500] + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                position: 'relative',
              }}
            >
              {/* Progress Ring */}
              <View
                style={{
                  position: 'absolute',
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                  borderWidth: 8,
                  borderColor:
                    timeRemaining === 0
                      ? '#FFD700'
                      : progress > 0.8
                        ? colors.success[500]
                        : progress > 0.5
                          ? colors.warning[500]
                          : colors.primary[500],
                  opacity: 0.3,
                }}
              />

              {/* Time Display */}
              <Typography
                variant="h1"
                weight="bold"
                style={{ color: colors.primary[500], fontSize: 40 }}
              >
                {formatTime(timeRemaining)}
              </Typography>

              {/* Play/Pause Button */}
              <TouchableOpacity
                onPress={handlePauseResume}
                style={{
                  position: 'absolute',
                  bottom: 10,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isRunning && !isPaused ? (
                  <Pause size={20} color="white" />
                ) : (
                  <Play size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Adjustment Controls */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => handleSubtractTime(20)}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: isDarkMode
                  ? colors.gray[600]
                  : colors.gray[100],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" weight="bold" color="textMuted">
                -20s
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSubtractTime(10)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: isDarkMode
                  ? colors.gray[600]
                  : colors.gray[100],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" weight="bold" color="textMuted">
                -10s
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddTime(10)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: isDarkMode
                  ? colors.gray[600]
                  : colors.gray[100],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" weight="bold" color="textMuted">
                +10s
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddTime(20)}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: isDarkMode
                  ? colors.gray[600]
                  : colors.gray[100],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" weight="bold" color="textMuted">
                +20s
              </Typography>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

RestTimerBottomSheet.displayName = 'RestTimerBottomSheet';
