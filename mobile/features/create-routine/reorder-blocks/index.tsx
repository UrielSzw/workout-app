import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Typography, Button } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';
import { IBlock } from '@/types/routine';
import { DraggableList } from './draggable-list';

type Props = {
  blocks: IBlock[];
  onReorder: (reorderedBlocks: IBlock[]) => void;
  onCancel: () => void;
};

export const ReorderBlocksScreen: React.FC<Props> = ({
  blocks,
  onReorder,
  onCancel,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const [reorderedBlocks, setReorderedBlocks] = useState(blocks);

  const handleReorder = ({ data }: { data: IBlock[] }) => {
    // Update orderIndex for each block
    const updatedBlocks = data.map((block, index) => ({
      ...block,
      orderIndex: index,
    }));
    setReorderedBlocks(updatedBlocks);
  };

  const handleSave = () => {
    onReorder(reorderedBlocks);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Button variant="ghost" size="sm" onPress={handleCancel}>
          <ArrowLeft size={18} color={colors.text} />
        </Button>

        <Typography variant="h6" weight="semibold">
          Reordenar Bloques
        </Typography>

        <Button
          variant="primary"
          size="sm"
          onPress={handleSave}
          style={{
            backgroundColor: colors.primary[500],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Typography
            variant="button"
            style={{ color: 'white', marginLeft: 4, fontSize: 14 }}
          >
            Guardar
          </Typography>
        </Button>
      </View>

      {/* Instructions */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <Typography
          variant="body2"
          color="textMuted"
          style={{ textAlign: 'center' }}
        >
          Mantén presionado un bloque por 300ms para arrastrarlo y reordenar
        </Typography>
      </View>

      {/* Draggable List */}
      <DraggableList
        reorderedBlocks={reorderedBlocks}
        onReorder={handleReorder}
      />
    </SafeAreaView>
  );
};
