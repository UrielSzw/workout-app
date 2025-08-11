import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useBlockRow } from './hook';
import { BlockHeader } from './block-header';
import { BlockExercise } from './block-exercise';
import { IActiveBlock } from '@/types/active-workout';

type Props = {
  block: IActiveBlock;
  index: number;
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
};

export const ActiveBlockRow: React.FC<Props> = ({
  block,
  index,
  onCompleteSet,
  onUncompleteSet,
}) => {
  const {
    blockColors,
    getBlockTypeIcon,
    getBlockTypeLabel,
    getSetTypeLabel,
    getSetTypeColor,
    formatRestTime,
    getRepsColumnTitle,
  } = useBlockRow({
    block,
  });

  return (
    <TouchableOpacity
      onLongPress={() => {}}
      delayLongPress={500}
      activeOpacity={1}
    >
      <View style={{ borderLeftWidth: 4, borderLeftColor: blockColors.light }}>
        {/* Block Header with Continuous Line */}
        <BlockHeader
          block={block}
          blockColors={blockColors}
          formatRestTime={formatRestTime}
          getBlockTypeIcon={getBlockTypeIcon}
          getBlockTypeLabel={getBlockTypeLabel}
          index={index}
        />

        {/* Exercises List with Continuous Visual Line */}
        <View>
          {block.exercises.map((exerciseInBlock, exerciseIndex) => (
            <BlockExercise
              key={exerciseInBlock.id}
              exerciseInBlock={exerciseInBlock}
              exerciseIndex={exerciseIndex}
              blockColors={blockColors}
              formatRestTime={formatRestTime}
              getSetTypeLabel={getSetTypeLabel}
              getSetTypeColor={getSetTypeColor}
              getRepsColumnTitle={getRepsColumnTitle}
              block={block}
              onCompleteSet={onCompleteSet}
              onUncompleteSet={onUncompleteSet}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};
