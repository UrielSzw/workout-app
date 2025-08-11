import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IActiveExerciseInBlock, IActiveSet } from '@/types/active-workout';
import { ISetType } from '@/types/routine';
import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  set: IActiveSet;
  setIndex: number;
  exerciseInBlock: IActiveExerciseInBlock;
  onCompleteSet: (
    exerciseId: string,
    setId: string,
    completionData: {
      actualWeight?: string | undefined;
      actualReps?: string | undefined;
      actualRpe?: number | undefined;
    },
  ) => void;
  onUncompleteSet: (exerciseId: string, setId: string) => void;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  getSetTypeColor: (type: string) => string;
  getSetTypeLabel: (type: string) => string;
};

export const SetRow: React.FC<Props> = ({
  set,
  exerciseInBlock,
  onCompleteSet,
  onUncompleteSet,
  blockColors,
  getSetTypeColor,
  getSetTypeLabel,
  setIndex,
}) => {
  const [setData, setSetData] = useState({
    weight: '',
    reps: '',
    rpe: '',
  });

  const { colors } = useColorScheme();

  const handleSetPress = (completed: boolean, setId: string) => {
    if (completed) {
      onUncompleteSet(exerciseInBlock.id, setId);
    } else {
      onCompleteSet(exerciseInBlock.id, setId, {
        actualWeight: setData.weight || set.weight,
        actualReps: setData.reps || set.reps,
      });
    }
  };

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
          // onPress={() =>
          //   onShowSetTypeBottomSheet(set.id, exerciseInBlock.id, set.type)
          // }
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
          12kg x 10
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
          placeholder={set.reps || '0'}
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
