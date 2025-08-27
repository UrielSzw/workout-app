import { View } from 'react-native';
import { ExerciseListTop } from './exercise-list-top';
import { EmptyList } from './empty-list';
import { ListHint } from './list-hint';
import { AddExerciseButton } from '@/components/shared/add-exercise-button';

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
