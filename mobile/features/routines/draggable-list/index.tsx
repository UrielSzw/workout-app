import { IFolder, IRoutine } from '@/types/routine';
import { View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { FolderItem } from './folder-item';
import { Button, Typography } from '@/components/ui';
import { FolderPlus } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { getThemeColors } from '@/constants/Colors';
import { RoutineCard } from '../routine-card';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  folders?: IFolder[];
  routines?: IRoutine[];
  onReorder: (folders: IFolder[]) => void;
  filteredRoutines?: IRoutine[];
  onCreateFolder: () => void;
  onEditRoutine: (routine: IRoutine) => void;
  onDeleteRoutine: (routine: IRoutine) => void;
  onLongPressRoutine: (routine: IRoutine) => void;
  setSelectedFolder: Dispatch<SetStateAction<IFolder | null>>;
};

export const DraggableList: React.FC<Props> = ({
  folders,
  routines,
  onReorder,
  filteredRoutines = [],
  onCreateFolder,
  onEditRoutine,
  onDeleteRoutine,
  onLongPressRoutine,
  setSelectedFolder,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  const renderFolderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<IFolder>) => {
    const handleSelect = () => {
      setSelectedFolder(item);
    };

    const routinesCount =
      routines?.filter((routine) => routine.folderId === item.id).length || 0;

    return (
      <ScaleDecorator>
        <FolderItem
          folder={item}
          drag={drag}
          isActive={isActive}
          onSelect={handleSelect}
          routinesCount={routinesCount}
        />
      </ScaleDecorator>
    );
  };

  const handleReorder = ({ data }: { data: IFolder[] }) => {
    onReorder(data);
  };

  if (!folders || folders.length === 0) return null;

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={folders}
        onDragEnd={handleReorder}
        keyExtractor={(item) => item.id}
        renderItem={renderFolderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        activationDistance={15}
        ListHeaderComponent={() => (
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
              onPress={onCreateFolder}
              icon={<FolderPlus size={18} color={colors.primary[500]} />}
            >
              Nueva
            </Button>
          </View>
        )}
        ListFooterComponent={() => (
          <View>
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
                    onEdit={onEditRoutine}
                    onDelete={onDeleteRoutine}
                    onStart={() => {}}
                    onLongPress={onLongPressRoutine}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};
