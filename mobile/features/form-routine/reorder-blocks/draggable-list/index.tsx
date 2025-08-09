import { IBlock } from '@/types/routine';
import { View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { ReorderBlockItem } from '../reorder-block-item';

type Props = {
  reorderedBlocks: IBlock[];
  onReorder: ({ data }: { data: IBlock[] }) => void;
};

export const DraggableList: React.FC<Props> = ({
  reorderedBlocks,
  onReorder,
}) => {
  const renderBlockItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<IBlock>) => {
    const index = reorderedBlocks.findIndex(
      (block: IBlock) => block.id === item.id,
    );

    return (
      <ScaleDecorator>
        <ReorderBlockItem
          blockData={item}
          index={index}
          drag={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <DraggableFlatList
        data={reorderedBlocks}
        onDragEnd={onReorder}
        keyExtractor={(item) => item.id}
        renderItem={renderBlockItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        activationDistance={15}
      />
    </View>
  );
};
