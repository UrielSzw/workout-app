import React from 'react';
import { MoveRoutineModal } from './move-routine-modal';
import { RoutinesHeader } from './routines-header';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { FoldersBody } from './folders-body';
import { EmptyState } from './empty-state';
import { useHandleRoutines } from './hook';
import { DraggableList } from './draggable-list';

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
  } = useHandleRoutines();

  const filteredRoutines = getRoutinesFiltered();

  return (
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
          onEditRoutine={() => {}}
          onDeleteRoutine={handleDeleteRoutine}
          onLongPressRoutine={handleRoutineLongPress}
          onEditFolder={handleEditFolder}
        />
      ) : (
        <DraggableList
          folders={folders}
          onReorder={reorderFolders}
          filteredRoutines={filteredRoutines}
          routines={routines}
          onCreateFolder={handleCreateFolder}
          onEditRoutine={() => {}}
          onDeleteRoutine={handleDeleteRoutine}
          onLongPressRoutine={handleRoutineLongPress}
          setSelectedFolder={setSelectedFolder}
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
    </ScreenWrapper>
  );
};
