import { Button, Card, Typography } from '@/components/ui';
import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';

type Props = {
  setExerciseSelectorVisible: Dispatch<SetStateAction<boolean>>;
};

export const EmptyList: React.FC<Props> = ({ setExerciseSelectorVisible }) => {
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
          onPress={() => setExerciseSelectorVisible(true)}
          style={{ marginTop: 16 }}
        >
          Seleccionar Ejercicios
        </Button>
      </View>
    </Card>
  );
};
