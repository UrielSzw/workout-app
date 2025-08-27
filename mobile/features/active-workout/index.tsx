import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ActiveWorkoutHeader } from './elements/active-workout-header';
import { useActiveWorkoutState } from './hooks/use-active-workout-store';
import { ActiveBlockItem } from './elements/active-block-item';
import { ActiveExerciseModal } from './elements/active-exercise-modal';
import { ActiveBottomSheets } from './elements/active-bottom-sheets';
import { useActiveWorkoutSheets } from './hooks/use-active-workout-sheets';
import { ActiveAddExerciseButton } from './elements/active-add-exercise-button';

export const ActiveWorkoutFeature = () => {
  const { colors } = useColorScheme();
  const activeWorkout = useActiveWorkoutState();

  const {
    handleToggleSheet,
    setTypeBottomSheetRef,
    restTimeBottomSheetRef,
    blockOptionsBottomSheetRef,
    exerciseOptionsBottomSheetRef,
    restTimerSheetRef,
  } = useActiveWorkoutSheets();

  if (!activeWorkout) return null;

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ActiveWorkoutHeader />

        {/* ScrollView Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 300,
          }}
          showsVerticalScrollIndicator={false}
        >
          {activeWorkout.blocks.map((block, index) => (
            <ActiveBlockItem
              key={block.id}
              block={block}
              index={index}
              onToggleSheet={handleToggleSheet}
            />
          ))}

          <View style={{ padding: 20 }}>
            <ActiveAddExerciseButton />
          </View>
        </ScrollView>

        <ActiveExerciseModal
          blockOptionsBottomSheetRef={blockOptionsBottomSheetRef}
        />

        <ActiveBottomSheets
          setTypeBottomSheetRef={setTypeBottomSheetRef}
          restTimeBottomSheetRef={restTimeBottomSheetRef}
          blockOptionsBottomSheetRef={blockOptionsBottomSheetRef}
          exerciseOptionsBottomSheetRef={exerciseOptionsBottomSheetRef}
          restTimerSheetRef={restTimerSheetRef}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
