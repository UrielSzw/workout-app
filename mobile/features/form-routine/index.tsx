import React, { useEffect } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CreateRoutineHeader } from './create-routine-header';
import { RoutineInfo } from './routine-info';
import { ExerciseList } from './exercise-list';
import { useFormRoutine } from './hook';
import { ExerciseSelectorModal } from '../../components/exercise-selector-modal';
import { SetTypeBottomSheet } from '../../components/set-type-sheet';
import { RepsTypeBottomSheet } from './reps-type-sheet';
import { RestTimeBottomSheet } from '../../components/rest-time-sheet';
import { useNavigation } from 'expo-router';
import { BlockOptionsBottomSheet } from '../../components/block-options-sheet';
import { ExerciseOptionsBottomSheet } from '@/components/exercise-options-sheet';

type Props = {
  isEditMode?: boolean;
};

export const FormRoutineFeature = ({ isEditMode }: Props) => {
  const { colors } = useColorScheme();
  const navigation = useNavigation();

  const {
    // Routine info
    routineName,
    setRoutineName,
    handleSaveRoutine,
    handleClearRoutine,

    // Blocks methods
    blocks,
    handleDeleteBlock,
    handleConvertToIndividual,
    handleUpdateBlock,
    handleReorderBlocks,
    handleAddAsIndividual,
    handleAddAsBlock,
    blockOptionsBottomSheetRef,
    handleShowBlockOptionsBottomSheet,
    exercisesLength,

    // Exercises methods
    handleReorderExercises,
    exerciseSelectorVisible,
    setExerciseSelectorVisible,
    selectedExercises,
    handleSelectExercise,
    exerciseOptionsBottomSheetRef,
    handleShowExerciseOptionsBottomSheet,
    handleDeleteExercise,
    isInMultipleExerciseBlock,
    handleShowReplaceModal,
    isReplaceMode,
    handleReplaceExercise,

    // Reps and rest time
    currentRestTime,
    handleRepsTypeSelect,
    handleBlockRestTimeSelect,
    currentSetType,
    currentRepsType,
    handleSetTypeSelect,
    handleDeleteSet,

    // Bottom sheet methods
    setTypeBottomSheetRef,
    repsTypeBottomSheetRef,
    restTimeBottomSheetRef,
    handleShowSetTypeBottomSheet,
    handleShowRepsTypeBottomSheet,
    handleShowBlockRestTimeBottomSheet,
  } = useFormRoutine({ isEditMode });

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      handleClearRoutine();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Sticky Header */}
        <CreateRoutineHeader
          onSaveRoutine={handleSaveRoutine}
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
              onShowRepsTypeBottomSheet={handleShowRepsTypeBottomSheet}
              onShowSetTypeBottomSheet={handleShowSetTypeBottomSheet}
              onShowBlockRestTimeBottomSheet={
                handleShowBlockRestTimeBottomSheet
              }
              onReorderBlocks={handleReorderBlocks}
              onReorderExercises={handleReorderExercises}
              onShowBlockOptionsBottomSheet={handleShowBlockOptionsBottomSheet}
              onShowExerciseOptionsBottomSheet={
                handleShowExerciseOptionsBottomSheet
              }
            />
          </View>

          {/* Spacer */}
          <View style={{ height: 200 }} />
        </ScrollView>

        {/* Exercise Selector Modal */}
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

        {/* Bottom Sheets */}
        <SetTypeBottomSheet
          ref={setTypeBottomSheetRef}
          onSelectSetType={handleSetTypeSelect}
          onDeleteSet={handleDeleteSet}
          currentSetType={currentSetType}
        />

        <RepsTypeBottomSheet
          ref={repsTypeBottomSheetRef}
          currentRepsType={currentRepsType}
          onSelectRepsType={handleRepsTypeSelect}
        />

        <RestTimeBottomSheet
          ref={restTimeBottomSheetRef}
          currentRestTime={currentRestTime}
          onSelectRestTime={handleBlockRestTimeSelect}
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
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
