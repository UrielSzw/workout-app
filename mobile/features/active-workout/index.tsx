import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ActiveWorkoutHeader } from './active-workout-header';
import { useActiveWorkout } from './hook';
import { ActiveBlockRow } from './block-row';

export const ActiveWorkoutFeature = () => {
  const { colors } = useColorScheme();
  const {
    activeWorkout,
    isWorkoutActive,
    isPaused,
    elapsedTime,
    formatTime,
    getWorkoutStats,
    handleExitWorkout,
  } = useActiveWorkout();

  if (!activeWorkout || !isWorkoutActive) {
    return null; // Or redirect to routines
  }

  const workoutStats = getWorkoutStats();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header Sticky */}
      <ActiveWorkoutHeader
        routineName={activeWorkout.name}
        elapsedTime={formatTime(elapsedTime)}
        isPaused={isPaused}
        progress={workoutStats}
        onExit={handleExitWorkout}
      />

      {/* ScrollView Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          // paddingTop: 20,
          paddingBottom: 100,
          // gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* TODO: Add blocks/exercises list here */}
        {activeWorkout.blocks.map((blockData, index) => (
          <ActiveBlockRow
            key={blockData.id}
            block={blockData}
            index={index}
            onUpdateBlock={() => {}}
            onShowSetTypeBottomSheet={() => {}}
            onShowRestTimeBottomSheet={() => {}}
            globalRepsType={'reps'}
            onChangeGlobalRepsType={() => {}}
            onLongPressReorder={() => {}}
            onLongPressReorderExercises={() => {}}
          />
        ))}

        {/* TODO: Add rest timer sheet */}
        {/* TODO: Add other bottom sheets */}
      </ScrollView>
    </SafeAreaView>
  );
};
