import { ExerciseSelectorModal } from '@/components/shared/exercise-selector-modal';
import React from 'react';
import {
  useBlockActions,
  useEditValuesActions,
  useEditValuesState,
  useExerciseActions,
  useExerciseModal,
  useSelectedExercises,
} from '../../hooks/use-form-routine-store';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

type Props = {
  blockOptionsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
};

export const ExerciseModal = ({ blockOptionsBottomSheetRef }: Props) => {
  const { clearEditValues, selectExercise, setExerciseModal } =
    useEditValuesActions();
  const { addIndividualBlock, addMultiBlock, addToBlock } = useBlockActions();
  const { replaceExercise } = useExerciseActions();
  const selectedExercises = useSelectedExercises();
  const { exerciseModalMode } = useEditValuesState();
  const isExerciseModalOpen = useExerciseModal();

  const handleReplaceExercise = () => {
    replaceExercise();
    setExerciseModal(false, null);
    clearEditValues();
    blockOptionsBottomSheetRef.current?.dismiss();
  };

  const handleAddToBlock = () => {
    addToBlock();
    setExerciseModal(false, null);
    clearEditValues();
    blockOptionsBottomSheetRef.current?.dismiss();
  };

  return (
    <ExerciseSelectorModal
      visible={isExerciseModalOpen}
      onClose={clearEditValues}
      selectedExercises={selectedExercises}
      onSelectExercise={selectExercise}
      onAddAsIndividual={addIndividualBlock}
      onAddAsBlock={addMultiBlock}
      exerciseModalMode={exerciseModalMode}
      onReplaceExercise={handleReplaceExercise}
      onAddToBlock={handleAddToBlock}
    />
  );
};
