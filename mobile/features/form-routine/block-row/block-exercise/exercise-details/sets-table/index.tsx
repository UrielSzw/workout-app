import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IRepsType, ISet, ISetType } from '@/types/routine';
import { ChevronDown, Plus } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

type Props = {
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  exerciseInBlock: any;
  getRepsColumnTitle: (repsType: IRepsType) => string;
  getSetTypeColor: (type: string) => string;
  getSetTypeLabel: (type: string) => string;
  onShowSetTypeBottomSheet: (
    setId: string,
    exerciseId: string,
    current: ISetType,
  ) => void;
  onUpdateSet: (
    exerciseId: string,
    setId: string,
    updatedData: Partial<any>,
  ) => void;
  onAddSetToExercise: (exerciseId: string) => void;
  onShowRepsTypeBottomSheet: (exerciseId: string, current: IRepsType) => void;
};

export const SetsTable: React.FC<Props> = ({
  blockColors,
  exerciseInBlock,
  getRepsColumnTitle,
  getSetTypeColor,
  getSetTypeLabel,
  onShowSetTypeBottomSheet,
  onUpdateSet,
  onAddSetToExercise,
  onShowRepsTypeBottomSheet,
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
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          marginBottom: 8,
        }}
      >
        <View style={{ width: 40 }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            SET
          </Typography>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            KG
          </Typography>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <TouchableOpacity
            onPress={() =>
              onShowRepsTypeBottomSheet(exerciseInBlock.id, repsType)
            }
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
      </View>

      {/* Set Rows */}
      {exerciseInBlock.sets.map((set: ISet, setIndex: number) => (
        <View
          key={set.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 6,
            backgroundColor: set.completed ? blockColors.light : 'transparent',
            borderRadius: 4,
            marginBottom: 4,
          }}
        >
          {/* Set Number */}
          <View style={{ width: 40, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() =>
                onShowSetTypeBottomSheet(set.id, exerciseInBlock.id, set.type)
              }
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor:
                  set.type !== 'normal'
                    ? getSetTypeColor(set.type)
                    : colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  color: set.type !== 'normal' ? 'white' : colors.text,
                  fontSize: 10,
                }}
              >
                {getSetTypeLabel(set.type) || (setIndex + 1).toString()}
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Weight Input */}
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <TextInput
              value={set.weight}
              onChangeText={(value) =>
                onUpdateSet(exerciseInBlock.id, set.id, {
                  weight: value,
                })
              }
              placeholder="0"
              keyboardType="numeric"
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 6,
                textAlign: 'center',
                color: colors.text,
                fontSize: 14,
              }}
            />
          </View>

          {/* Reps Input */}
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <TextInput
              value={set.reps}
              onChangeText={(value) =>
                onUpdateSet(exerciseInBlock.id, set.id, {
                  reps: value,
                })
              }
              placeholder="0"
              keyboardType="numeric"
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 6,
                textAlign: 'center',
                color: colors.text,
                fontSize: 14,
              }}
            />
          </View>
        </View>
      ))}

      {/* Add Set Button */}
      <TouchableOpacity
        onPress={() => onAddSetToExercise(exerciseInBlock.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
          marginTop: 4,
          borderWidth: 1,
          borderColor: blockColors.primary,
          borderStyle: 'dashed',
          borderRadius: 4,
          backgroundColor: blockColors.light,
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
