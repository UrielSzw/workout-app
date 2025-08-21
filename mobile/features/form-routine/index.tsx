import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { CreateRoutineHeader } from './elements/create-routine-header';
import { RoutineInfo } from './elements/routine-info';
import { SheetPageWrapper } from '@/shared/layout/sheet-page-wrapper';
import { useFormRoutineSheets } from './hooks/use-form-routine-sheets';
import { BlocksList } from './elements/blocks-list';
import {
  useBlocksState,
  useEditValuesActions,
} from './hooks/use-form-routine-store';
import { BlockItem } from './elements/block-item';
import { ExerciseModal } from './elements/exercise-modal';
import { BottomSheets } from './elements/bottom-sheets';
import { useNavigation } from 'expo-router';

type Props = {
  isEditMode?: boolean;
};

export const FormRoutineFeature = ({ isEditMode }: Props) => {
  const {
    handleToggleSheet,
    setTypeBottomSheetRef,
    repsTypeBottomSheetRef,
    restTimeBottomSheetRef,
    blockOptionsBottomSheetRef,
    exerciseOptionsBottomSheetRef,
  } = useFormRoutineSheets();

  const navigation = useNavigation();
  const blocks = useBlocksState();
  const { clearRoutine } = useEditValuesActions();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      clearRoutine();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return (
    <SheetPageWrapper>
      <CreateRoutineHeader isEditMode={!!isEditMode} />

      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 20 }}>
          <RoutineInfo />

          <BlocksList blocksLength={blocks.length}>
            {blocks.map((block) => (
              <BlockItem
                key={block.id}
                block={block}
                onToggleSheet={handleToggleSheet}
              />
            ))}
          </BlocksList>
        </View>

        <View style={{ height: 200 }} />
      </ScrollView>

      <ExerciseModal />

      <BottomSheets
        blockOptionsBottomSheetRef={blockOptionsBottomSheetRef}
        exerciseOptionsBottomSheetRef={exerciseOptionsBottomSheetRef}
        restTimeBottomSheetRef={restTimeBottomSheetRef}
        repsTypeBottomSheetRef={repsTypeBottomSheetRef}
        setTypeBottomSheetRef={setTypeBottomSheetRef}
      />
    </SheetPageWrapper>
  );
};
