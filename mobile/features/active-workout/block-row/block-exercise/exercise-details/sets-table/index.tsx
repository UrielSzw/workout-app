import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ISet, ISetType } from '@/types/routine';
import { Check, ChevronDown, Plus } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

type Props = {
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  exerciseInBlock: any;
  onChangeGlobalRepsType: () => void;
  getRepsColumnTitle: () => string;
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
};

export const SetsTable: React.FC<Props> = ({
  blockColors,
  exerciseInBlock,
  onChangeGlobalRepsType,
  getRepsColumnTitle,
  getSetTypeColor,
  getSetTypeLabel,
  onShowSetTypeBottomSheet,
  onUpdateSet,
  onAddSetToExercise,
}) => {
  const { colors } = useColorScheme();

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
            onPress={onChangeGlobalRepsType}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Typography variant="caption" weight="medium" color="textMuted">
              {getRepsColumnTitle()}
            </Typography>
            <ChevronDown size={12} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={{ width: 40, alignItems: 'center' }}>
          <Check size={16} color={colors.textMuted} />
        </View>
      </View>

      {/* Set Rows */}
      {exerciseInBlock.sets.map((set: ISet, setIndex: number) => (
        <View
          key={set.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            backgroundColor: set.completed ? blockColors.light : 'transparent',
            borderRadius: 4,
            paddingHorizontal: 8,
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

          {/* Previous Set Info */}
          <View style={{ width: 80, alignItems: 'center' }}>
            <Typography variant="caption" color="textMuted">
              12kg x 10
            </Typography>
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
              placeholderTextColor={colors.textMuted}
              style={{
                backgroundColor: 'transparent',
                borderWidth: 0,
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
              placeholderTextColor={colors.textMuted}
              style={{
                backgroundColor: 'transparent',
                borderWidth: 0,
                paddingHorizontal: 8,
                paddingVertical: 6,
                textAlign: 'center',
                color: colors.text,
                fontSize: 14,
              }}
            />
          </View>

          {/* Complete Button */}
          <View style={{ width: 40, alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                backgroundColor: set.completed
                  ? blockColors.primary
                  : colors.background,
                borderWidth: set.completed ? 0 : 2,
                borderColor: set.completed ? 'transparent' : colors.border,
                shadowColor: set.completed
                  ? blockColors.primary
                  : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: set.completed ? 3 : 0,
              }}
            >
              <Check
                size={16}
                color={set.completed ? '#ffffff' : colors.textMuted}
                strokeWidth={set.completed ? 2.5 : 2}
              />
            </TouchableOpacity>
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
          marginTop: 6,
          borderWidth: 1,
          borderColor: blockColors.primary,
          borderStyle: 'dashed',
          borderRadius: 4,
          backgroundColor: blockColors.light,
          marginHorizontal: 8,
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
