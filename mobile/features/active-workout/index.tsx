import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Typography, Button } from '@/components/ui';
import { ActiveWorkoutHeader } from './active-workout-header';
import { WorkoutProgress } from './workout-progress/index';
import { BlockList } from './block-list/index';
import { RestTimerSheet } from './rest-timer-sheet/index';
import { RepsTypeBottomSheet } from '../form-routine/reps-type-sheet';
import { SetTypeBottomSheet } from '../form-routine/set-type-sheet';
import { useActiveWorkout } from './hook';

export const ActiveWorkoutFeature = () => {
  const { colors } = useColorScheme();

  const {
    activeWorkout,
    isLoading,
    elapsedTime,
    isPaused,
    restTimer,
    repsTypeSheetRef,
    setTypeSheetRef,
    currentSetData,
    handlePauseWorkout,
    handleResumeWorkout,
    handleFinishWorkout,
    handleExitWorkout,
    handleCompleteSet,
    handleUncompleteSet,
    handleUpdateSetValue,
    handleShowRepsTypeSheet,
    handleShowSetTypeSheet,
    handleRepsTypeSelect,
    handleSetTypeSelect,
    handleAddSetToExercise,
    skipRestTimer,
    adjustRestTimer,
    getWorkoutStats,
    formatTime,
  } = useActiveWorkout();

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Typography variant="body1">Cargando entrenamiento...</Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (!activeWorkout) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Typography
            variant="h5"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            No hay entrenamiento activo
          </Typography>
          <Typography
            variant="body2"
            color="textMuted"
            style={{ textAlign: 'center', marginBottom: 24 }}
          >
            Selecciona una rutina para comenzar tu entrenamiento
          </Typography>
          <Button variant="primary" onPress={() => router.back()}>
            Volver a Rutinas
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const workoutStats = getWorkoutStats();

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Sticky Header */}
        <ActiveWorkoutHeader
          routineName={activeWorkout.name}
          elapsedTime={formatTime(elapsedTime)}
          isPaused={isPaused}
          onPause={handlePauseWorkout}
          onResume={handleResumeWorkout}
          onExit={handleExitWorkout}
          onFinish={handleFinishWorkout}
        />

        {/* Progress Bar */}
        <WorkoutProgress
          completed={workoutStats.completed}
          total={workoutStats.total}
          percentage={workoutStats.percentage}
          volume={workoutStats.volume}
          averageRpe={workoutStats.averageRpe}
        />

        {/* Blocks List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <BlockList
            blocks={activeWorkout.blocks}
            onCompleteSet={handleCompleteSet}
            onUncompleteSet={handleUncompleteSet}
            onUpdateSetValue={handleUpdateSetValue}
            onShowRepsTypeSheet={handleShowRepsTypeSheet}
            onShowSetTypeSheet={handleShowSetTypeSheet}
            onAddSet={handleAddSetToExercise}
          />
        </ScrollView>

        {/* Rest Timer Bottom Sheet */}
        <RestTimerSheet
          isVisible={restTimer?.isActive || false}
          restTimeSeconds={restTimer?.totalTime || 0}
          onSkip={skipRestTimer}
          onAdjustTime={adjustRestTimer}
          onTimerComplete={() => {}}
        />

        {/* Reps Type Bottom Sheet */}
        <RepsTypeBottomSheet
          ref={repsTypeSheetRef}
          currentRepsType={(currentSetData?.current as any) || 'reps'}
          onSelectRepsType={handleRepsTypeSelect}
        />

        {/* Set Type Bottom Sheet */}
        <SetTypeBottomSheet
          ref={setTypeSheetRef}
          currentSetType={(currentSetData?.current as any) || 'normal'}
          onSelectSetType={handleSetTypeSelect}
          onDeleteSet={() => {
            // Handle set deletion if needed
            console.log('Delete set requested');
          }}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
