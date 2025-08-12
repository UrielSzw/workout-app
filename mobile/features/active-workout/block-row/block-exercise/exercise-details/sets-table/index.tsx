import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IActiveExerciseInBlock, IActiveSet } from '@/types/active-workout';
import { IRepsType } from '@/types/routine';
import { Check, ChevronDown, Plus } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { SetRow } from '../sets-row';

type Props = {
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  exerciseInBlock: IActiveExerciseInBlock;
  getRepsColumnTitle: (repsType: IRepsType) => string;
  getSetTypeColor: (type: string) => string;
  getSetTypeLabel: (type: string) => string;
  onCompleteSet: (
    exerciseId: string,
    setId: string,
    completionData: {
      actualWeight?: string | undefined;
      actualReps?: string | undefined;
      actualRpe?: number | undefined;
    },
  ) => void;
  onUncompleteSet: (exerciseId: string, setId: string) => void;
};

export const SetsTable: React.FC<Props> = ({
  blockColors,
  exerciseInBlock,
  getRepsColumnTitle,
  getSetTypeColor,
  getSetTypeLabel,
  onCompleteSet,
  onUncompleteSet,
}) => {
  const { colors } = useColorScheme();

  const repsType = exerciseInBlock.sets[0]?.repsType || 'reps';

  return (
    <View style={{ marginTop: 12 }}>
      {/* Table Headers */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          // borderBottomWidth: 1,
          // borderBottomColor: colors.border,
          marginBottom: 8,
          paddingHorizontal: 8,
        }}
      >
        <View style={{ width: 40, alignItems: 'center' }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            SET
          </Typography>
        </View>
        <View style={{ width: 80, alignItems: 'center' }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            PREV
          </Typography>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8, alignItems: 'center' }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            KG
          </Typography>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8, alignItems: 'center' }}>
          <TouchableOpacity
            // onPress={() =>
            //   onShowRepsTypeBottomSheet(exerciseInBlock.id, repsType)
            // }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Typography variant="caption" weight="medium" color="textMuted">
              {getRepsColumnTitle(repsType)}
            </Typography>
            <ChevronDown size={12} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={{ width: 40, alignItems: 'center' }}>
          <Check size={16} color={colors.textMuted} />
        </View>
      </View>

      {/* Set Rows */}
      {exerciseInBlock.sets.map((set: IActiveSet, setIndex: number) => (
        <SetRow
          key={set.id}
          set={set}
          setIndex={setIndex}
          blockColors={blockColors}
          onCompleteSet={onCompleteSet}
          onUncompleteSet={onUncompleteSet}
          exerciseInBlock={exerciseInBlock}
          getSetTypeColor={getSetTypeColor}
          getSetTypeLabel={getSetTypeLabel}
        />
      ))}

      {/* Add Set Button */}
      <TouchableOpacity
        // onPress={() => onAddSetToExercise(exerciseInBlock.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
          marginTop: 6,
          borderWidth: 1,
          borderColor: blockColors.primary,
          borderStyle: 'dashed',
          borderRadius: 4,
          backgroundColor: blockColors.light,
          marginHorizontal: 8,
          opacity: 0.6,
        }}
      >
        <Plus size={14} color={blockColors.primary} />
        <Typography
          variant="caption"
          weight="medium"
          style={{
            color: blockColors.primary,
            marginLeft: 4,
          }}
        >
          Agregar Serie
        </Typography>
      </TouchableOpacity>
    </View>
  );
};
