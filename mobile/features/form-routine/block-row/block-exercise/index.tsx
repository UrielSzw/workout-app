import { Typography } from '@/components/ui';
import { IBlock, IExerciseInBlock, IRepsType, ISetType } from '@/types/routine';
import { Timer } from 'lucide-react-native';
import { View } from 'react-native';
import { BlockLine } from './block-line';
import { ExerciseDetails } from './exercise-details';

type Props = {
  exerciseInBlock: IExerciseInBlock;
  block: IBlock;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  exerciseIndex: number;
  onShowSetTypeBottomSheet: (
    setId: string,
    exerciseId: string,
    current: ISetType,
  ) => void;
  onUpdateSet: (
    exerciseId: string,
    setId: string,
    setIndex: number,
    updatedData: Partial<IExerciseInBlock['sets'][0]>,
  ) => void;
  onLongPressExercise?: () => void;
  onLongPressReorderExercises?: (block: IBlock) => void;
  getRepsColumnTitle: (repsType: IRepsType) => string;
  getSetTypeColor: (type: string) => string;
  getSetTypeLabel: (type: string) => string;
  onAddSetToExercise: (exerciseId: string) => void;
  formatRestTime: (seconds: number) => string;
  onShowRepsTypeBottomSheet: (exerciseId: string, current: IRepsType) => void;
  onShowExerciseOptionsBottomSheet: (
    blockId: string,
    exerciseId: string,
    isInMultiExerciseBlock: boolean,
  ) => void;
};

export const BlockExercise: React.FC<Props> = ({
  exerciseInBlock,
  block,
  blockColors,
  exerciseIndex,
  onShowSetTypeBottomSheet,
  onUpdateSet,
  onLongPressExercise,
  onLongPressReorderExercises,
  getRepsColumnTitle,
  getSetTypeColor,
  getSetTypeLabel,
  onAddSetToExercise,
  formatRestTime,
  onShowRepsTypeBottomSheet,
  onShowExerciseOptionsBottomSheet,
}) => {
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
          <ExerciseDetails
            block={block}
            exerciseInBlock={exerciseInBlock}
            blockColors={blockColors}
            onShowSetTypeBottomSheet={onShowSetTypeBottomSheet}
            onUpdateSet={onUpdateSet}
            onLongPressExercise={onLongPressExercise}
            onLongPressReorderExercises={onLongPressReorderExercises}
            getRepsColumnTitle={getRepsColumnTitle}
            getSetTypeColor={getSetTypeColor}
            getSetTypeLabel={getSetTypeLabel}
            onAddSetToExercise={onAddSetToExercise}
            onShowRepsTypeBottomSheet={onShowRepsTypeBottomSheet}
            onShowExerciseOptionsBottomSheet={onShowExerciseOptionsBottomSheet}
          />
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
