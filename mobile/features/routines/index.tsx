import React, { useRef } from 'react';
import { MoveRoutineModal } from './move-routine-modal';
import { RoutinesHeader } from './routines-header';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { FoldersBody } from './folders-body';
import { EmptyState } from './empty-state';
import { useHandleRoutines } from './hook';
import { DraggableList } from './draggable-list';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { RoutineOptionsBottomSheet } from './routine-options-sheet';
import { IRoutine } from '@/types/routine';

export const RoutinesFeature = () => {
  const {
    routines,
    folders,
    reorderFolders,
    selectedFolder,
    moveRoutineModalVisible,
    selectedRoutineForMove,
    handleCreateRoutine,
    handleEditFolder,
    handleDeleteRoutine,
    handleCreateFolder,
    setSelectedFolder,
    handleRoutineLongPress,
    handleMoveRoutine,
    setMoveRoutineModalVisible,
    setSelectedRoutineForMove,
    getRoutinesFiltered,
    setSelectedRoutine,
    handleStartRoutine,
    handleEditRoutine,
  } = useHandleRoutines();

  // Bottom sheet refs
  const routineOptionsBottomSheetRef = useRef<BottomSheetModal>(null);

  const filteredRoutines = getRoutinesFiltered();

  const handlePressRoutine = (routine: IRoutine | null) => {
    setSelectedRoutine(routine);
    routineOptionsBottomSheetRef.current?.present();
  };

  const handleDeleteRoutineSheet = () => {
    routineOptionsBottomSheetRef.current?.dismiss();
    handleDeleteRoutine();
  };

  const handleEditRoutineSheet = () => {
    routineOptionsBottomSheetRef.current?.dismiss();
    handleEditRoutine();
  };

  return (
    <BottomSheetModalProvider>
      <ScreenWrapper>
        <RoutinesHeader
          filteredRoutines={filteredRoutines}
          routines={routines}
          selectedFolder={selectedFolder}
        />

        {selectedFolder ? (
          <FoldersBody
            setSelectedFolder={setSelectedFolder}
            filteredRoutines={filteredRoutines}
            onLongPressRoutine={handleRoutineLongPress}
            onEditFolder={handleEditFolder}
            onPressRoutine={handlePressRoutine}
            onStartRoutine={handleStartRoutine}
          />
        ) : (
          <DraggableList
            folders={folders}
            onReorder={reorderFolders}
            filteredRoutines={filteredRoutines}
            routines={routines}
            onCreateFolder={handleCreateFolder}
            onLongPressRoutine={handleRoutineLongPress}
            setSelectedFolder={setSelectedFolder}
            onPressRoutine={handlePressRoutine}
            onStartRoutine={handleStartRoutine}
          />
        )}

        {routines.length === 0 && folders.length === 0 && (
          <EmptyState
            handleCreateRoutine={handleCreateRoutine}
            handleCreateFolder={handleCreateFolder}
          />
        )}

        <MoveRoutineModal
          visible={moveRoutineModalVisible}
          onClose={() => {
            setMoveRoutineModalVisible(false);
            setSelectedRoutineForMove(null);
          }}
          routine={selectedRoutineForMove}
          folders={folders}
          onMoveToFolder={handleMoveRoutine}
          currentFolderId={selectedRoutineForMove?.folderId}
        />

        <RoutineOptionsBottomSheet
          ref={routineOptionsBottomSheetRef}
          onDelete={handleDeleteRoutineSheet}
          onEdit={handleEditRoutineSheet}
        />
      </ScreenWrapper>
    </BottomSheetModalProvider>
  );
};
