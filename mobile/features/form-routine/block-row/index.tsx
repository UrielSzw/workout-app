import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui';
import { IBlock, IRepsType, ISetType } from '@/types/routine';
import { useBlockRow } from './hook';
import { BlockHeader } from './block-header';
import { BlockExercise } from './block-exercise';
import { useBlockStyles } from './utils';

type Props = {
  block: IBlock;
  index: number;
  onDeleteBlock: (blockId: string) => void;
  onConvertToIndividual: (blockId: string) => void;
  onUpdateBlock: (blockId: string, updatedData: Partial<IBlock>) => void;
  onShowSetTypeBottomSheet: (
    setId: string,
    exerciseId: string,
    current: ISetType,
  ) => void;
  onShowRestTimeBottomSheet: (
    blockId: string,
    currentRestTime: number,
    type: 'between-rounds' | 'between-exercises',
  ) => void;
  onLongPressReorder?: () => void;
  onLongPressReorderExercises?: (block: IBlock) => void;
  onShowRepsTypeBottomSheet: (exerciseId: string, current: IRepsType) => void;
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

export const BlockRow: React.FC<Props> = ({
  block,
  index,
  onDeleteBlock,
  onConvertToIndividual,
  onUpdateBlock,
  onShowSetTypeBottomSheet,
  onShowRestTimeBottomSheet,
  onLongPressReorder,
  onLongPressReorderExercises,
  onShowRepsTypeBottomSheet,
  onShowBlockOptionsBottomSheet,
  onShowExerciseOptionsBottomSheet,
}) => {
  const {
    isExpanded,
    showMenu,
    handleLongPress,
    addSetToExercise,
    handleLongPressExercise,
    updateSet,
    setIsExpanded,
    setShowMenu,
  } = useBlockRow({
    block,
    onUpdateBlock,
    onDeleteBlock,
    onLongPressReorderExercises,
    onConvertToIndividual,
    onLongPressReorder,
  });

  const { getBlockColors } = useBlockStyles();

  const blockColors = getBlockColors(block.type);

  const handlePress = () => {
    onShowBlockOptionsBottomSheet(block.id, block.exercises.length);
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
        <BlockHeader
          block={block}
          index={index}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onShowRestTimeBottomSheet={onShowRestTimeBottomSheet}
        />

        {/* Menu Options - Only for multi-exercise blocks */}
        {/* {showMenu && block.exercises.length > 1 && (
          <BlockOptions
            onConvertToIndividual={handleConvertToIndividual}
            onDeleteBlock={handleDeleteBlock}
          />
        )} */}

        {/* Exercises List with Continuous Visual Line */}
        {isExpanded && (
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
              <BlockExercise
                key={exerciseInBlock.id}
                exerciseInBlock={exerciseInBlock}
                exerciseIndex={exerciseIndex}
                onAddSetToExercise={addSetToExercise}
                onShowSetTypeBottomSheet={onShowSetTypeBottomSheet}
                block={block}
                onUpdateSet={updateSet}
                onLongPressExercise={handleLongPressExercise}
                onLongPressReorderExercises={onLongPressReorderExercises}
                onShowRepsTypeBottomSheet={onShowRepsTypeBottomSheet}
                onShowExerciseOptionsBottomSheet={
                  onShowExerciseOptionsBottomSheet
                }
              />
            ))}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};
