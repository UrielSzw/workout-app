import { View } from 'react-native';
import { IActiveBlock, IActiveExerciseInBlock } from '@/types/active-workout';
import { ActiveExerciseHeader } from '../active-exercise-header';
import { ActiveSetsTable } from '../../active-sets-table';
import { ActiveSetRow } from '../../active-sets-table/active-sets-row';
import { IActiveToggleSheet } from '@/features/active-workout/hooks/use-active-workout-sheets';
import { useActiveEditValuesActions } from '@/features/active-workout/hooks/use-active-workout-store';

type Props = {
  exerciseInBlock: IActiveExerciseInBlock;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  block: IActiveBlock;
  onToggleSheet: (sheet?: IActiveToggleSheet) => void;
};

export const ActiveExerciseDetails: React.FC<Props> = ({
  exerciseInBlock,
  blockColors,
  block,
  onToggleSheet,
}) => {
  const { setEditValues } = useActiveEditValuesActions();

  const prevSets = exerciseInBlock.exercise.userStats?.lastSets || [];

  const handlePress = () => {
    setEditValues({
      blockId: block.id,
      exerciseInBlockId: exerciseInBlock.id,
      isMultiBlock: block.exercises.length > 1,
      exerciseName: exerciseInBlock.exercise.name,
    });
    onToggleSheet('exerciseOptions');
  };

  return (
    <View style={{ flex: 1 }}>
      <ActiveExerciseHeader
        exerciseInBlock={exerciseInBlock}
        onPress={handlePress}
      />

      <ActiveSetsTable
        blockColors={blockColors}
        onToggleSheet={onToggleSheet}
        exerciseInBlock={exerciseInBlock}
      >
        {exerciseInBlock.sets.map((set, index) => (
          <ActiveSetRow
            key={set.id}
            set={set}
            exerciseInBlock={exerciseInBlock}
            setIndex={index}
            blockColors={blockColors}
            prevSet={prevSets.find(
              (prevSet) => prevSet.setNumber === set.setNumber,
            )}
            onToggleSheet={onToggleSheet}
          />
        ))}
      </ActiveSetsTable>
    </View>
  );
};
