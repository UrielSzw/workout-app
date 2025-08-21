import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useBlockStyles } from '../../hooks/use-block-styles';
import { Typography } from '@/components/ui';
import { ChevronDown, Plus } from 'lucide-react-native';
import { IBlockType, IRepsType } from '@/types/routine';
import { IToogleSheet } from '../../hooks/use-form-routine-sheets';
import {
  useEditValuesActions,
  useSetActions,
} from '../../hooks/use-form-routine-store';

type Props = {
  children: React.ReactNode;
  blockType: IBlockType;
  repsType: IRepsType;
  onToggleSheet: (sheet?: IToogleSheet) => void;
  exerciseInBlockId: string;
};

export const SetsTable: React.FC<Props> = ({
  children,
  blockType,
  repsType,
  onToggleSheet,
  exerciseInBlockId,
}) => {
  const { colors } = useColorScheme();
  const { getRepsColumnTitle, getBlockColors } = useBlockStyles();
  const { setEditValues } = useEditValuesActions();
  const { addSet } = useSetActions();

  const blockColors = getBlockColors(blockType);

  const handleRepsType = () => {
    onToggleSheet('repsType');
    setEditValues({
      exerciseInBlockId,
      currentRepsType: repsType,
    });
  };

  const handleAddSet = () => {
    addSet(exerciseInBlockId);
  };

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
            onPress={handleRepsType}
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
      {children}

      {/* Add Set Button */}
      <TouchableOpacity
        onPress={handleAddSet}
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
