import React from 'react';
import { MoveRoutineModal } from './move-routine-modal';
import { RoutinesHeader } from './routines-header';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { FoldersBody } from './folders-body';
import { RoutinesBody } from './routines-body';
import { EmptyState } from './empty-state';
import { useHandleRoutines } from './hook';

export const RoutinesFeature = () => {
  const {
    routines,
    folders,
    reorderFolders,
    refreshing,
    selectedFolder,
    moveRoutineModalVisible,
    selectedRoutineForMove,
    onRefresh,
    handleCreateRoutine,
    handleEditRoutine,
    handleDeleteRoutine,
    handleCreateFolder,
    setSelectedFolder,
    handleRoutineLongPress,
    handleMoveRoutine,
    setMoveRoutineModalVisible,
    setSelectedRoutineForMove,
  } = useHandleRoutines();

  return (
    <ScreenWrapper>
      <RoutinesHeader
        filteredRoutines={[]}
        folders={folders}
        routines={routines}
        selectedFolder={selectedFolder}
      />

      {selectedFolder ? (
        <FoldersBody
          setSelectedFolder={setSelectedFolder}
          refreshing={refreshing}
          onRefresh={onRefresh}
          filteredRoutines={[]}
          onEditRoutine={handleEditRoutine}
          onDeleteRoutine={handleDeleteRoutine}
          onLongPressRoutine={handleRoutineLongPress}
        />
      ) : (
        <RoutinesBody
          refreshing={refreshing}
          onRefresh={onRefresh}
          folders={folders}
          routines={routines}
          filteredRoutines={[]}
          reorderFolders={reorderFolders}
          handleCreateFolder={handleCreateFolder}
          handleDeleteRoutine={handleDeleteRoutine}
          handleEditRoutine={handleEditRoutine}
          handleStartWorkout={() => {}}
          handleRoutineLongPress={handleRoutineLongPress}
          setSelectedFolder={setSelectedFolder}
        />
      )}

      {routines.length === 0 && folders.length === 0 && (
        <EmptyState
          refreshing={refreshing}
          onRefresh={onRefresh}
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
