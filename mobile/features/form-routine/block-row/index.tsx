import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui';
import { IBlock, ISetType } from '@/types/routine';
import { useBlockRow } from './hook';
import { BlockHeader } from './block-header';
import { BlockOptions } from './block-options';
import { BlockExercise } from './block-exercise';

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
  globalRepsType: 'reps' | 'range' | 'time' | 'distance';
  onChangeGlobalRepsType: () => void;
  onLongPressReorder?: () => void;
  onLongPressReorderExercises?: (block: IBlock) => void;
};

export const BlockRow: React.FC<Props> = ({
  block,
  index,
  onDeleteBlock,
  onConvertToIndividual,
  onUpdateBlock,
  onShowSetTypeBottomSheet,
  onShowRestTimeBottomSheet,
  globalRepsType,
  onChangeGlobalRepsType,
  onLongPressReorder,
  onLongPressReorderExercises,
}) => {
  const {
    isExpanded,
    showMenu,
    blockColors,
    getBlockTypeIcon,
    getBlockTypeLabel,
    getSetTypeLabel,
    getSetTypeColor,
    formatRestTime,
    handleLongPress,
    addSetToExercise,
    getRepsColumnTitle,
    handleConvertToIndividual,
    handleDeleteBlock,
    handleLongPressExercise,
    updateSet,
    setIsExpanded,
    setShowMenu,
  } = useBlockRow({
    block,
    globalRepsType,
    onUpdateBlock,
    onDeleteBlock,
    onLongPressReorderExercises,
    onConvertToIndividual,
    onLongPressReorder,
  });

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      delayLongPress={500}
      activeOpacity={1}
    >
      <Card variant="outlined" padding="none">
        {/* Block Header with Continuous Line */}
        <BlockHeader
          block={block}
          blockColors={blockColors}
          formatRestTime={formatRestTime}
          getBlockTypeIcon={getBlockTypeIcon}
          getBlockTypeLabel={getBlockTypeLabel}
          index={index}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onShowRestTimeBottomSheet={onShowRestTimeBottomSheet}
        />

        {/* Menu Options - Only for multi-exercise blocks */}
        {showMenu && block.exercises.length > 1 && (
          <BlockOptions
            onConvertToIndividual={handleConvertToIndividual}
            onDeleteBlock={handleDeleteBlock}
          />
        )}

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
                blockColors={blockColors}
                onAddSetToExercise={addSetToExercise}
                formatRestTime={formatRestTime}
                getSetTypeLabel={getSetTypeLabel}
                getSetTypeColor={getSetTypeColor}
                getRepsColumnTitle={getRepsColumnTitle}
                onShowSetTypeBottomSheet={onShowSetTypeBottomSheet}
                block={block}
                onChangeGlobalRepsType={onChangeGlobalRepsType}
                onUpdateSet={updateSet}
                onLongPressExercise={handleLongPressExercise}
                onLongPressReorderExercises={onLongPressReorderExercises}
              />
            ))}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};
