import { Button } from '@/components/ui';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { RoutineCard } from '../routine-card';
import { IRoutine } from '@/types/routine';
import { FolderEdit } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { getThemeColors } from '@/constants/Colors';

type Props = {
  setSelectedFolder: (folderId: string | null) => void;
  filteredRoutines: IRoutine[];
  onEditRoutine: (routine: IRoutine) => void;
  onDeleteRoutine: (routine: IRoutine) => void;
  onLongPressRoutine: (routine: IRoutine) => void;
  onEditFolder: () => void;
};

export const FoldersBody: React.FC<Props> = ({
  setSelectedFolder,
  filteredRoutines,
  onDeleteRoutine,
  onEditRoutine,
  onLongPressRoutine,
  onEditFolder,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

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
              onEdit={onEditRoutine}
              onDelete={onDeleteRoutine}
              onStart={() => {}}
              onLongPress={onLongPressRoutine}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
};
