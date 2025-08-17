import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useBlockRow } from './hook';
import { BlockHeader } from './block-header';
import { BlockExercise } from './block-exercise';
import { IActiveBlock } from '@/types/active-workout';
import { ISetType } from '@/types/routine';

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
  onShowBlockRestTimeBottomSheet: (
    blockId: string,
    currentRestTime: number,
    type: 'between-rounds' | 'between-exercises',
  ) => void;
  onAddSetToExercise: (exerciseId: string) => void;
  onShowSetType: (exerciseId: string, setId: string, current: ISetType) => void;
  onShowBlockOptionsBottomSheet: (
    blockId: string,
    exercisesLength: number,
  ) => void;
  onShowExerciseOptionsBottomSheet: (
    blockId: string,
    exerciseId: string,
    isInMultiExerciseBlock: boolean,
  ) => void;
};

export const ActiveBlockRow: React.FC<Props> = ({
  block,
  index,
  onCompleteSet,
  onUncompleteSet,
  onShowBlockRestTimeBottomSheet,
  onAddSetToExercise,
  onShowSetType,
  onShowBlockOptionsBottomSheet,
  onShowExerciseOptionsBottomSheet,
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

  const handlePress = () => {
    onShowBlockOptionsBottomSheet(block.id, block.exercises.length);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
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
          onShowBlockRestTimeBottomSheet={onShowBlockRestTimeBottomSheet}
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
              onAddSetToExercise={onAddSetToExercise}
              onShowSetType={onShowSetType}
              onShowExerciseOptionsBottomSheet={
                onShowExerciseOptionsBottomSheet
              }
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};
