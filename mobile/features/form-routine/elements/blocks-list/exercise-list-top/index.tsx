import { Button, Typography } from '@/components/ui';
import {
  useBlocksState,
  useEditValuesActions,
} from '@/features/form-routine/hooks/use-form-routine-store';
import { View } from 'react-native';

export const ExerciseListTop = () => {
  const blocks = useBlocksState();
  const { setExerciseModal } = useEditValuesActions();

  const handleOpenModal = () => {
    setExerciseModal(true, false);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}
    >
      <Typography variant="h6" weight="semibold">
        Ejercicios (
        {blocks.reduce((total, block) => total + block.exercises.length, 0)})
      </Typography>

      <Button variant="outline" size="sm" onPress={handleOpenModal}>
        + Agregar Ejercicio
      </Button>
    </View>
  );
};
