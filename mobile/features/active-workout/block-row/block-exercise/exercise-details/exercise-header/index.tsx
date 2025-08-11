import { Typography } from '@/components/ui';
import { ExercisePlaceholderImage } from '@/components/ui/ExercisePlaceholderImage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IExerciseInBlock } from '@/types/routine';
import { MoreVerticalIcon } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  exerciseInBlock: IExerciseInBlock;
};

export const ExerciseHeader: React.FC<Props> = ({ exerciseInBlock }) => {
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
