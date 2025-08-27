import React from 'react';
import { Typography } from '@/components/ui';
import { ExercisePlaceholderImage } from '@/components/ui/ExercisePlaceholderImage';
import { IExerciseInBlock } from '@/types/routine';
import { View } from 'react-native';

type Props = {
  exerciseInBlock: IExerciseInBlock;
};

const ExerciseHeaderComponent: React.FC<Props> = ({ exerciseInBlock }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
      }}
    >
      <ExercisePlaceholderImage size={40} />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Typography variant="body1" weight="semibold">
            {exerciseInBlock.exercise.name}
          </Typography>
        </View>
        <Typography variant="caption" color="textMuted">
          {exerciseInBlock.exercise.muscleGroups.join(', ')}
        </Typography>
      </View>
    </View>
  );
};

export const ExerciseHeader = React.memo(ExerciseHeaderComponent);
ExerciseHeader.displayName = 'ExerciseHeader';
