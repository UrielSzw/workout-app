import { activeWorkoutStore } from '@/store/active-workout-store';
import { mainStore } from '@/store/main-store';
import { IRoutine } from '@/types/routine';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useHandleRoutines = () => {
  const {
    routines,
    folders,
    deleteRoutine,
    setRoutines,
    setFolders,
    reorderFolders,
    moveRoutineToFolder,
    selectedFolder,
    setSelectedFolder,
    setSelectedRoutine,
    selectedRoutine,
  } = mainStore();

  const { startWorkout } = activeWorkoutStore();

  const [moveRoutineModalVisible, setMoveRoutineModalVisible] = useState(false);
  const [selectedRoutineForMove, setSelectedRoutineForMove] =
    useState<IRoutine | null>(null);

  const handleCreateRoutine = () => {
    router.push('/routines/create');
  };

  const handleEditRoutine = () => {
    if (!selectedRoutine) return;

    router.push(`/routines/edit`);
  };

  const handleEditFolder = () => {
    if (!selectedFolder) return;

    router.push('/folders/edit');
  };

  const handleDeleteRoutine = () => {
    if (!selectedRoutine) return;

    Alert.alert(
      'Eliminar Rutina',
      `¿Estás seguro que quieres eliminar "${selectedRoutine.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteRoutine(selectedRoutine.id);
            setSelectedRoutine(null);
          },
        },
      ],
    );
  };

  const handleStartRoutine = (routine: IRoutine) => {
    startWorkout(routine);
    router.push('/workout/active');
  };

  const handleCreateFolder = () => {
    router.push('/folders/create');
  };

  const handleRoutineLongPress = (routine: IRoutine) => {
    setSelectedRoutineForMove(routine);
    setMoveRoutineModalVisible(true);
  };

  const handleMoveRoutine = (routineId: string, folderId?: string) => {
    moveRoutineToFolder(routineId, folderId);
  };

  const getRoutinesFiltered = () => {
    if (selectedFolder) {
      return routines.filter(
        (routine) => routine.folderId === selectedFolder.id,
      );
    }

    return routines.filter((routine) => !routine.folderId);
  };

  return {
    routines,
    folders,
    deleteRoutine,
    setRoutines,
    setFolders,
    reorderFolders,
    moveRoutineToFolder,
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
    selectedRoutine,
    handleStartRoutine,
    handleEditRoutine,
  };
};
