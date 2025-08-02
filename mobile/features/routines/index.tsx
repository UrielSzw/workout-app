import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useAppStore, Routine } from "@/store/useAppStore";
import { mockApi } from "@/data/mockData";
import { MoveRoutineModal } from "./move-routine-modal";
import { RoutinesHeader } from "./routines-header";
import { ScreenWrapper } from "@/components/ui/screen-wrapper";
import { FoldersBody } from "./folders-body";
import { RoutinesBody } from "./routines-body";
import { EmptyState } from "./empty-state";

export const RoutinesFeature = () => {
  const {
    routines,
    folders,
    deleteRoutine,
    startWorkout,
    setRoutines,
    setFolders,
    reorderFolders,
    moveRoutineToFolder,
  } = useAppStore();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [moveRoutineModalVisible, setMoveRoutineModalVisible] = useState(false);
  const [selectedRoutineForMove, setSelectedRoutineForMove] =
    useState<Routine | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [routinesData, foldersData] = await Promise.all([
          mockApi.getRoutines(),
          mockApi.getFolders(),
        ]);
        setRoutines(routinesData);
        setFolders(foldersData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [setRoutines, setFolders]);

  const loadInitialData = async () => {
    try {
      const [routinesData, foldersData] = await Promise.all([
        mockApi.getRoutines(),
        mockApi.getFolders(),
      ]);
      setRoutines(routinesData);
      setFolders(foldersData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleCreateRoutine = () => {
    router.push("/routines/create");
  };

  const handleEditRoutine = (routine: Routine) => {
    // Comentado hasta que exista la ruta de editar
    // router.push(`/routines/edit/${routine.id}`);
    console.log("Editar rutina:", routine.id);
  };

  const handleDeleteRoutine = (routine: Routine) => {
    Alert.alert(
      "Eliminar Rutina",
      `¿Estás seguro que quieres eliminar "${routine.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteRoutine(routine.id),
        },
      ]
    );
  };

  const handleStartWorkout = (routine: Routine) => {
    startWorkout(routine);
    router.push("/workout/active");
  };

  // Funciones para manejar carpetas
  const handleCreateFolder = () => {
    router.push("/folders/create");
  };

  const handleRoutineLongPress = (routine: Routine) => {
    setSelectedRoutineForMove(routine);
    setMoveRoutineModalVisible(true);
  };

  const handleMoveRoutine = (routineId: string, folderId?: string) => {
    moveRoutineToFolder(routineId, folderId);
  };

  const getFilteredRoutines = () => {
    if (selectedFolder) {
      return routines.filter((routine) => routine.folderId === selectedFolder);
    }
    return routines.filter((routine) => !routine.folderId);
  };

  const filteredRoutines = getFilteredRoutines();

  return (
    <ScreenWrapper>
      <RoutinesHeader
        filteredRoutines={filteredRoutines}
        folders={folders}
        routines={routines}
        selectedFolder={selectedFolder}
      />

      {selectedFolder ? (
        <FoldersBody
          setSelectedFolder={setSelectedFolder}
          refreshing={refreshing}
          onRefresh={onRefresh}
          filteredRoutines={filteredRoutines}
          onEditRoutine={handleEditRoutine}
          onDeleteRoutine={handleDeleteRoutine}
          onStartWorkout={handleStartWorkout}
          onLongPressRoutine={handleRoutineLongPress}
        />
      ) : (
        <RoutinesBody
          refreshing={refreshing}
          onRefresh={onRefresh}
          folders={folders}
          routines={routines}
          filteredRoutines={filteredRoutines}
          reorderFolders={reorderFolders}
          handleCreateFolder={handleCreateFolder}
          handleDeleteRoutine={handleDeleteRoutine}
          handleEditRoutine={handleEditRoutine}
          handleStartWorkout={handleStartWorkout}
          handleRoutineLongPress={handleRoutineLongPress}
          setSelectedFolder={setSelectedFolder}
        />
      )}

      {filteredRoutines.length === 0 && folders.length === 0 && (
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
