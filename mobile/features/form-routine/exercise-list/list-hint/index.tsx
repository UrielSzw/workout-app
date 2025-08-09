import { Typography } from '@/components/ui';
import { getThemeColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { View } from 'react-native';

export const ListHint: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  return (
    <View
      style={{
        backgroundColor: colors.primary[500] + '10',
        borderLeftWidth: 3,
        borderLeftColor: colors.primary[500],
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
      }}
    >
      <Typography
        variant="caption"
        style={{
          color: colors.primary[500],
          fontWeight: '500',
        }}
      >
        💡 Consejo: Mantén presionado cualquier bloque para reordenar los
        ejercicios
      </Typography>
    </View>
  );
};
