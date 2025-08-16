import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ActiveWorkoutHeader } from './active-workout-header';
import { useActiveWorkout } from './hook';
import { ActiveBlockRow } from './block-row';
import { RestTimerBottomnSheet } from './rest-timer-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { RestTimeBottomSheet } from '@/components/rest-time-sheet';

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
            />
          ))}

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
        </ScrollView>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
