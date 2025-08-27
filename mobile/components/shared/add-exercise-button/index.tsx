import { Typography } from '@/components/ui';
import { useEditValuesActions } from '@/features/form-routine/hooks/use-form-routine-store';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Plus } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export const AddExerciseButton = () => {
  const { colors } = useColorScheme();
  const { setExerciseModal } = useEditValuesActions();

  const handleOpenModal = () => {
    setExerciseModal(true, 'add-new');
  };

  return (
    <TouchableOpacity
      onPress={handleOpenModal}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: 16,
        borderWidth: 2,
        borderColor: colors.primary[500],
        borderStyle: 'dashed',
        borderRadius: 8,
        backgroundColor: colors.primary[500] + '10',
      }}
    >
      <Plus size={20} color={colors.primary[500]} />
      <Typography
        variant="body1"
        weight="medium"
        style={{ color: colors.primary[500], marginLeft: 8 }}
      >
        Agregar Ejercicio
      </Typography>
    </TouchableOpacity>
  );
};
