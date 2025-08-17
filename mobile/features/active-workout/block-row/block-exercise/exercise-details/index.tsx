import { TouchableOpacity } from 'react-native';
import { ExerciseHeader } from './exercise-header';
import { SetsTable } from './sets-table';
import { IRepsType, ISetType } from '@/types/routine';
import { IActiveBlock, IActiveExerciseInBlock } from '@/types/active-workout';

type Props = {
  exerciseInBlock: IActiveExerciseInBlock;
  block: IActiveBlock;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  getRepsColumnTitle: (repsType: IRepsType) => string;
  getSetTypeColor: (type: string) => string;
  getSetTypeLabel: (type: string) => string;
  onCompleteSet: (
    exerciseId: string,
    setId: string,
    completionData: {
      actualWeight?: string | undefined;
      actualReps?: string | undefined;
      actualRpe?: number | undefined;
    },
  ) => void;
  onUncompleteSet: (exerciseId: string, setId: string) => void;
  onAddSetToExercise: (exerciseId: string) => void;
  onShowSetType: (exerciseId: string, setId: string, current: ISetType) => void;
  onShowExerciseOptionsBottomSheet: (
    blockId: string,
    exerciseId: string,
    isInMultiExerciseBlock: boolean,
  ) => void;
};

export const ExerciseDetails: React.FC<Props> = ({
  exerciseInBlock,
  block,
  blockColors,
  getRepsColumnTitle,
  getSetTypeColor,
  getSetTypeLabel,
  onCompleteSet,
  onUncompleteSet,
  onAddSetToExercise,
  onShowSetType,
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
    <TouchableOpacity style={{ flex: 1 }} onPress={handlePress}>
      <ExerciseHeader exerciseInBlock={exerciseInBlock} />

      {/* Sets Table */}
      <SetsTable
        blockColors={blockColors}
        exerciseInBlock={exerciseInBlock}
        getRepsColumnTitle={getRepsColumnTitle}
        getSetTypeColor={getSetTypeColor}
        getSetTypeLabel={getSetTypeLabel}
        onCompleteSet={onCompleteSet}
        onUncompleteSet={onUncompleteSet}
        onAddSetToExercise={onAddSetToExercise}
        onShowSetType={onShowSetType}
      />
    </TouchableOpacity>
  );
};
