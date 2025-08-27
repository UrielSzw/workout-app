import React from 'react';
import { View } from 'react-native';
import { IActiveBlock } from '@/types/active-workout';
import { useBlockStyles } from '../../../../hooks/use-block-styles';
import { BlockHeader } from './active-block-header';
import { ActiveExerciseItem } from '../active-exercise-item';
import { ActiveExerciseDetails } from '../active-exercise-item/active-exercise-details';
import { IActiveToggleSheet } from '../../hooks/use-active-workout-sheets';

type Props = {
  block: IActiveBlock;
  index: number;
  onToggleSheet: (sheet?: IActiveToggleSheet) => void;
};

export const ActiveBlockItem: React.FC<Props> = ({
  block,
  index,
  onToggleSheet,
}) => {
  const { getBlockColors } = useBlockStyles();

  const blockColors = getBlockColors(block.type);

  return (
    <View>
      <View style={{ borderLeftWidth: 4, borderLeftColor: blockColors.light }}>
        <BlockHeader
          block={block}
          blockColors={blockColors}
          index={index}
          onToggleSheet={onToggleSheet}
        />

        <View>
          {block.exercises.map((exerciseInBlock, exerciseIndex) => (
            <ActiveExerciseItem
              block={block}
              exerciseInBlock={exerciseInBlock}
              exerciseIndex={exerciseIndex}
              blockColors={blockColors}
              key={exerciseInBlock.id}
            >
              <ActiveExerciseDetails
                exerciseInBlock={exerciseInBlock}
                blockColors={blockColors}
                onToggleSheet={onToggleSheet}
                block={block}
              />
            </ActiveExerciseItem>
          ))}
        </View>
      </View>
    </View>
  );
};
