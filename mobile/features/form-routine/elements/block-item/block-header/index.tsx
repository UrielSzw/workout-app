import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IBlock } from '@/types/routine';
import { Timer } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { useBlockStyles } from '../../../hooks/use-block-styles';
import { IToogleSheet } from '@/features/form-routine/hooks/use-form-routine-sheets';
import { useEditValuesActions } from '@/features/form-routine/hooks/use-form-routine-store';

type Props = {
  block: IBlock;
  onToggleSheet: (sheet?: IToogleSheet) => void;
};

export const BlockHeader: React.FC<Props> = ({ block, onToggleSheet }) => {
  const {
    getBlockTypeIcon,
    getBlockTypeLabel,
    getBlockColors,
    formatRestTime,
  } = useBlockStyles();
  const { colors } = useColorScheme();
  const { setEditValues } = useEditValuesActions();

  const blockColors = getBlockColors(block.type);

  const showRestTimeBetweenExercises = () => {
    setEditValues({
      currentRestTime: block.restBetweenExercisesSeconds,
      currentRestTimeType: 'between-exercises',
      blockId: block.id,
    });
    onToggleSheet('restTime');
  };

  const showRestTimeBetweenRounds = () => {
    setEditValues({
      currentRestTime: block.restTimeSeconds,
      currentRestTimeType: 'between-rounds',
      blockId: block.id,
    });
    onToggleSheet('restTime');
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: blockColors.light,
        borderBottomWidth: 1,
        borderTopEndRadius: 12,
        borderTopStartRadius: 12,
        borderEndEndRadius: 0,
        borderEndStartRadius: 0,
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
            {block.name ||
              `${getBlockTypeLabel(block.type)} ${block.orderIndex + 1}`}
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
                onPress={showRestTimeBetweenExercises}
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
                onPress={showRestTimeBetweenRounds}
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
              onPress={showRestTimeBetweenRounds}
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
