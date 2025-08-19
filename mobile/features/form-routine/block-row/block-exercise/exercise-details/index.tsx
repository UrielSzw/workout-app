import { TouchableOpacity } from 'react-native';
import { ExerciseHeader } from './exercise-header';
import { SetsTable } from './sets-table';
import { IRepsType, ISet, ISetType } from '@/types/routine';

type Props = {
  block: any;
  exerciseInBlock: any;
  onShowSetTypeBottomSheet: (
    setId: string,
    exerciseId: string,
    current: ISetType,
  ) => void;
  onUpdateSet: (
    exerciseId: string,
    setId: string,
    setIndex: number,
    updatedData: Partial<ISet>,
  ) => void;
  onLongPressExercise?: () => void;
  onLongPressReorderExercises?: (block: any) => void;
  onAddSetToExercise: (exerciseId: string) => void;
  onShowRepsTypeBottomSheet: (exerciseId: string, current: IRepsType) => void;
  onShowExerciseOptionsBottomSheet: (
    blockId: string,
    exerciseId: string,
    isInMultiExerciseBlock: boolean,
  ) => void;
};

export const ExerciseDetails: React.FC<Props> = ({
  block,
  exerciseInBlock,
  onShowSetTypeBottomSheet,
  onUpdateSet,
  onLongPressExercise,
  onLongPressReorderExercises,
  onAddSetToExercise,
  onShowRepsTypeBottomSheet,
  onShowExerciseOptionsBottomSheet,
}) => {
  const handlePress = () => {
    onShowExerciseOptionsBottomSheet(
      block.id,
      exerciseInBlock.id,
      block.exercises.length > 1,
    );
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onLongPress={block.exercises.length > 1 ? onLongPressExercise : undefined}
      delayLongPress={500}
      onPress={handlePress}
      activeOpacity={block.exercises.length > 1 ? 0.8 : 1}
    >
      <ExerciseHeader
        block={block}
        exerciseInBlock={exerciseInBlock}
        onLongPressReorderExercises={onLongPressReorderExercises}
      />

      {/* Sets Table */}
      <SetsTable
        block={block}
        exerciseInBlock={exerciseInBlock}
        onShowSetTypeBottomSheet={onShowSetTypeBottomSheet}
        onUpdateSet={onUpdateSet}
        onAddSetToExercise={onAddSetToExercise}
        onShowRepsTypeBottomSheet={onShowRepsTypeBottomSheet}
      />
    </TouchableOpacity>
  );
};
