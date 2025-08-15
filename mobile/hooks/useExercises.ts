import { mainStore } from '@/store/main-store';
import { IExerciseMuscle } from '@/types/routine';

export const useExercises = () => {
  const { exercises } = mainStore();

  const getExercisesByMuscleGroup = (muscleGroup: IExerciseMuscle) => {
    return exercises.filter((exercise) =>
      exercise.muscleGroups.includes(muscleGroup),
    );
  };

  const getExerciseByName = (name: string) => {
    return exercises.find((exercise) => exercise.name.includes(name));
  };

  return {
    getExercisesByMuscleGroup,
    getExerciseByName,
    allExercises: exercises,
  };
};
