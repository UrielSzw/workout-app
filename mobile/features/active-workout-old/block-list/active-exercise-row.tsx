import React from 'react';
import { View, Pressable } from 'react-native';
import { IActiveExerciseInBlock } from '@/types/active-workout';
import { IRepsType, ISetType } from '@/types/routine';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';
import { Typography } from '@/components/ui';
import { ActiveSetRow } from './active-set-row';

type Props = {
  exercise: IActiveExerciseInBlock;
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

export const ActiveExerciseRow: React.FC<Props> = ({
  exercise,
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
        backgroundColor: colors.surfaceSecondary,
        borderRadius: 8,
        padding: 12,
        gap: 8,
      }}
    >
      {/* Exercise Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body1" weight="semibold">
          {exercise.exercise.name}
        </Typography>
        <Pressable
          onPress={() => onAddSet(exercise.id)}
          style={{
            backgroundColor: colors.primary[500],
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Typography variant="caption" color="white" weight="medium">
            + Serie
          </Typography>
        </Pressable>
      </View>

      {/* Sets */}
      <View style={{ gap: 4 }}>
        {exercise.sets.map((set, index) => (
          <ActiveSetRow
            key={set.id}
            set={set}
            setIndex={index}
            exerciseId={exercise.id}
            onCompleteSet={onCompleteSet}
            onUncompleteSet={onUncompleteSet}
            onUpdateSetValue={onUpdateSetValue}
            onShowRepsTypeSheet={onShowRepsTypeSheet}
            onShowSetTypeSheet={onShowSetTypeSheet}
          />
        ))}
      </View>
    </View>
  );
};
