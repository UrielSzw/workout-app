import { ExerciseSelectorModal } from '@/components/exercise-selector-modal';
import React from 'react';
import {
  useBlockActions,
  useEditValuesActions,
  useEditValuesState,
  useExerciseActions,
  useExerciseModal,
  useSelectedExercises,
} from '../../hooks/use-form-routine-store';

export const ExerciseModal = () => {
  const { clearEditValues, selectExercise } = useEditValuesActions();
  const { addIndividualBlock, addMultiBlock } = useBlockActions();
  const { replaceExercise } = useExerciseActions();
  const selectedExercises = useSelectedExercises();
  const { isReplaceMode } = useEditValuesState();
  const isExerciseModalOpen = useExerciseModal();

  const handleReplaceExercise = () => {
    replaceExercise();
    clearEditValues();
  };

  return (
    <ExerciseSelectorModal
      visible={isExerciseModalOpen}
      onClose={clearEditValues}
      selectedExercises={selectedExercises}
      onSelectExercise={selectExercise}
      onAddAsIndividual={addIndividualBlock}
      onAddAsBlock={addMultiBlock}
      isReplaceMode={isReplaceMode}
      onReplaceExercise={handleReplaceExercise}
    />
  );
};
