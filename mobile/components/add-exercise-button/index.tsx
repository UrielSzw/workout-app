import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Plus } from 'lucide-react-native';
import { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  setExerciseSelectorVisible: Dispatch<SetStateAction<boolean>>;
};

export const AddExerciseButton: React.FC<Props> = ({
  setExerciseSelectorVisible,
}) => {
  const { colors } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() => setExerciseSelectorVisible(true)}
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
