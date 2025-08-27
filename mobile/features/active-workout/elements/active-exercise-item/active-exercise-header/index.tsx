import { Typography } from '@/components/ui';
import { ExercisePlaceholderImage } from '@/components/ui/ExercisePlaceholderImage';
import { IExerciseInBlock } from '@/types/routine';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  exerciseInBlock: IExerciseInBlock;
  onPress: () => void;
};

export const ActiveExerciseHeader: React.FC<Props> = ({
  exerciseInBlock,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
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
        </View>
        <Typography variant="caption" color="textMuted">
          {exerciseInBlock.exercise.muscleGroups.join(', ')}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};
