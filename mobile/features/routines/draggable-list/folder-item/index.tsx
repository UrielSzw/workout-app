import { Card, Typography } from '@/components/ui';
import { getThemeColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { IFolder } from '@/types/routine';
import { TouchableOpacity, Vibration, View } from 'react-native';

type Props = {
  folder: IFolder;
  drag: () => void;
  isActive: boolean;
  onSelect: () => void;
  routinesCount: number;
};

export const FolderItem: React.FC<Props> = ({
  folder,
  drag,
  isActive,
  onSelect,
  routinesCount,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  return (
    <TouchableOpacity
      onLongPress={() => {
        Vibration.vibrate(50); // Haptic feedback
        drag();
      }}
      onPress={onSelect}
      delayLongPress={300}
      activeOpacity={0.9}
    >
      <Card
        variant="outlined"
        padding="md"
        pressable
        style={{
          marginBottom: 12,
          backgroundColor: isActive ? colors.primary[100] : colors.surface,
          borderColor: isActive ? colors.primary[300] : colors.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: folder.color + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Typography variant="h6">{folder.icon}</Typography>
          </View>

          <View style={{ flex: 1 }}>
            <Typography
              variant="h6"
              weight="semibold"
              style={{ marginBottom: 2 }}
            >
              {folder.name}
            </Typography>
            <Typography variant="body2" color="textMuted">
              {routinesCount === 1 ? '1 rutina' : `${routinesCount} rutinas`}
            </Typography>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
