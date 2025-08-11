import { Typography } from '@/components/ui';
import { IRepsType, ISetType } from '@/types/routine';
import { Timer } from 'lucide-react-native';
import { View } from 'react-native';
import { ExerciseDetails } from './exercise-details';
import { IActiveBlock, IActiveExerciseInBlock } from '@/types/active-workout';

type Props = {
  exerciseInBlock: IActiveExerciseInBlock;
  block: IActiveBlock;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  exerciseIndex: number;
  getRepsColumnTitle: (repsType: IRepsType) => string;
  getSetTypeColor: (type: string) => string;
  getSetTypeLabel: (type: string) => string;
  formatRestTime: (seconds: number) => string;
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

export const BlockExercise: React.FC<Props> = ({
  exerciseInBlock,
  block,
  blockColors,
  exerciseIndex,
  getRepsColumnTitle,
  getSetTypeColor,
  getSetTypeLabel,
  formatRestTime,
  onCompleteSet,
  onUncompleteSet,
}) => {
  return (
    <View key={exerciseInBlock.id} style={{ position: 'relative' }}>
      {/* Exercise Container */}
      <View style={{ paddingVertical: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          {/* Exercise Details */}
          <ExerciseDetails
            exerciseInBlock={exerciseInBlock}
            blockColors={blockColors}
            getRepsColumnTitle={getRepsColumnTitle}
            getSetTypeColor={getSetTypeColor}
            getSetTypeLabel={getSetTypeLabel}
            onCompleteSet={onCompleteSet}
            onUncompleteSet={onUncompleteSet}
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
