import { Typography } from '@/components/ui';
import { IBlock, IExerciseInBlock } from '@/types/routine';
import { Timer } from 'lucide-react-native';
import { View } from 'react-native';
import { useBlockStyles } from '../../hooks/use-block-styles';
import { BlockLine } from '../block-line';
import React from 'react';

type Props = {
  exerciseInBlock: IExerciseInBlock;
  block: IBlock;
  exerciseIndex: number;
  children: React.ReactNode;
};

const ExerciseInBlockItemComponent: React.FC<Props> = ({
  exerciseInBlock,
  block,
  exerciseIndex,
  children,
}) => {
  const { getBlockColors, formatRestTime } = useBlockStyles();

  const blockColors = getBlockColors(block.type);

  return (
    <View key={exerciseInBlock.id} style={{ position: 'relative' }}>
      {/* Exercise Container */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          {/* Exercise Number with Connection to Line */}
          <BlockLine
            block={block}
            exerciseIndex={exerciseIndex}
            blockColors={blockColors}
          />

          {/* Exercise Details */}
          {children}
        </View>
      </View>

      {/* Rest Between Exercises (for circuits) */}
      {block.type === 'circuit' &&
        exerciseIndex < block.exercises.length - 1 &&
        block.restBetweenExercisesSeconds > 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
              marginHorizontal: 16,
              backgroundColor: blockColors.light,
              borderRadius: 8,
              marginBottom: 8,
              position: 'relative',
            }}
          >
            {/* Rest indicator on the line */}
            <View
              style={{
                position: 'absolute',
                left: 16,
                width: 3,
                height: '100%',
                backgroundColor: blockColors.primary,
              }}
            />
            <Timer size={14} color={blockColors.primary} />
            <Typography
              variant="caption"
              style={{ color: blockColors.primary, marginLeft: 4 }}
            >
              Descanso: {formatRestTime(block.restBetweenExercisesSeconds)}
            </Typography>
          </View>
        )}
    </View>
  );
};

export const ExerciseInBlockItem = React.memo(ExerciseInBlockItemComponent);
ExerciseInBlockItem.displayName = 'ExerciseInBlockItem';
