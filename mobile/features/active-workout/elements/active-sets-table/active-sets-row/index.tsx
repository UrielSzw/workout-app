import { Typography } from '@/components/ui';
import { IActiveToggleSheet } from '@/features/active-workout/hooks/use-active-workout-sheets';
import {
  useActiveEditValuesActions,
  useActiveSetActions,
} from '@/features/active-workout/hooks/use-active-workout-store';
import { useBlockStyles } from '@/hooks/use-block-styles';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IActiveExerciseInBlock, IActiveSet } from '@/types/active-workout';
import { Check } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  set: IActiveSet;
  setIndex: number;
  exerciseInBlock: IActiveExerciseInBlock;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  prevSet?: IActiveSet;
  onToggleSheet: (sheet?: IActiveToggleSheet) => void;
};

export const ActiveSetRow: React.FC<Props> = ({
  set,
  exerciseInBlock,
  setIndex,
  blockColors,
  prevSet,
  onToggleSheet,
}) => {
  const [setData, setSetData] = useState({
    weight: '',
    reps: '',
    rpe: '',
  });

  const { colors } = useColorScheme();
  const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();
  const { completeSet, uncompleteSet } = useActiveSetActions();
  const { setEditValues } = useActiveEditValuesActions();

  const handleSetPress = (completed: boolean, setId: string) => {
    if (completed) {
      uncompleteSet(exerciseInBlock.id, setId);
    } else {
      const restTime = completeSet(exerciseInBlock.id, setId, {
        actualWeight: setData.weight || set.weight || '0',
        actualReps: setData.reps || set?.repsRange?.min || set.reps || '0',
      });

      if (restTime) {
        onToggleSheet('restTimer');
      }
    }
  };

  const getRepsPlaceholder = () => {
    if (set.repsType === 'range') {
      return `${set.repsRange?.min || 0}-${set.repsRange?.max || 0}`;
    }

    return set.reps;
  };

  const handleSetType = useCallback(() => {
    onToggleSheet('setType');
    setEditValues({
      setId: set.id,
      exerciseInBlockId: exerciseInBlock.id,
      currentSetType: set.type,
    });
  }, [set.id, set.type, exerciseInBlock.id, onToggleSheet, setEditValues]);

  const renderWeight = setData.weight || set.actualWeight || '';
  const renderReps = setData.reps || set.actualReps || '';

  const isSetCompleted = !!set.completedAt;

  return (
    <View
      key={set.id}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: isSetCompleted ? blockColors.light : 'transparent',
        paddingHorizontal: 8,
      }}
    >
      {/* Set Number */}
      <View style={{ width: 40, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={handleSetType}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor:
              set.type !== 'normal' ? getSetTypeColor(set.type) : colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            weight="medium"
            style={{
              color: set.type !== 'normal' ? 'white' : colors.text,
              fontSize: 10,
            }}
          >
            {getSetTypeLabel(set.type) || (setIndex + 1).toString()}
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Previous Set Info */}
      <View style={{ width: 80, alignItems: 'center' }}>
        <Typography
          style={{ fontSize: 14 }}
          variant="caption"
          color="textMuted"
        >
          {prevSet ? `${prevSet.actualWeight}kg x ${prevSet.actualReps}` : '-'}
        </Typography>
      </View>

      {/* Weight Input */}
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        <TextInput
          value={renderWeight}
          onChangeText={(value) =>
            setSetData((prev) => ({ ...prev, weight: value }))
          }
          placeholder={set.weight || '0'}
          keyboardType="numeric"
          placeholderTextColor={colors.textMuted}
          style={{
            backgroundColor: 'transparent',
            borderWidth: 0,
            paddingHorizontal: 8,
            paddingVertical: 6,
            textAlign: 'center',
            color: colors.text,
            fontSize: 18,
          }}
        />
      </View>

      {/* Reps Input */}
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        <TextInput
          value={renderReps}
          onChangeText={(value) =>
            setSetData((prev) => ({ ...prev, reps: value }))
          }
          placeholder={getRepsPlaceholder() || '0'}
          keyboardType="numeric"
          placeholderTextColor={colors.textMuted}
          style={{
            backgroundColor: 'transparent',
            borderWidth: 0,
            paddingHorizontal: 8,
            paddingVertical: 6,
            textAlign: 'center',
            color: colors.text,
            fontSize: 18,
          }}
        />
      </View>

      {/* Complete Button */}
      <View style={{ width: 40, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => handleSetPress(isSetCompleted, set.id)}
          style={{
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            backgroundColor: isSetCompleted
              ? blockColors.primary
              : colors.background,
            borderWidth: isSetCompleted ? 0 : 2,
            borderColor: isSetCompleted ? 'transparent' : colors.border,
            shadowColor: isSetCompleted ? blockColors.primary : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: isSetCompleted ? 3 : 0,
          }}
        >
          <Check
            size={16}
            color={isSetCompleted ? '#ffffff' : colors.textMuted}
            strokeWidth={isSetCompleted ? 2.5 : 2}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
