import React, { useRef } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CreateRoutineHeader } from './create-routine-header';
import { RoutineInfo } from './routine-info';
import { ExerciseList } from './exercise-list';
import { useFormRoutine } from './hook';
import { ExerciseSelectorModal } from './exercise-selector-modal';
import { SetTypeBottomSheet } from './set-type-sheet';
import { IRepsType, ISetType } from '@/types/routine';
import { RepsTypeBottomSheet } from './reps-type-sheet';
import { RestTimeBottomSheet } from './rest-time-sheet';

type Props = {
  isEditMode?: boolean;
};

export const FormRoutineFeature = ({ isEditMode }: Props) => {
  const { colors } = useColorScheme();

  const {
    blocks,
    routineName,
    setRoutineName,
    handleSaveRoutine,
    globalRepsType,
    handleDeleteBlock,
    handleConvertToIndividual,
    handleUpdateBlock,
    handleReorderBlocks,
    handleReorderExercises,
    setCurrentSetId,
    setCurrentExerciseId,
    setCurrentBlockId,
    setCurrentRestTime,
    setCurrentRestTimeType,
    currentRestTime,
    exerciseSelectorVisible,
    setExerciseSelectorVisible,
    selectedExercises,
    handleAddAsBlock,
    handleAddAsIndividual,
    handleSelectExercise,
    handleSetTypeSelect,
    handleDeleteSet,
    handleRepsTypeSelect,
    handleBlockRestTimeSelect,
    currentSetType,
    setCurrentSetType,
    handleClearRoutine,
  } = useFormRoutine({ isEditMode });

  // Bottom sheet refs
  const setTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const repsTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const restTimeBottomSheetRef = useRef<BottomSheetModal>(null);

  const handleShowSetTypeBottomSheet = (
    setId: string,
    exerciseId: string,
    current: ISetType,
  ) => {
    setCurrentSetId(setId);
    setCurrentExerciseId(exerciseId);
    setCurrentSetType(current);
    setTypeBottomSheetRef.current?.present();
  };

  const handleChangeGlobalRepsType = () => {
    repsTypeBottomSheetRef.current?.present();
  };

  const handleShowBlockRestTimeBottomSheet = (
    blockId: string,
    currentRestTime: number,
    type: 'between-rounds' | 'between-exercises',
  ) => {
    setCurrentBlockId(blockId);
    setCurrentRestTime(currentRestTime);
    setCurrentRestTimeType(type);
    restTimeBottomSheetRef.current?.present();
  };

  const handleSetTypeSelectMethod = (setType: ISetType) => {
    handleSetTypeSelect(setType);
    setCurrentSetType(null);
    setTypeBottomSheetRef.current?.dismiss();
  };

  const handleDeleteSetMethod = () => {
    handleDeleteSet();
    setTypeBottomSheetRef.current?.dismiss();
  };

  const handleRepsTypeSelectMethod = (repsType: IRepsType) => {
    handleRepsTypeSelect(repsType);
    repsTypeBottomSheetRef.current?.dismiss();
  };

  const handleBlockRestTimeSelectMethod = (restTimeSeconds: number) => {
    handleBlockRestTimeSelect(restTimeSeconds);
    restTimeBottomSheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Sticky Header */}
        <CreateRoutineHeader
          onSaveRoutine={handleSaveRoutine}
          onClearRoutine={handleClearRoutine}
          isEditMode={!!isEditMode}
        />

        {/* Scrollable Content */}
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
            {/* Routine Information */}
            <RoutineInfo
              routineName={routineName}
              onRoutineNameChange={setRoutineName}
            />

            {/* Exercises List */}
            <ExerciseList
              blocks={blocks}
              onDeleteBlock={handleDeleteBlock}
              onConvertToIndividual={handleConvertToIndividual}
              onUpdateBlock={handleUpdateBlock}
              setExerciseSelectorVisible={setExerciseSelectorVisible}
              globalRepsType={globalRepsType}
              onChangeGlobalRepsType={handleChangeGlobalRepsType}
              onShowSetTypeBottomSheet={handleShowSetTypeBottomSheet}
              onShowBlockRestTimeBottomSheet={
                handleShowBlockRestTimeBottomSheet
              }
              onReorderBlocks={handleReorderBlocks}
              onReorderExercises={handleReorderExercises}
            />
          </View>
        </ScrollView>

        {/* Exercise Selector Modal */}
        <ExerciseSelectorModal
          visible={exerciseSelectorVisible}
          onClose={() => setExerciseSelectorVisible(false)}
          selectedExercises={selectedExercises}
          onSelectExercise={handleSelectExercise}
          onAddAsIndividual={handleAddAsIndividual}
          onAddAsBlock={handleAddAsBlock}
        />

        {/* Bottom Sheets */}
        <SetTypeBottomSheet
          ref={setTypeBottomSheetRef}
          onSelectSetType={handleSetTypeSelectMethod}
          onDeleteSet={handleDeleteSetMethod}
          currentSetType={currentSetType}
        />

        <RepsTypeBottomSheet
          ref={repsTypeBottomSheetRef}
          currentRepsType={globalRepsType}
          onSelectRepsType={handleRepsTypeSelectMethod}
        />

        <RestTimeBottomSheet
          ref={restTimeBottomSheetRef}
          currentRestTime={currentRestTime}
          onSelectRestTime={handleBlockRestTimeSelectMethod}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
