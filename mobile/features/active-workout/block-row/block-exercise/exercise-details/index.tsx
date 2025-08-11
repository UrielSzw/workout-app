import { TouchableOpacity } from 'react-native';
import { ExerciseHeader } from './exercise-header';
import { SetsTable } from './sets-table';
import { IRepsType, ISetType } from '@/types/routine';
import { IActiveExerciseInBlock, IActiveSet } from '@/types/active-workout';

type Props = {
  exerciseInBlock: IActiveExerciseInBlock;
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
};

export const ExerciseDetails: React.FC<Props> = ({
  exerciseInBlock,
  blockColors,
  getRepsColumnTitle,
  getSetTypeColor,
  getSetTypeLabel,
  onCompleteSet,
  onUncompleteSet,
}) => {
  return (
    <TouchableOpacity style={{ flex: 1 }}>
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
      />
    </TouchableOpacity>
  );
};
