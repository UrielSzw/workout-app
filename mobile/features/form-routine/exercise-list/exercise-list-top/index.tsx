import { Button, Typography } from '@/components/ui';
import { IBlock } from '@/types/routine';
import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';

type Props = {
  blocks: IBlock[];
  setExerciseSelectorVisible: Dispatch<SetStateAction<boolean>>;
};

export const ExerciseListTop: React.FC<Props> = ({
  blocks,
  setExerciseSelectorVisible,
}) => {
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

      <Button
        variant="outline"
        size="sm"
        onPress={() => setExerciseSelectorVisible(true)}
      >
        + Agregar Ejercicio
      </Button>
    </View>
  );
};
