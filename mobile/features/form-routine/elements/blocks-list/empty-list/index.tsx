import { Button, Card, Typography } from '@/components/ui';
import { useEditValuesActions } from '@/features/form-routine/hooks/use-form-routine-store';
import { View } from 'react-native';

export const EmptyList = () => {
  const { setExerciseModal } = useEditValuesActions();

  const handleOpenModal = () => {
    setExerciseModal(true, false);
  };

  return (
    <Card variant="outlined" padding="lg">
      <View style={{ alignItems: 'center', padding: 32 }}>
        <Typography
          variant="body2"
          color="textMuted"
          style={{ textAlign: 'center' }}
        >
          Comienza agregando ejercicios a tu rutina
        </Typography>
        <Button
          variant="primary"
          size="sm"
          onPress={handleOpenModal}
          style={{ marginTop: 16 }}
        >
          Seleccionar Ejercicios
        </Button>
      </View>
    </Card>
  );
};
