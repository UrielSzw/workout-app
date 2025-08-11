import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, Vibration } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Timer, Minus, Plus, Pause, Play } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  restTimeSeconds: number;
  timerKey?: number; // timestamp para identificar nuevo timer
  onSkip: () => void;
  onAdjustTime: (newTimeSeconds: number) => void;
  onTimerComplete: () => void;
};

export const RestTimerBottomnSheet = forwardRef<BottomSheetModal, Props>(
  (
    { restTimeSeconds, timerKey, onSkip, onAdjustTime, onTimerComplete },
    ref,
  ) => {
    const { colors, isDarkMode } = useColorScheme();

    const [timeRemaining, setTimeRemaining] = useState(restTimeSeconds);
    const [isRunning, setIsRunning] = useState(true);

    // Reset timer only when timerKey changes (new timer started)
    useEffect(() => {
      if (timerKey && restTimeSeconds > 0) {
        setTimeRemaining(restTimeSeconds);
        setIsRunning(true);
      }
    }, [timerKey, restTimeSeconds]);

    console.log({ timeRemaining, isRunning });

    // Función para notificar cuando termine el timer
    const playCompletionAlert = useCallback(() => {
      // Vibración en patrón: corta-pausa-larga-pausa-corta
      Vibration.vibrate([100, 50, 500, 50, 100]);

      // Si hay notificaciones nativas disponibles, se podría agregar aquí
      console.log('🔔 Timer completed!');
    }, []);

    // Timer countdown logic
    useEffect(() => {
      let interval: number;

      if (isRunning && timeRemaining > 0) {
        interval = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              playCompletionAlert(); // Reproducir sonido/vibración
              onTimerComplete();
              // Cerrar el sheet cuando termine
              if (ref && 'current' in ref && ref.current) {
                ref.current.dismiss();
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [isRunning, timeRemaining, onTimerComplete, ref, playCompletionAlert]);

    const formatTime = useCallback((seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const handlePauseResume = () => {
      setIsRunning(!isRunning);
    };

    const handleAddTime = (additionalSeconds: number) => {
      const newTime = timeRemaining + additionalSeconds;
      setTimeRemaining(newTime);
      onAdjustTime(newTime);
    };

    const handleSubtractTime = (subtractSeconds: number) => {
      const newTime = Math.max(0, timeRemaining - subtractSeconds);
      setTimeRemaining(newTime);
      onAdjustTime(newTime);

      if (newTime === 0) {
        setIsRunning(false);
        playCompletionAlert(); // Reproducir sonido/vibración
        onTimerComplete();
        // Cerrar el sheet cuando llegue a 0
        if (ref && 'current' in ref && ref.current) {
          ref.current.dismiss();
        }
      }
    };

    const handleSkip = () => {
      setIsRunning(false);
      onSkip();
      // Cerrar el sheet cuando se salte
      if (ref && 'current' in ref && ref.current) {
        ref.current.dismiss();
      }
    };

    const handleDismiss = useCallback(() => {
      // Si se cierra el sheet manualmente, cortar el tiempo de descanso
      if (isRunning && timeRemaining > 0) {
        setIsRunning(false);
        onSkip(); // Llamar a la función de saltar del hook
      }
    }, [isRunning, timeRemaining, onSkip]);

    const progress = restTimeSeconds > 0 ? timeRemaining / restTimeSeconds : 0;

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['60%']}
        enablePanDownToClose
        onDismiss={handleDismiss}
        backgroundStyle={{
          backgroundColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      >
        <BottomSheetView style={{ padding: 20, paddingBottom: 40 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 32,
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
                backgroundColor: colors.error[100],
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
              marginBottom: 32,
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
              {/* Progress Ring - Simple Border */}
              <View
                style={{
                  position: 'absolute',
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                  borderWidth: 8,
                  borderColor:
                    progress > 0.8
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
                {isRunning ? (
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
              onPress={() => handleSubtractTime(30)}
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
                -30s
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSubtractTime(15)}
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
              <Minus size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddTime(15)}
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
              <Plus size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddTime(30)}
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
                +30s
              </Typography>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

RestTimerBottomnSheet.displayName = 'RestTimerBottomnSheet';
