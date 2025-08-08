import { Button, Typography } from '@/components/ui';
import { IFolder, IRoutine } from '@/types/routine';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

type Props = {
  folders: IFolder[];
  filteredRoutines: IRoutine[];
  routines: IRoutine[];
  selectedFolder: string | null;
};

export const RoutinesHeader: React.FC<Props> = ({
  filteredRoutines,
  folders,
  routines,
  selectedFolder,
}) => {
  const handleCreateRoutine = () => {
    router.push('/routines/create');
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}
    >
      <View>
        <Typography variant="h2" weight="bold">
          {selectedFolder
            ? folders.find((f) => f.id === selectedFolder)?.name
            : 'Mis Rutinas'}
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
  );
};
