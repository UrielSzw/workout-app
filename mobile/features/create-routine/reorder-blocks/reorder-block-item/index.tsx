import { Typography } from '@/components/ui';
import { getThemeColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { IBlock, IBlockType } from '@/types/routine';
import { GripVertical } from 'lucide-react-native';
import { TouchableOpacity, Vibration, View } from 'react-native';

type Props = {
  blockData: IBlock;
  index: number;
  drag: () => void;
  isActive: boolean;
};

export const ReorderBlockItem: React.FC<Props> = ({
  blockData,
  index,
  drag,
  isActive,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  const getBlockTypeLabel = (type: IBlockType) => {
    switch (type) {
      case 'superset':
        return 'Superserie';
      case 'circuit':
        return 'Circuito';
      default:
        return 'Individual';
    }
  };

  const getBlockTypeColor = (type: IBlockType) => {
    switch (type) {
      case 'superset':
        return colors.warning[500];
      case 'circuit':
        return colors.primary[500];
      default:
        return colors.textMuted;
    }
  };

  const exerciseNames = blockData.exercises
    .map((ex) => ex.exercise.name)
    .join(', ');

  const totalSets = blockData.exercises.reduce(
    (total, ex) => total + ex.sets.length,
    0,
  );

  return (
    <TouchableOpacity
      onLongPress={() => {
        Vibration.vibrate(50); // Haptic feedback
        drag();
      }}
      delayLongPress={300}
      style={{
        backgroundColor: isActive ? colors.primary[100] : colors.surface,
        borderWidth: 1,
        borderColor: isActive ? colors.primary[300] : colors.border,
        borderRadius: 12,
        padding: 16,
        marginVertical: 4,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isActive ? 0.2 : 0.1,
        shadowRadius: 4,
        elevation: isActive ? 4 : 2,
      }}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Drag Handle */}
        <View style={{ marginRight: 12 }}>
          <GripVertical size={20} color={colors.textMuted} />
        </View>

        {/* Block Info */}
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Typography variant="body1" weight="semibold">
              Bloque {index + 1}
            </Typography>
            <View
              style={{
                backgroundColor: getBlockTypeColor(blockData.type) + '20',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <Typography
                variant="caption"
                weight="medium"
                style={{ color: getBlockTypeColor(blockData.type) }}
              >
                {getBlockTypeLabel(blockData.type)}
              </Typography>
            </View>
          </View>

          {/* Exercise Info */}
          <Typography
            variant="body2"
            color="textMuted"
            numberOfLines={2}
            style={{ marginBottom: 4 }}
          >
            {exerciseNames}
          </Typography>

          {/* Stats */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant="caption" color="textMuted">
              {blockData.exercises.length} ejercicio
              {blockData.exercises.length > 1 ? 's' : ''} • {totalSets} serie
              {totalSets > 1 ? 's' : ''}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
