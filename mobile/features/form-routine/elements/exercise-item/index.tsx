import { TouchableOpacity } from 'react-native';
import { ExerciseHeader } from '../exercise-header';
import { SetsTable } from '../sets-table';
import { IToogleSheet } from '../../hooks/use-form-routine-sheets';
import { IBlock, IExerciseInBlock, IRepsType } from '@/types/routine';
import { SetsItem } from '../sets-table/sets-item';
import { router } from 'expo-router';
import {
  useBlockActions,
  useEditValuesActions,
} from '../../hooks/use-form-routine-store';

type Props = {
  block: IBlock;
  exerciseInBlock: IExerciseInBlock;
  onToggleSheet: (sheet?: IToogleSheet) => void;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
};

export const ExerciseItem: React.FC<Props> = ({
  block,
  exerciseInBlock,
  onToggleSheet,
  blockColors,
}) => {
  const { setEditValues } = useEditValuesActions();
  const { setBlockToReorder } = useBlockActions();

  const handlePress = () => {
    setEditValues({
      blockId: block.id,
      exerciseInBlockId: exerciseInBlock.id,
      isMultiBlock: block.type !== 'individual',
    });
    onToggleSheet('exerciseOptions');
  };

  const handleLongPressExercise = () => {
    setBlockToReorder(block);
    router.push('/reorder-exercises');
  };

  const repsType: IRepsType = exerciseInBlock.sets[0].repsType || 'reps';

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onLongPress={
        block.exercises.length > 1 ? handleLongPressExercise : undefined
      }
      delayLongPress={500}
      onPress={handlePress}
      activeOpacity={block.exercises.length > 1 ? 0.8 : 1}
    >
      <ExerciseHeader exerciseInBlock={exerciseInBlock} />

      <SetsTable
        blockType={block.type}
        exerciseInBlockId={exerciseInBlock.id}
        onToggleSheet={onToggleSheet}
        repsType={repsType}
      >
        {exerciseInBlock.sets.map((set, index) => (
          <SetsItem
            key={index}
            set={set}
            onToggleSheet={onToggleSheet}
            repsType={repsType}
            blockColors={blockColors}
            exerciseInBlockId={exerciseInBlock.id}
            setIndex={index}
          />
        ))}
      </SetsTable>
    </TouchableOpacity>
  );
};
