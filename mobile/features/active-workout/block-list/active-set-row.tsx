import React, { useState } from 'react';
import { View, Pressable, TextInput, Alert } from 'react-native';
import { IActiveSet } from '@/types/active-workout';
import { IRepsType, ISetType } from '@/types/routine';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';
import { Typography } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  set: IActiveSet;
  setIndex: number;
  exerciseId: string;
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
};

export const ActiveSetRow: React.FC<Props> = ({
  set,
  setIndex,
  exerciseId,
  onCompleteSet,
  onUncompleteSet,
  onUpdateSetValue,
  onShowRepsTypeSheet,
  onShowSetTypeSheet,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  const [localWeight, setLocalWeight] = useState(
    set.actualWeight || set.weight || '',
  );
  const [localReps, setLocalReps] = useState(set.actualReps || set.reps || '');

  const isCompleted = !!set.completedAt;

  const handleCompleteSet = () => {
    if (isCompleted) {
      onUncompleteSet(exerciseId, set.id);
    } else {
      // Validate required fields
      if (!localWeight.trim() || !localReps.trim()) {
        Alert.alert(
          'Campos requeridos',
          'Por favor completa peso y repeticiones',
        );
        return;
      }

      onCompleteSet(exerciseId, set.id, {
        actualWeight: localWeight,
        actualReps: localReps,
        actualRpe: set.rpe,
      });
    }
  };

  const handleWeightChange = (text: string) => {
    setLocalWeight(text);
    onUpdateSetValue(exerciseId, set.id, 'actualWeight', text);
  };

  const handleRepsChange = (text: string) => {
    setLocalReps(text);
    onUpdateSetValue(exerciseId, set.id, 'actualReps', text);
  };

  const getRepsDisplayText = () => {
    switch (set.repsType) {
      case 'reps':
        return 'reps';
      case 'time':
        return 'seg';
      case 'distance':
        return 'm';
      default:
        return 'reps';
    }
  };

  const getSetTypeDisplayText = () => {
    switch (set.type) {
      case 'normal':
        return 'N';
      case 'warmup':
        return 'C';
      case 'drop':
        return 'D';
      case 'failure':
        return 'F';
      case 'cluster':
        return 'Cl';
      case 'rest-pause':
        return 'RP';
      case 'mechanical':
        return 'M';
      default:
        return 'N';
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        backgroundColor: isCompleted ? colors.success[50] : 'transparent',
        borderRadius: 6,
        gap: 8,
      }}
    >
      {/* Checkbox */}
      <Pressable
        onPress={handleCompleteSet}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isCompleted ? colors.success[500] : colors.border,
          backgroundColor: isCompleted ? colors.success[500] : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isCompleted && <Ionicons name="checkmark" size={14} color="white" />}
      </Pressable>

      {/* Set Number */}
      <View style={{ width: 32, alignItems: 'center' }}>
        <Typography variant="body2" weight="medium">
          {setIndex + 1}
        </Typography>
      </View>

      {/* Set Type */}
      <Pressable
        onPress={() => onShowSetTypeSheet(exerciseId, set.id, set.type)}
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          backgroundColor: colors.primary[100],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" weight="semibold" color="primary">
          {getSetTypeDisplayText()}
        </Typography>
      </Pressable>

      {/* Weight Input */}
      <View style={{ flex: 1, minWidth: 60 }}>
        <TextInput
          value={localWeight}
          onChangeText={handleWeightChange}
          placeholder="Peso"
          keyboardType="numeric"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 6,
            fontSize: 14,
            color: colors.text,
            textAlign: 'center',
          }}
        />
      </View>

      {/* Reps Input */}
      <View style={{ flex: 1, minWidth: 60 }}>
        <TextInput
          value={localReps}
          onChangeText={handleRepsChange}
          placeholder={getRepsDisplayText()}
          keyboardType="numeric"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 6,
            fontSize: 14,
            color: colors.text,
            textAlign: 'center',
          }}
        />
      </View>

      {/* Reps Type */}
      <Pressable
        onPress={() => onShowRepsTypeSheet(exerciseId, set.id, set.repsType)}
        style={{
          paddingHorizontal: 8,
          paddingVertical: 4,
          backgroundColor: colors.gray[100],
          borderRadius: 4,
          minWidth: 40,
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" weight="medium">
          {getRepsDisplayText()}
        </Typography>
      </Pressable>

      {/* RPE */}
      {set.rpe && (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            backgroundColor: colors.warning[100],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" weight="semibold">
            {set.rpe}
          </Typography>
        </View>
      )}

      {/* Previous data indicator */}
      {set.wasModifiedFromOriginal && (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.secondary[500],
          }}
        />
      )}
    </View>
  );
};
