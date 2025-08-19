import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ActiveWorkoutHeader } from './active-workout-header';
import { useActiveWorkout } from './hook';
import { ActiveBlockRow } from './block-row';
import { RestTimerBottomnSheet } from './rest-timer-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { RestTimeBottomSheet } from '@/components/rest-time-sheet';
import { ExerciseSelectorModal } from '@/components/exercise-selector-modal';
import { AddExerciseButton } from '@/components/add-exercise-button';
import { SetTypeBottomSheet } from '@/components/set-type-sheet';
import { ISetType } from '@/types/routine';
import { BlockOptionsBottomSheet } from '@/components/block-options-sheet';
import { ExerciseOptionsBottomSheet } from '@/components/exercise-options-sheet';

export const ActiveWorkoutFeature = () => {
  const { colors } = useColorScheme();
  const {
    activeWorkout,
    isWorkoutActive,
    getWorkoutStats,
    handleExitWorkout,
    handleCompleteSet,
    handleUncompleteSet,
    handleFinishWorkout,

    // Rest timer
    restTimer,
    skipRestTimer,
    adjustRestTimer,
    restTimerSheetRef,

    // Update workout on demand
    restTimeBottomSheetRef,
    handleShowBlockRestTimeBottomSheet,
    handleBlockRestTimeSelect,
    currentRestTime,

    exerciseSelectorVisible,
    setExerciseSelectorVisible,
    handleAddAsIndividual,
    handleAddAsBlock,
    handleConvertToIndividual,
    selectedExercises,
    handleSelectExercise,

    handleAddSetToExercise,

    setTypeSheetRef,
    handleSetTypeSelect,
    currentSetData,
    handleShowSetTypeSheet,

    // Delete
    handleDeleteSet,
    blockOptionsBottomSheetRef,
    handleShowBlockOptionsBottomSheet,
    exercisesLength,
    handleDeleteBlock,

    // Exercise methods
    exerciseOptionsBottomSheetRef,
    handleShowExerciseOptionsBottomSheet,
    handleDeleteExercise,
    isInMultipleExerciseBlock,
    handleShowReplaceModal,
    isReplaceMode,
    handleReplaceExercise,
  } = useActiveWorkout();

  if (!activeWorkout || !isWorkoutActive) {
    return null; // Or redirect to routines
  }

  const workoutStats = getWorkoutStats();

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header Sticky */}
        <ActiveWorkoutHeader
          routineName={activeWorkout.name}
          progress={workoutStats}
          onExit={handleExitWorkout}
          isWorkoutActive={isWorkoutActive}
          activeWorkout={activeWorkout}
          onFinishWorkout={handleFinishWorkout}
        />

        {/* ScrollView Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 300,
          }}
          showsVerticalScrollIndicator={false}
        >
          {activeWorkout.blocks.map((blockData, index) => (
            <ActiveBlockRow
              key={blockData.id}
              block={blockData}
              index={index}
              onCompleteSet={handleCompleteSet}
              onUncompleteSet={handleUncompleteSet}
              onShowBlockRestTimeBottomSheet={
                handleShowBlockRestTimeBottomSheet
              }
              onAddSetToExercise={handleAddSetToExercise}
              onShowSetType={handleShowSetTypeSheet}
              onShowBlockOptionsBottomSheet={handleShowBlockOptionsBottomSheet}
              onShowExerciseOptionsBottomSheet={
                handleShowExerciseOptionsBottomSheet
              }
            />
          ))}

          <View style={{ padding: 20 }}>
            <AddExerciseButton
              setExerciseSelectorVisible={setExerciseSelectorVisible}
            />
          </View>

          {/* Rest Timer Bottom Sheet */}
          <RestTimerBottomnSheet
            ref={restTimerSheetRef}
            restTimeSeconds={restTimer?.totalTime || 0}
            timerKey={restTimer?.startedAt}
            onSkip={skipRestTimer}
            onAdjustTime={adjustRestTimer}
            onTimerComplete={() => {}}
          />

          {/* TODO: Add other bottom sheets */}
          <RestTimeBottomSheet
            ref={restTimeBottomSheetRef}
            currentRestTime={currentRestTime}
            onSelectRestTime={handleBlockRestTimeSelect}
          />

          <SetTypeBottomSheet
            ref={setTypeSheetRef}
            onSelectSetType={handleSetTypeSelect}
            onDeleteSet={handleDeleteSet}
            currentSetType={currentSetData?.current as ISetType}
          />

          <ExerciseSelectorModal
            visible={exerciseSelectorVisible}
            onClose={() => setExerciseSelectorVisible(false)}
            selectedExercises={selectedExercises}
            onSelectExercise={handleSelectExercise}
            onAddAsIndividual={handleAddAsIndividual}
            onAddAsBlock={handleAddAsBlock}
            isReplaceMode={isReplaceMode}
            onReplaceExercise={handleReplaceExercise}
          />

          <BlockOptionsBottomSheet
            ref={blockOptionsBottomSheetRef}
            onDelete={handleDeleteBlock}
            onConvertToIndividual={handleConvertToIndividual}
            exercisesLength={exercisesLength}
          />

          <ExerciseOptionsBottomSheet
            ref={exerciseOptionsBottomSheetRef}
            onDelete={handleDeleteExercise}
            onShowReplace={handleShowReplaceModal}
            isInMultipleExercisesBlock={isInMultipleExerciseBlock}
          />
        </ScrollView>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
