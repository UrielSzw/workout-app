import { Typography } from '@/components/ui';
import { ExercisePlaceholderImage } from '@/components/ui/ExercisePlaceholderImage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IBlock, IExerciseInBlock } from '@/types/routine';
import { GripVertical, MoreVerticalIcon } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  block: IBlock;
  exerciseInBlock: IExerciseInBlock;
  onLongPressReorderExercises?: (block: IBlock) => void;
};

export const ExerciseHeader: React.FC<Props> = ({
  block,
  exerciseInBlock,
  onLongPressReorderExercises,
}) => {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 8,
      }}
    >
      <ExercisePlaceholderImage size={40} />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Typography variant="body1" weight="semibold">
            {exerciseInBlock.exercise.name}
          </Typography>
          {/* Drag indicator for multi-exercise blocks */}
          {block.exercises.length > 1 && onLongPressReorderExercises && (
            <GripVertical
              size={12}
              color={colors.textMuted}
              style={{ opacity: 0.5 }}
            />
          )}
        </View>
        <Typography variant="caption" color="textMuted">
          {exerciseInBlock.exercise.muscleGroups.join(', ')}
        </Typography>
      </View>

      <TouchableOpacity style={{ padding: 8 }}>
        <MoreVerticalIcon size={26} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};
