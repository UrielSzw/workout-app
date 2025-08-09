import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Typography, Button } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DraggableList } from './draggable-list';
import { IBlock, IBlockType, IExerciseInBlock } from '@/types/routine';

type Props = {
  block: IBlock;
  onReorder: (reorderedBlock: IBlock) => void;
  onCancel: () => void;
};

export const ReorderExercisesScreen: React.FC<Props> = ({
  block,
  onReorder,
  onCancel,
}) => {
  const { colors } = useColorScheme();

  const [reorderedExercises, setReorderedExercises] = useState(block.exercises);

  const getBlockTypeLabel = (type: IBlockType) => {
    switch (type) {
      case 'superset':
        return 'Superserie';
      case 'circuit':
        return 'Circuito';
      default:
        return 'Individual';
    }
  };

  const handleReorder = ({ data }: { data: IExerciseInBlock[] }) => {
    // Update orderIndex for each exercise
    const updatedExercises = data.map((exercise, index) => ({
      ...exercise,
      orderIndex: index,
    }));
    setReorderedExercises(updatedExercises);
  };

  const handleSave = () => {
    const updatedBlock = {
      ...block,
      exercises: reorderedExercises,
    };
    onReorder(updatedBlock);
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

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Typography variant="h6" weight="semibold">
            Reordenar Ejercicios
          </Typography>
          <Typography variant="caption" color="textMuted">
            {getBlockTypeLabel(block.type)}
          </Typography>
        </View>

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
          Mantén presionado un ejercicio por 300ms para arrastrarlo y reordenar
        </Typography>
      </View>

      {/* Draggable List */}
      <DraggableList
        reorderedExercises={reorderedExercises}
        block={block}
        onReorder={handleReorder}
      />
    </SafeAreaView>
  );
};
