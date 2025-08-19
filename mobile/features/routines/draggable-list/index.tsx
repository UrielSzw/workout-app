import { IFolder, IRoutine } from '@/types/routine';
import { View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { FolderItem } from './folder-item';
import { Button, Typography } from '@/components/ui';
import { FolderPlus } from 'lucide-react-native';
import { RoutineCard } from '../routine-card';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  folders?: IFolder[];
  routines?: IRoutine[];
  onReorder: (folders: IFolder[]) => void;
  filteredRoutines?: IRoutine[];
  onCreateFolder: () => void;
  onLongPressRoutine: (routine: IRoutine) => void;
  setSelectedFolder: (folder: IFolder | null) => void;
  onPressRoutine: (routine: IRoutine | null) => void;
  onStartRoutine: (routine: IRoutine) => void;
};

export const DraggableList: React.FC<Props> = ({
  folders,
  routines,
  onReorder,
  filteredRoutines = [],
  onCreateFolder,
  onLongPressRoutine,
  setSelectedFolder,
  onPressRoutine,
  onStartRoutine,
}) => {
  const { colors } = useColorScheme();

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

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={folders || []}
        onDragEnd={handleReorder}
        keyExtractor={(item) => item.id}
        renderItem={renderFolderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ minHeight: '100%' }}
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
            {!folders ||
              (folders?.length === 0 && (
                <View
                  style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}
                >
                  <Typography variant="body2" color="textSecondary">
                    No hay carpetas. Toca &quot;Nueva&quot; para crear una.
                  </Typography>
                </View>
              ))}

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
                    onStart={onStartRoutine}
                    onLongPress={onLongPressRoutine}
                    onPress={onPressRoutine}
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
