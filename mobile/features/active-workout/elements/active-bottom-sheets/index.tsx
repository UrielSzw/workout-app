import { SetTypeBottomSheet } from '@/components/shared/set-type-sheet';
import React, { useCallback } from 'react';
import { RestTimeBottomSheet } from '@/components/shared/rest-time-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ISetType } from '@/types/routine';
import {
  useActiveBlockActions,
  useActiveEditValuesActions,
  useActiveEditValuesState,
  useActiveExerciseActions,
  useActiveSetActions,
} from '../../hooks/use-active-workout-store';
import { RestTimerBottomSheet } from '../rest-timer-sheet';
import { BlockOptionsBottomSheet } from '@/components/shared/block-options-sheet';
import { ExerciseOptionsBottomSheet } from '@/components/shared/exercise-options-sheet';

type Props = {
  setTypeBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  restTimeBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  blockOptionsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  exerciseOptionsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  restTimerSheetRef: React.RefObject<BottomSheetModal | null>;
};

export const ActiveBottomSheets: React.FC<Props> = ({
  setTypeBottomSheetRef,
  restTimeBottomSheetRef,
  blockOptionsBottomSheetRef,
  exerciseOptionsBottomSheetRef,
  restTimerSheetRef,
}) => {
  const { currentSetType, currentRestTime, isMultiBlock, exerciseName } =
    useActiveEditValuesState();
  const { setExerciseModal, clearEditValues } = useActiveEditValuesActions();
  const { deleteSet, updateSetType } = useActiveSetActions();
  const { updateRestTime, deleteBlock, convertBlockToIndividual } =
    useActiveBlockActions();
  const { deleteExercise } = useActiveExerciseActions();

  const handleUpdateSetType = useCallback(
    (type: ISetType) => {
      updateSetType(type);
      setTypeBottomSheetRef.current?.dismiss();
      clearEditValues();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateSetType, clearEditValues],
  );

  const handleDeleteSet = useCallback(() => {
    deleteSet();
    setTypeBottomSheetRef.current?.dismiss();
    clearEditValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSet, clearEditValues]);

  const handleUpdateRestTime = useCallback(
    (restTime: number) => {
      updateRestTime(restTime);
      restTimeBottomSheetRef.current?.dismiss();
      clearEditValues();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateRestTime, clearEditValues],
  );

  const handleDeleteBlock = useCallback(() => {
    deleteBlock();
    blockOptionsBottomSheetRef.current?.dismiss();
    clearEditValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteBlock, clearEditValues]);

  const handleConvertBlockToIndividual = useCallback(() => {
    convertBlockToIndividual();
    blockOptionsBottomSheetRef.current?.dismiss();
    clearEditValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertBlockToIndividual, clearEditValues]);

  const handleDeleteExercise = useCallback(() => {
    deleteExercise();
    exerciseOptionsBottomSheetRef.current?.dismiss();
    clearEditValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteExercise, clearEditValues]);

  const handleShowReplaceModal = useCallback(() => {
    setExerciseModal(true, 'replace');
    exerciseOptionsBottomSheetRef.current?.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setExerciseModal]);

  const handleShowAddExerciseModal = useCallback(() => {
    setExerciseModal(true, 'add-to-block');
    exerciseOptionsBottomSheetRef.current?.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setExerciseModal]);

  return (
    <>
      <RestTimerBottomSheet ref={restTimerSheetRef} />

      <SetTypeBottomSheet
        ref={setTypeBottomSheetRef}
        onSelectSetType={handleUpdateSetType}
        onDeleteSet={handleDeleteSet}
        currentSetType={currentSetType}
      />

      <RestTimeBottomSheet
        ref={restTimeBottomSheetRef}
        currentRestTime={currentRestTime || 0}
        onSelectRestTime={handleUpdateRestTime}
      />

      <BlockOptionsBottomSheet
        ref={blockOptionsBottomSheetRef}
        onDelete={handleDeleteBlock}
        onConvertToIndividual={handleConvertBlockToIndividual}
        onShowAddExerciseModal={handleShowAddExerciseModal}
        isMultiBlock={!!isMultiBlock}
      />

      <ExerciseOptionsBottomSheet
        ref={exerciseOptionsBottomSheetRef}
        onDelete={handleDeleteExercise}
        onShowReplace={handleShowReplaceModal}
        isInMultipleExercisesBlock={isMultiBlock}
        exerciseName={exerciseName}
      />
    </>
  );
};
