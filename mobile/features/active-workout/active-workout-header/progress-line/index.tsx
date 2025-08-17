import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type Props = {
  progressPercentage: number;
};

export const ProgressLine: React.FC<Props> = ({ progressPercentage }) => {
  const { colors } = useColorScheme();

  const progressAnim = useRef(
    new Animated.Value((width * progressPercentage) / 100),
  ).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (width * progressPercentage) / 100,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progressAnim, progressPercentage]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        height: 3,
        width: progressAnim,
        backgroundColor: colors.primary[500],
        bottom: -2,
        borderRadius: 2,
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
      }}
    />
  );
};
