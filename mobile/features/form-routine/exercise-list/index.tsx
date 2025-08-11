import { IBlock, IRepsType, ISetType } from '@/types/routine';
import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { ExerciseListTop } from './exercise-list-top';
import { EmptyList } from './empty-list';
import { ListHint } from './list-hint';
import { AddExerciseButton } from './add-exercise-button';
import { BlockRow } from '../block-row';

type Props = {
  blocks: IBlock[];
  setExerciseSelectorVisible: Dispatch<SetStateAction<boolean>>;
  onDeleteBlock: (blockId: string) => void;
  onConvertToIndividual: (blockId: string) => void;
  onUpdateBlock: (blockId: string, updatedData: Partial<IBlock>) => void;
  onShowSetTypeBottomSheet: (
    setId: string,
    exerciseId: string,
    current: ISetType,
  ) => void;
  onShowBlockRestTimeBottomSheet: (
    blockId: string,
    currentRestTime: number,
    type: 'between-rounds' | 'between-exercises',
  ) => void;
  onShowRepsTypeBottomSheet: (exerciseId: string, current: IRepsType) => void;
  onReorderBlocks: () => void;
  onReorderExercises: (block: IBlock) => void;
};

export const ExerciseList: React.FC<Props> = ({
  blocks,
  setExerciseSelectorVisible,
  onDeleteBlock,
  onConvertToIndividual,
  onUpdateBlock,
  onShowSetTypeBottomSheet,
  onShowBlockRestTimeBottomSheet,
  onReorderBlocks,
  onReorderExercises,
  onShowRepsTypeBottomSheet,
}) => {
  return (
    <View style={{ marginBottom: 24 }}>
      <ExerciseListTop
        blocks={blocks}
        setExerciseSelectorVisible={setExerciseSelectorVisible}
      />

      {blocks.length === 0 ? (
        <EmptyList setExerciseSelectorVisible={setExerciseSelectorVisible} />
      ) : (
        <View style={{ gap: 16 }}>
          <ListHint />

          {blocks.map((blockData, index) => (
            <BlockRow
              key={blockData.id}
              block={blockData}
              index={index}
              onDeleteBlock={onDeleteBlock}
              onConvertToIndividual={onConvertToIndividual}
              onUpdateBlock={onUpdateBlock}
              onShowSetTypeBottomSheet={onShowSetTypeBottomSheet}
              onShowRestTimeBottomSheet={onShowBlockRestTimeBottomSheet}
              onLongPressReorder={onReorderBlocks}
              onLongPressReorderExercises={onReorderExercises}
              onShowRepsTypeBottomSheet={onShowRepsTypeBottomSheet}
            />
          ))}

          {/* Add Exercise Button */}
          <AddExerciseButton
            setExerciseSelectorVisible={setExerciseSelectorVisible}
          />
        </View>
      )}
    </View>
  );
};
