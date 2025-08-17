import { Button, Card, Typography } from '@/components/ui';
import { ExercisePlaceholderImage } from '@/components/ui/ExercisePlaceholderImage';
import { IExercise } from '@/types/routine';
import { Info, Plus } from 'lucide-react-native';
import { memo } from 'react';
import { View } from 'react-native';

type Props = {
  exercise: IExercise;
  isSelected: boolean;
  onSelectExercise: (exercise: IExercise) => void;
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    border: string;
    text: string;
    primary: { [key: string]: string };
    gray: { [key: string]: string };
  };
};

export const ExerciseCard: React.FC<Props> = memo(
  ({ exercise, isSelected, onSelectExercise, colors }) => (
    <Card
      key={exercise.id}
      variant="outlined"
      padding="md"
      style={{ opacity: isSelected ? 0.6 : 1, marginTop: 16 }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        {/* Exercise Image */}
        <ExercisePlaceholderImage size={56} />

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Typography variant="h6" weight="semibold" style={{ flex: 1 }}>
              {exercise.name}
            </Typography>
          </View>

          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginBottom: 8 }}
          >
            {exercise.equipment} •{' '}
            {exercise.muscleGroups.slice(0, 2).join(', ')}
          </Typography>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Button
              variant={isSelected ? 'secondary' : 'primary'}
              size="sm"
              onPress={() => onSelectExercise(exercise)}
              icon={
                isSelected ? (
                  <Typography variant="body2" weight="medium">
                    ✓
                  </Typography>
                ) : (
                  <Plus size={16} color="#ffffff" />
                )
              }
            >
              {isSelected ? 'Agregado' : 'Agregar'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              icon={<Info size={16} color={colors.primary[500]} />}
            >
              Info
            </Button>
          </View>
        </View>
      </View>
    </Card>
  ),
);

ExerciseCard.displayName = 'ExerciseCard';
