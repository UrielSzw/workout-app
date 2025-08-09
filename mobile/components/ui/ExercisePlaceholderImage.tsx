import React from 'react';
import { View } from 'react-native';
import { Dumbbell } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ExercisePlaceholderImageProps {
  size?: number;
}

export const ExercisePlaceholderImage: React.FC<
  ExercisePlaceholderImageProps
> = ({ size = 48 }) => {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        backgroundColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Dumbbell size={size * 0.5} color={colors.textMuted} />
    </View>
  );
};
