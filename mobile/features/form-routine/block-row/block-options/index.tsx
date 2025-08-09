import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Split, Trash2 } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  onConvertToIndividual: () => void;
  onDeleteBlock: () => void;
};

export const BlockOptions: React.FC<Props> = ({
  onConvertToIndividual,
  onDeleteBlock,
}) => {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        position: 'absolute',
        top: 60,
        right: 16,
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 1000,
        minWidth: 180,
      }}
    >
      <TouchableOpacity
        onPress={onConvertToIndividual}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,
          gap: 8,
        }}
      >
        <Split size={16} color={colors.text} />
        <Typography variant="body2">Separar ejercicios</Typography>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onDeleteBlock}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,
          gap: 8,
        }}
      >
        <Trash2 size={16} color={colors.error[500]} />
        <Typography variant="body2" style={{ color: colors.error[500] }}>
          Eliminar bloque
        </Typography>
      </TouchableOpacity>
    </View>
  );
};
