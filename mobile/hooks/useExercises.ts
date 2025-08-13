import { EXERCISE_LIBRARY } from '@/data/exercises';
import { IExerciseMuscle } from '@/types/routine';

export const useExercises = () => {
  const getExercisesByMuscleGroup = (muscleGroup: IExerciseMuscle) => {
    return EXERCISE_LIBRARY.filter((exercise) =>
      exercise.muscleGroups.includes(muscleGroup),
    );
  };

  const getExerciseByName = (name: string) => {
    return EXERCISE_LIBRARY.find((exercise) => exercise.name.includes(name));
  };

  return {
    getExercisesByMuscleGroup,
    getExerciseByName,
    allExercises: EXERCISE_LIBRARY,
  };
};
