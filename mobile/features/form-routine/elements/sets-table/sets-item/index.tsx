import { IRepsType, ISet } from '@/types/routine';
import React, { useCallback } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IToogleSheet } from '@/features/form-routine/hooks/use-form-routine-sheets';
import {
  useEditValuesActions,
  useSetActions,
} from '@/features/form-routine/hooks/use-form-routine-store';
import { useBlockStyles } from '@/hooks/use-block-styles';

type Props = {
  set: ISet;
  setIndex: number;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  onToggleSheet: (sheet?: IToogleSheet) => void;
  exerciseInBlockId: string;
  repsType: IRepsType;
};

export const SetsItem = React.memo<Props>(
  ({
    set,
    setIndex,
    blockColors,
    onToggleSheet,
    exerciseInBlockId,
    repsType,
  }) => {
    const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();
    const { colors } = useColorScheme();
    const { setEditValues } = useEditValuesActions();
    const { updateSet } = useSetActions();

    const handleSetType = useCallback(() => {
      onToggleSheet('setType');
      setEditValues({
        setId: set.id,
        exerciseInBlockId,
        currentSetType: set.type,
      });
    }, [set.id, set.type, exerciseInBlockId, onToggleSheet, setEditValues]);

    const handleWeightChange = useCallback(
      (value: string) => {
        updateSet(exerciseInBlockId, set.id, setIndex, { weight: value });
      },
      [exerciseInBlockId, set.id, setIndex, updateSet],
    );

    const handleRepsChange = useCallback(
      (value: string) => {
        updateSet(exerciseInBlockId, set.id, setIndex, { reps: value });
      },
      [exerciseInBlockId, set.id, setIndex, updateSet],
    );

    const handleRepsMinChange = useCallback(
      (value: string) => {
        updateSet(exerciseInBlockId, set.id, setIndex, {
          repsRange: {
            min: value,
            max: set.repsRange?.max || '',
          },
        });
      },
      [exerciseInBlockId, set.id, setIndex, set.repsRange?.max, updateSet],
    );

    const handleRepsMaxChange = useCallback(
      (value: string) => {
        updateSet(exerciseInBlockId, set.id, setIndex, {
          repsRange: {
            min: set.repsRange?.min || '',
            max: value,
          },
        });
      },
      [exerciseInBlockId, set.id, setIndex, set.repsRange?.min, updateSet],
    );

    return (
      <View
        key={set.id}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 6,
          backgroundColor: set.completed ? blockColors.light : 'transparent',
          borderRadius: 4,
          marginBottom: 4,
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
                set.type !== 'normal'
                  ? getSetTypeColor(set.type)
                  : colors.border,
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

        {/* Weight Input */}
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <TextInput
            value={set.weight}
            onChangeText={handleWeightChange}
            placeholder="0"
            keyboardType="numeric"
            style={{
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 6,
              textAlign: 'center',
              color: colors.text,
              fontSize: 14,
            }}
          />
        </View>

        {/* Reps Input */}
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          {repsType === 'range' ? (
            // Rango: Dos inputs lado a lado
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <TextInput
                value={set.repsRange?.min || ''}
                onChangeText={handleRepsMinChange}
                placeholder="0"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  textAlign: 'center',
                  color: colors.text,
                  fontSize: 12,
                }}
              />
              <Typography
                variant="caption"
                color="textMuted"
                style={{ fontSize: 10 }}
              >
                -
              </Typography>
              <TextInput
                value={set.repsRange?.max || ''}
                onChangeText={handleRepsMaxChange}
                placeholder="0"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  textAlign: 'center',
                  color: colors.text,
                  fontSize: 12,
                }}
              />
            </View>
          ) : (
            // Input normal para reps, time, distance
            <TextInput
              value={set.reps}
              onChangeText={handleRepsChange}
              placeholder="0"
              keyboardType="numeric"
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 6,
                textAlign: 'center',
                color: colors.text,
                fontSize: 14,
              }}
            />
          )}
        </View>
      </View>
    );
  },
);

SetsItem.displayName = 'SetsItem';
