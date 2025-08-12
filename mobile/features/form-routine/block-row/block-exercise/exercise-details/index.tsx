import { TouchableOpacity } from 'react-native';
import { ExerciseHeader } from './exercise-header';
import { SetsTable } from './sets-table';
import { IRepsType, ISet, ISetType } from '@/types/routine';

type Props = {
  block: any;
  exerciseInBlock: any;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
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
  getRepsColumnTitle: (repsType: IRepsType) => string;
  getSetTypeColor: (type: string) => string;
  getSetTypeLabel: (type: string) => string;
  onAddSetToExercise: (exerciseId: string) => void;
  onShowRepsTypeBottomSheet: (exerciseId: string, current: IRepsType) => void;
};

export const ExerciseDetails: React.FC<Props> = ({
  block,
  exerciseInBlock,
  blockColors,
  onShowSetTypeBottomSheet,
  onUpdateSet,
  onLongPressExercise,
  onLongPressReorderExercises,
  getRepsColumnTitle,
  getSetTypeColor,
  getSetTypeLabel,
  onAddSetToExercise,
  onShowRepsTypeBottomSheet,
}) => {
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onLongPress={block.exercises.length > 1 ? onLongPressExercise : undefined}
      delayLongPress={500}
      activeOpacity={block.exercises.length > 1 ? 0.8 : 1}
    >
      <ExerciseHeader
        block={block}
        exerciseInBlock={exerciseInBlock}
        onLongPressReorderExercises={onLongPressReorderExercises}
      />

      {/* Sets Table */}
      <SetsTable
        blockColors={blockColors}
        exerciseInBlock={exerciseInBlock}
        getRepsColumnTitle={getRepsColumnTitle}
        getSetTypeColor={getSetTypeColor}
        getSetTypeLabel={getSetTypeLabel}
        onShowSetTypeBottomSheet={onShowSetTypeBottomSheet}
        onUpdateSet={onUpdateSet}
        onAddSetToExercise={onAddSetToExercise}
        onShowRepsTypeBottomSheet={onShowRepsTypeBottomSheet}
      />
    </TouchableOpacity>
  );
};
