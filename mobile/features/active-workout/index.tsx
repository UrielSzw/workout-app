import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ActiveWorkoutHeader } from './active-workout-header';
import { useActiveWorkout } from './hook';
import { ActiveBlockRow } from './block-row';
import { RestTimerBottomnSheet } from './rest-timer-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

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
        </ScrollView>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
