import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IBlock } from '@/types/routine';
import { Timer } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  block: IBlock;
  getBlockTypeIcon: () => React.ReactNode;
  getBlockTypeLabel: () => string;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  formatRestTime: (seconds: number) => string;
  index: number;
  onShowBlockRestTimeBottomSheet: (
    blockId: string,
    currentRestTime: number,
    type: 'between-rounds' | 'between-exercises',
  ) => void;
};

export const BlockHeader: React.FC<Props> = ({
  block,
  getBlockTypeIcon,
  getBlockTypeLabel,
  blockColors,
  formatRestTime,
  index,
  onShowBlockRestTimeBottomSheet,
}) => {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: blockColors.light,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {/* First Row - Block Title and Main Controls */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        {/* Left - Block Title */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {getBlockTypeIcon()}
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: blockColors.primary }}
          >
            {block.name || `${getBlockTypeLabel()} ${index + 1}`}
          </Typography>
        </View>
      </View>

      {/* Second Row - Exercise Count and Rest Times */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left - Exercise Count */}
        <Typography variant="caption" color="textMuted">
          {block.exercises.length} ejercicio
          {block.exercises.length !== 1 ? 's' : ''}
        </Typography>

        {/* Right - Rest Time Buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {block.exercises.length > 1 ? (
            // Multi-exercise blocks: show 2 buttons
            <>
              {/* Rest Between Exercises */}
              <TouchableOpacity
                onPress={() =>
                  onShowBlockRestTimeBottomSheet(
                    block.id,
                    block.restBetweenExercisesSeconds,
                    'between-exercises',
                  )
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 3,
                  paddingHorizontal: 6,
                  backgroundColor: blockColors.primary + '10',
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: blockColors.border,
                }}
              >
                <Timer size={12} color={blockColors.primary} />
                <Typography
                  variant="caption"
                  weight="medium"
                  style={{
                    color: blockColors.primary,
                    marginLeft: 3,
                    fontSize: 10,
                  }}
                >
                  Entre: {formatRestTime(block.restBetweenExercisesSeconds)}
                </Typography>
              </TouchableOpacity>

              {/* Rest Between Rounds */}
              <TouchableOpacity
                onPress={() =>
                  onShowBlockRestTimeBottomSheet(
                    block.id,
                    block.restTimeSeconds,
                    'between-rounds',
                  )
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  backgroundColor: blockColors.primary + '15',
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: blockColors.border,
                }}
              >
                <Timer size={12} color={blockColors.primary} />
                <Typography
                  variant="caption"
                  weight="medium"
                  style={{
                    color: blockColors.primary,
                    marginLeft: 3,
                    fontSize: 10,
                  }}
                >
                  Vueltas: {formatRestTime(block.restTimeSeconds)}
                </Typography>
              </TouchableOpacity>
            </>
          ) : (
            // Individual exercises: show 1 button (between sets)
            <TouchableOpacity
              onPress={() =>
                onShowBlockRestTimeBottomSheet(
                  block.id,
                  block.restTimeSeconds,
                  'between-rounds',
                )
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 4,
                paddingHorizontal: 6,
                backgroundColor: blockColors.primary + '15',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: blockColors.border,
              }}
            >
              <Timer size={12} color={blockColors.primary} />
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  color: blockColors.primary,
                  marginLeft: 3,
                  fontSize: 10,
                }}
              >
                {formatRestTime(block.restTimeSeconds)}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
