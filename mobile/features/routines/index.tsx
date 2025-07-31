import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Plus, Folder, FolderPlus } from "lucide-react-native";

import { Typography, Button } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { useAppStore, Routine } from "@/store/useAppStore";
import { mockApi } from "@/data/mockData";
import { RoutineCard } from "./routine-card";
import { DraggableFolderList } from "./draggable-folder-list";
import { MoveRoutineModal } from "./move-routine-modal";

export const RoutinesFeature = () => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");
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

  const handleEditFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    Alert.alert("Editar Carpeta", `Editar "${folder?.name}" (mock)`, [
      { text: "OK" },
    ]);
  };

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    Alert.alert(
      "Eliminar Carpeta",
      `¿Estás seguro que quieres eliminar "${folder?.name}"? (mock)`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive" },
      ]
    );
  };

  const handleRoutineLongPress = (routine: Routine) => {
    setSelectedRoutineForMove(routine);
    setMoveRoutineModalVisible(true);
  };

  const handleMoveRoutine = (routineId: string, folderId?: string) => {
    moveRoutineToFolder(routineId, folderId);
  };

  const handleReorderFolders = (newFolders: typeof folders) => {
    reorderFolders(newFolders);
  };

  const getFilteredRoutines = () => {
    if (selectedFolder) {
      return routines.filter((routine) => routine.folderId === selectedFolder);
    }
    return routines.filter((routine) => !routine.folderId);
  };

  const getRoutinesInFolder = (folderId: string) => {
    return routines.filter((routine) => routine.folderId === folderId);
  };

  const filteredRoutines = getFilteredRoutines();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <View>
            <Typography variant="h2" weight="bold">
              {selectedFolder
                ? folders.find((f) => f.id === selectedFolder)?.name
                : "Mis Rutinas"}
            </Typography>
            <Typography variant="body2" color="textMuted">
              {selectedFolder
                ? `${filteredRoutines.length} rutinas en esta carpeta`
                : `${routines.length} rutinas totales`}
            </Typography>
          </View>

          <Button
            variant="primary"
            size="sm"
            onPress={handleCreateRoutine}
            icon={<Plus size={20} color="#ffffff" />}
          />
        </View>

        {/* Back to folders button */}
        {selectedFolder && (
          <Button
            variant="ghost"
            size="sm"
            onPress={() => setSelectedFolder(null)}
            style={{ alignSelf: "flex-start", marginBottom: 16 }}
          >
            ← Volver a carpetas
          </Button>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {!selectedFolder ? (
            <>
              {/* Folders Section */}
              {folders.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Typography variant="h5" weight="semibold">
                      Carpetas
                    </Typography>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={handleCreateFolder}
                      icon={
                        <FolderPlus size={18} color={colors.primary[500]} />
                      }
                    >
                      Nueva
                    </Button>
                  </View>
                  <DraggableFolderList
                    folders={folders}
                    getRoutinesInFolder={getRoutinesInFolder}
                    onFolderPress={setSelectedFolder}
                    onEditFolder={handleEditFolder}
                    onDeleteFolder={handleDeleteFolder}
                    onReorderFolders={handleReorderFolders}
                  />
                </View>
              )}

              {/* Create First Folder */}
              {folders.length === 0 && routines.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Typography variant="h5" weight="semibold">
                      Carpetas
                    </Typography>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={handleCreateFolder}
                      icon={
                        <FolderPlus size={18} color={colors.primary[500]} />
                      }
                    >
                      Nueva Carpeta
                    </Button>
                  </View>
                </View>
              )}

              {/* Root Routines Section */}
              {filteredRoutines.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <Typography
                    variant="h5"
                    weight="semibold"
                    style={{ marginBottom: 16 }}
                  >
                    Rutinas
                  </Typography>
                  {filteredRoutines.map((routine) => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      onEdit={handleEditRoutine}
                      onDelete={handleDeleteRoutine}
                      onStart={handleStartWorkout}
                      onLongPress={handleRoutineLongPress}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            /* Folder Contents */
            <View style={{ marginBottom: 24 }}>
              {filteredRoutines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  onEdit={handleEditRoutine}
                  onDelete={handleDeleteRoutine}
                  onStart={handleStartWorkout}
                  onLongPress={handleRoutineLongPress}
                />
              ))}
            </View>
          )}

          {/* Empty State */}
          {filteredRoutines.length === 0 && folders.length === 0 && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 60,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.gray[100],
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <Folder size={32} color={colors.textMuted} />
              </View>

              <Typography
                variant="h6"
                weight="semibold"
                style={{ marginBottom: 8 }}
              >
                No tienes rutinas aún
              </Typography>

              <Typography
                variant="body2"
                color="textMuted"
                align="center"
                style={{ marginBottom: 24 }}
              >
                Crea tu primera rutina para empezar a entrenar
              </Typography>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <Button variant="primary" onPress={handleCreateRoutine}>
                  Crear Primera Rutina
                </Button>
                <Button variant="outline" onPress={handleCreateFolder}>
                  Crear Carpeta
                </Button>
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* Move Routine Modal */}
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
    </SafeAreaView>
  );
};
