import { ExerciseSelectorModal } from '@/components/shared/exercise-selector-modal';
import React from 'react';
import {
  useActiveBlockActions,
  useActiveEditValuesActions,
  useActiveEditValuesState,
  useActiveExerciseActions,
  useActiveExerciseModal,
  useActiveSelectedExercises,
} from '../../hooks/use-active-workout-store';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

type Props = {
  blockOptionsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
};

export const ActiveExerciseModal: React.FC<Props> = ({
  blockOptionsBottomSheetRef,
}) => {
  const { clearEditValues, selectExercise, setExerciseModal } =
    useActiveEditValuesActions();
  const { addIndividualBlock, addMultiBlock, addToBlock } =
    useActiveBlockActions();
  const { replaceExercise } = useActiveExerciseActions();
  const selectedExercises = useActiveSelectedExercises();
  const { exerciseModalMode } = useActiveEditValuesState();
  const isExerciseModalOpen = useActiveExerciseModal();

  const handleReplaceExercise = () => {
    replaceExercise();
    setExerciseModal(false, null);
    clearEditValues();
    blockOptionsBottomSheetRef.current?.dismiss();
  };

  const handleAddIndividualBlock = () => {
    addIndividualBlock();
    setExerciseModal(false, null);
    clearEditValues();
    blockOptionsBottomSheetRef.current?.dismiss();
  };

  const handleAddMultiBlock = () => {
    addMultiBlock();
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
      onAddAsIndividual={handleAddIndividualBlock}
      onAddAsBlock={handleAddMultiBlock}
      exerciseModalMode={exerciseModalMode}
      onReplaceExercise={handleReplaceExercise}
      onAddToBlock={handleAddToBlock}
    />
  );
};
