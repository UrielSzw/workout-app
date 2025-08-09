import React from 'react';
import { View } from 'react-native';
import { IActiveBlock } from '@/types/active-workout';
import { IRepsType, ISetType } from '@/types/routine';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';
import { Typography } from '@/components/ui';
import { ActiveExerciseRow } from './active-exercise-row';

type Props = {
  block: IActiveBlock;
  blockIndex: number;
  onCompleteSet: (
    exerciseId: string,
    setId: string,
    completionData: {
      actualWeight?: string;
      actualReps?: string;
      actualRpe?: number;
    },
  ) => void;
  onUncompleteSet: (exerciseId: string, setId: string) => void;
  onUpdateSetValue: (
    exerciseId: string,
    setId: string,
    field: string,
    value: string,
  ) => void;
  onShowRepsTypeSheet: (
    exerciseId: string,
    setId: string,
    current: IRepsType,
  ) => void;
  onShowSetTypeSheet: (
    exerciseId: string,
    setId: string,
    current: ISetType,
  ) => void;
  onAddSet: (exerciseId: string) => void;
};

export const ActiveBlockCard: React.FC<Props> = ({
  block,
  blockIndex,
  onCompleteSet,
  onUncompleteSet,
  onUpdateSetValue,
  onShowRepsTypeSheet,
  onShowSetTypeSheet,
  onAddSet,
}) => {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        gap: 12,
      }}
    >
      {/* Block Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h3" weight="semibold">
          Bloque {blockIndex + 1}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {block.exercises.length} ejercicio
          {block.exercises.length !== 1 ? 's' : ''}
        </Typography>
      </View>

      {/* Exercises */}
      <View style={{ gap: 8 }}>
        {block.exercises.map((exercise) => (
          <ActiveExerciseRow
            key={exercise.id}
            exercise={exercise}
            onCompleteSet={onCompleteSet}
            onUncompleteSet={onUncompleteSet}
            onUpdateSetValue={onUpdateSetValue}
            onShowRepsTypeSheet={onShowRepsTypeSheet}
            onShowSetTypeSheet={onShowSetTypeSheet}
            onAddSet={onAddSet}
          />
        ))}
      </View>
    </View>
  );
};
