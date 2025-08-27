import React from 'react';
import { View, TouchableOpacity, Vibration } from 'react-native';
import { Card } from '@/components/ui';
import { IBlock } from '@/types/routine';
import { router } from 'expo-router';
import { IToogleSheet } from '../../hooks/use-form-routine-sheets';
import { BlockHeader } from './block-header';
import { ExerciseInBlockItem } from '../exercise-in-block-item';
import { ExerciseItem } from '../exercise-item';
import { useEditValuesActions } from '../../hooks/use-form-routine-store';
import { useBlockStyles } from '@/hooks/use-block-styles';

type Props = {
  block: IBlock;
  onToggleSheet: (sheet?: IToogleSheet) => void;
};

export const BlockItem: React.FC<Props> = ({ block, onToggleSheet }) => {
  const { getBlockColors } = useBlockStyles();
  const { setEditValues } = useEditValuesActions();

  const blockColors = getBlockColors(block.type);

  const handleLongPress = () => {
    Vibration.vibrate(50);
    router.push('/reorder-blocks');
  };

  const handlePress = () => {
    setEditValues({
      blockId: block.id,
      isMultiBlock: block.type !== 'individual',
    });
    onToggleSheet('blockOptions');
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      delayLongPress={500}
      activeOpacity={1}
      onPress={handlePress}
    >
      <Card variant="outlined" padding="none">
        {/* Block Header with Continuous Line */}
        <BlockHeader block={block} onToggleSheet={onToggleSheet} />

        {/* Exercises List with Continuous Visual Line */}
        <View style={{ position: 'relative' }}>
          {block.exercises.length > 1 && (
            <View
              style={{
                position: 'absolute',
                left: 32,
                top: 0,
                bottom: 0,
                width: 3,
                backgroundColor: blockColors.primary,
                borderRadius: 1.5,
                zIndex: 1,
              }}
            />
          )}

          {block.exercises.map((exerciseInBlock, exerciseIndex) => (
            <ExerciseInBlockItem
              key={exerciseInBlock.id}
              exerciseInBlock={exerciseInBlock}
              exerciseIndex={exerciseIndex}
              block={block}
            >
              <ExerciseItem
                block={block}
                exerciseInBlock={exerciseInBlock}
                onToggleSheet={onToggleSheet}
                blockColors={blockColors}
              />
            </ExerciseInBlockItem>
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );
};
