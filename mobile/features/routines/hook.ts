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
  } = mainStore();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [moveRoutineModalVisible, setMoveRoutineModalVisible] = useState(false);
  const [selectedRoutineForMove, setSelectedRoutineForMove] =
    useState<IRoutine | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    // await refetch();
    setRefreshing(false);
  };

  const handleCreateRoutine = () => {
    router.push('/routines/create');
  };

  const handleEditRoutine = (routine: IRoutine) => {
    console.log('Editar rutina:', routine.id);
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

  return {
    routines,
    folders,
    deleteRoutine,
    setRoutines,
    setFolders,
    reorderFolders,
    moveRoutineToFolder,
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
  };
};
