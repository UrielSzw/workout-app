import { Button } from '@/components/ui';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { RoutineCard } from '../routine-card';
import { IFolder, IRoutine } from '@/types/routine';
import { FolderEdit } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  setSelectedFolder: (folder: IFolder | null) => void;
  filteredRoutines: IRoutine[];
  onLongPressRoutine: (routine: IRoutine) => void;
  onEditFolder: () => void;
  onPressRoutine: (routine: IRoutine | null) => void;
};

export const FoldersBody: React.FC<Props> = ({
  setSelectedFolder,
  filteredRoutines,
  onLongPressRoutine,
  onEditFolder,
  onPressRoutine,
}) => {
  const { colors } = useColorScheme();

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onPress={() => setSelectedFolder(null)}
        >
          ← Volver a carpetas
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onPress={onEditFolder}
          icon={<FolderEdit size={18} color={colors.primary[500]} />}
        >
          Editar
        </Button>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 24 }}>
          {filteredRoutines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onStart={() => {}}
              onPress={onPressRoutine}
              onLongPress={onLongPressRoutine}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
};
