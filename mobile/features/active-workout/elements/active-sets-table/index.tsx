import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IActiveExerciseInBlock } from '@/types/active-workout';
import { Check, ChevronDown, Plus } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { useBlockStyles } from '../../../../hooks/use-block-styles';
import { IActiveToggleSheet } from '../../hooks/use-active-workout-sheets';
import { useActiveSetActions } from '../../hooks/use-active-workout-store';

type Props = {
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  exerciseInBlock: IActiveExerciseInBlock;
  children: React.ReactNode;
  onToggleSheet: (sheet?: IActiveToggleSheet) => void;
};

export const ActiveSetsTable: React.FC<Props> = ({
  blockColors,
  exerciseInBlock,
  children,
  // onToggleSheet,
}) => {
  const { colors } = useColorScheme();
  const { getRepsColumnTitle } = useBlockStyles();
  // const { setEditValues } = useEditValuesActions();
  const { addSet } = useActiveSetActions();

  // const handleRepsType = () => {
  //   onToggleSheet('repsType');
  //   setEditValues({
  //     exerciseInBlockId: exerciseInBlock.id,
  //     currentRepsType: repsType,
  //   });
  // };

  const handleAddSet = () => {
    addSet(exerciseInBlock.id);
  };

  const repsType = exerciseInBlock.sets[0]?.repsType || 'reps';

  return (
    <View style={{ marginTop: 12 }}>
      {/* Table Headers */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
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
      {children}

      {/* Add Set Button */}
      <TouchableOpacity
        onPress={handleAddSet}
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
