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
    setFolderToEdit,
  } = mainStore();

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [moveRoutineModalVisible, setMoveRoutineModalVisible] = useState(false);
  const [selectedRoutineForMove, setSelectedRoutineForMove] =
    useState<IRoutine | null>(null);

  const handleCreateRoutine = () => {
    router.push('/routines/create');
  };

  const handleEditFolder = () => {
    const folderToEdit = folders.find((folder) => folder.id === selectedFolder);

    if (!folderToEdit) return;

    setFolderToEdit(folderToEdit);
    router.push('/folders/edit');
  };

  const handleDeleteRoutine = (routine: IRoutine) => {
    Alert.alert(
      'Eliminar Rutina',
      `¿Estás seguro que quieres eliminar "${routine.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteRoutine(routine.id),
        },
      ],
    );
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
      return routines.filter((routine) => routine.folderId === selectedFolder);
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
  };
};
