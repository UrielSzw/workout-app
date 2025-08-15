import { Button, Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { View } from 'react-native';

type Props = {
  onSaveRoutine: () => void;
  isEditMode: boolean;
};

export const CreateRoutineHeader: React.FC<Props> = ({
  onSaveRoutine,
  isEditMode,
}) => {
  const { colors } = useColorScheme();

  const handleGoBack = () => {
    router.back();
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

      <Button variant="primary" size="sm" onPress={onSaveRoutine}>
        Guardar
      </Button>
    </View>
  );
};
