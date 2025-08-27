import { Typography } from '@/components/ui';
import { IActiveToggleSheet } from '@/features/active-workout/hooks/use-active-workout-sheets';
import { useActiveEditValuesActions } from '@/features/active-workout/hooks/use-active-workout-store';
import { useBlockStyles } from '@/hooks/use-block-styles';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IBlock } from '@/types/routine';
import { Timer } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  block: IBlock;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  index: number;
  onToggleSheet: (sheet?: IActiveToggleSheet) => void;
};

export const BlockHeader: React.FC<Props> = ({
  block,
  blockColors,
  index,
  onToggleSheet,
}) => {
  const { colors } = useColorScheme();
  const { getBlockTypeIcon, getBlockTypeLabel, formatRestTime } =
    useBlockStyles();
  const { setEditValues } = useActiveEditValuesActions();

  const handlePress = () => {
    setEditValues({
      blockId: block.id,
      isMultiBlock: block.exercises.length > 1,
    });
    onToggleSheet('blockOptions');
  };

  const handleUpdateRestBetweenExercises = () => {
    setEditValues({
      blockId: block.id,
      currentRestTime: block.restBetweenExercisesSeconds,
      currentRestTimeType: 'between-exercises',
    });
    onToggleSheet('restTime');
  };

  const handleUpdateRestBetweenRounds = () => {
    setEditValues({
      blockId: block.id,
      currentRestTime: block.restTimeSeconds,
      currentRestTimeType: 'between-rounds',
    });
    onToggleSheet('restTime');
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
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
          {getBlockTypeIcon(block.type)}
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: blockColors.primary }}
          >
            {block.name || `${getBlockTypeLabel(block.type)} ${index + 1}`}
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
                onPress={handleUpdateRestBetweenExercises}
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
                onPress={handleUpdateRestBetweenRounds}
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
              onPress={handleUpdateRestBetweenRounds}
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
    </TouchableOpacity>
  );
};
