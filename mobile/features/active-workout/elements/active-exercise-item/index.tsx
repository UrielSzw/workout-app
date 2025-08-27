import { Typography } from '@/components/ui';
import { Timer } from 'lucide-react-native';
import { View } from 'react-native';
import { IActiveBlock, IActiveExerciseInBlock } from '@/types/active-workout';
import { useBlockStyles } from '../../../../hooks/use-block-styles';

type Props = {
  exerciseInBlock: IActiveExerciseInBlock;
  block: IActiveBlock;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  exerciseIndex: number;
  children: React.ReactNode;
};

export const ActiveExerciseItem: React.FC<Props> = ({
  exerciseInBlock,
  block,
  blockColors,
  exerciseIndex,
  children,
}) => {
  const { formatRestTime } = useBlockStyles();

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
