import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IBlock } from '@/types/routine';
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Timer,
} from 'lucide-react-native';
import { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useBlockStyles } from '../utils';

type Props = {
  block: IBlock;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  isExpanded: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  onShowRestTimeBottomSheet: (
    blockId: string,
    currentRestTime: number,
    type: 'between-rounds' | 'between-exercises',
  ) => void;
  index: number;
  showMenu: boolean;
};

export const BlockHeader: React.FC<Props> = ({
  block,
  setIsExpanded,
  isExpanded,
  setShowMenu,
  onShowRestTimeBottomSheet,
  index,
  showMenu,
}) => {
  const {
    getBlockTypeIcon,
    getBlockTypeLabel,
    getBlockColors,
    formatRestTime,
  } = useBlockStyles();
  const { colors } = useColorScheme();

  const blockColors = getBlockColors(block.type);

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: blockColors.light,
        borderBottomWidth: 1,
        borderTopEndRadius: 12,
        borderTopStartRadius: 12,
        borderEndEndRadius: isExpanded ? 0 : 12,
        borderEndStartRadius: isExpanded ? 0 : 12,
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
          {getBlockTypeIcon(block.type)}
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: blockColors.primary }}
          >
            {block.name || `${getBlockTypeLabel(block.type)} ${index + 1}`}
          </Typography>
        </View>

        {/* Right - Main Controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Expand/Collapse */}
          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            style={{ padding: 4 }}
          >
            {isExpanded ? (
              <ChevronUp size={16} color={colors.textMuted} />
            ) : (
              <ChevronDown size={16} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          {/* Menu for multi-exercise blocks */}
          {block.exercises.length > 1 && (
            <TouchableOpacity
              onPress={() => setShowMenu(!showMenu)}
              style={{ padding: 4 }}
            >
              <MoreVertical size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
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
                  onShowRestTimeBottomSheet(
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
                  onShowRestTimeBottomSheet(
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
                onShowRestTimeBottomSheet(
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
