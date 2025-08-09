import { Button, Typography } from '@/components/ui';
import { FolderPlus } from 'lucide-react-native';
import React from 'react';
import { Alert, RefreshControl, ScrollView, View } from 'react-native';
import { DraggableFolderList } from '../draggable-folder-list';
import { RoutineCard } from '../routine-card';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { getThemeColors } from '@/constants/Colors';
import { IFolder, IRoutine } from '@/types/routine';
import DragMock from '../draggable-list';

type Props = {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  folders: IFolder[];
  routines: IRoutine[];
  filteredRoutines?: IRoutine[];
  reorderFolders: (folders: IFolder[]) => void;
  handleCreateFolder: () => void;
  handleEditRoutine: (routine: IRoutine) => void;
  handleDeleteRoutine: (routine: IRoutine) => void;
  handleStartWorkout: (routine: IRoutine) => void;
  handleRoutineLongPress: (routine: IRoutine) => void;
  setSelectedFolder: (folderId: string | null) => void;
};

export const RoutinesBody: React.FC<Props> = ({
  refreshing,
  onRefresh,
  folders,
  routines,
  filteredRoutines,
  reorderFolders,
  handleCreateFolder,
  handleEditRoutine,
  handleDeleteRoutine,
  handleStartWorkout,
  handleRoutineLongPress,
  setSelectedFolder,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  const handleReorderFolders = (newFolders: typeof folders) => {
    reorderFolders(newFolders);
  };

  const getRoutinesInFolder = (folderId: string) => {
    return routines.filter((routine) => routine.folderId === folderId);
  };

  const handleEditFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    Alert.alert('Editar Carpeta', `Editar "${folder?.name}" (mock)`, [
      { text: 'OK' },
    ]);
  };

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    Alert.alert(
      'Eliminar Carpeta',
      `¿Estás seguro que quieres eliminar "${folder?.name}"? (mock)`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive' },
      ],
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {folders.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
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
              icon={<FolderPlus size={18} color={colors.primary[500]} />}
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
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
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
              icon={<FolderPlus size={18} color={colors.primary[500]} />}
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

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};
