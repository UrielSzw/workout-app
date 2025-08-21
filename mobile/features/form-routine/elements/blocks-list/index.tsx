import { View } from 'react-native';
import { AddExerciseButton } from '../../../../components/add-exercise-button';
import { ExerciseListTop } from './exercise-list-top';
import { EmptyList } from './empty-list';
import { ListHint } from './list-hint';

type Props = {
  children: React.ReactNode;
  blocksLength: number;
};

export const BlocksList: React.FC<Props> = ({ children, blocksLength }) => {
  return (
    <View style={{ marginBottom: 24 }}>
      <ExerciseListTop />

      {blocksLength === 0 ? (
        <EmptyList />
      ) : (
        <View style={{ gap: 16 }}>
          <ListHint />

          {children}

          <AddExerciseButton />
        </View>
      )}
    </View>
  );
};
