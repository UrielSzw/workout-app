import React, { useEffect, useState, useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';
import { Typography } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  isVisible: boolean;
  restTimeSeconds: number;
  onSkip: () => void;
  onAdjustTime: (newTimeSeconds: number) => void;
  onTimerComplete: () => void;
};

export const RestTimerSheet: React.FC<Props> = ({
  isVisible,
  restTimeSeconds,
  onSkip,
  onAdjustTime,
  onTimerComplete,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  const [timeRemaining, setTimeRemaining] = useState(restTimeSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // Reset timer when visibility or rest time changes
  useEffect(() => {
    if (isVisible) {
      setTimeRemaining(restTimeSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [isVisible, restTimeSeconds]);

  // Timer countdown logic
  useEffect(() => {
    let interval: number;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimerComplete();
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
  }, [isRunning, timeRemaining, onTimerComplete]);

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
      onTimerComplete();
    }
  };

  const progress = timeRemaining / restTimeSeconds;

  if (!isVisible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <Typography variant="h3" weight="semibold">
          Descanso
        </Typography>
        <Pressable
          onPress={onSkip}
          style={{
            backgroundColor: colors.error[500],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Typography variant="body2" color="white" weight="medium">
            Saltar
          </Typography>
        </Pressable>
      </View>

      {/* Progress Ring / Bar */}
      <View
        style={{
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.gray[200],
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Progress indicator */}
          <View
            style={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 8,
              borderColor: colors.primary[500],
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              transform: [{ rotate: `${(1 - progress) * 360}deg` }],
            }}
          />

          <Typography variant="h1" weight="bold">
            {formatTime(timeRemaining)}
          </Typography>
        </View>
      </View>

      {/* Controls */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 16,
        }}
      >
        {/* Subtract 30s */}
        <Pressable
          onPress={() => handleSubtractTime(30)}
          style={{
            backgroundColor: colors.warning[500],
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="white" weight="bold">
            -30
          </Typography>
        </Pressable>

        {/* Pause/Resume */}
        <Pressable
          onPress={handlePauseResume}
          style={{
            backgroundColor: colors.primary[500],
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={24}
            color="white"
          />
        </Pressable>

        {/* Add 30s */}
        <Pressable
          onPress={() => handleAddTime(30)}
          style={{
            backgroundColor: colors.success[500],
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="white" weight="bold">
            +30
          </Typography>
        </Pressable>
      </View>

      {/* Quick time adjustments */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        {[15, 60, 120].map((seconds) => (
          <Pressable
            key={seconds}
            onPress={() => handleAddTime(seconds)}
            style={{
              backgroundColor: colors.gray[100],
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Typography variant="caption" weight="medium">
              +{seconds}s
            </Typography>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
