import { IBlock, IExerciseInBlock } from '@/types/routine';
import { View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { ReorderExerciseItem } from '../reorder-exercise-item';

type Props = {
  reorderedExercises: IExerciseInBlock[];
  block: IBlock;
  onReorder: ({ data }: { data: IExerciseInBlock[] }) => void;
};

export const DraggableList: React.FC<Props> = ({
  reorderedExercises,
  block,
  onReorder,
}) => {
  const renderExerciseItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<IExerciseInBlock>) => {
    const index = reorderedExercises.findIndex((ex) => ex.id === item.id);
    return (
      <ScaleDecorator>
        <ReorderExerciseItem
          exercise={item}
          index={index}
          drag={drag}
          isActive={isActive}
          blockType={block.type}
        />
      </ScaleDecorator>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <DraggableFlatList
        data={reorderedExercises}
        onDragEnd={onReorder}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        activationDistance={15}
      />
    </View>
  );
};
