import { Button, Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { View } from 'react-native';
import {
  useEditValuesActions,
  useEditValuesState,
} from '../../hooks/use-form-routine-store';
import { mainStore, useAddRoutines } from '@/store/main-store';
import { IBlock, IRoutine } from '@/types/routine';

type Props = {
  isEditMode: boolean;
  blocks: IBlock[];
};

export const CreateRoutineHeader: React.FC<Props> = ({
  isEditMode,
  blocks,
}) => {
  const { colors } = useColorScheme();
  const { createRoutine, clearRoutine } = useEditValuesActions();
  const { routineName } = useEditValuesState();
  const addRoutine = useAddRoutines();
  const { selectedRoutine, updateRoutine } = mainStore((state) => state);

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = () => {
    if (isEditMode && selectedRoutine && routineName) {
      const updatedRoutine: IRoutine = {
        ...selectedRoutine,
        blocks,
        name: routineName,
      };

      updateRoutine(selectedRoutine.id, updatedRoutine);
    } else {
      const newRoutine = createRoutine();
      addRoutine(newRoutine);
    }

    clearRoutine();
    handleGoBack();
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        zIndex: 1,
      }}
    >
      <Button variant="ghost" size="sm" onPress={handleGoBack}>
        ← Atrás
      </Button>

      <Typography variant="h6" weight="semibold">
        {isEditMode ? 'Editar Rutina' : 'Crear Rutina'}
      </Typography>

      <Button variant="primary" size="sm" onPress={handleSave}>
        Guardar
      </Button>
    </View>
  );
};
