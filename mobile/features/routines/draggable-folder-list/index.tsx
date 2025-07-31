import React from "react";
import { View, Text } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Move } from "lucide-react-native";
import { Folder } from "@/store/useAppStore";
import { FolderCard } from "../folder-card";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

interface DraggableFolderProps {
  folder: Folder;
  routines: any[];
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
  isDragging: boolean;
  draggedIndex: number;
  hoveredIndex: number;
  onDragStart: (index: number) => void;
  onDragEnd: (fromIndex: number, toIndex: number) => void;
  onDragUpdate: (index: number) => void;
  onDragStop: () => void;
}

const ITEM_HEIGHT = 100;

export const DraggableFolder = ({
  folder,
  routines,
  onPress,
  onEdit,
  onDelete,
  index,
  isDragging,
  draggedIndex,
  hoveredIndex,
  onDragStart,
  onDragEnd,
  onDragUpdate,
  onDragStop,
}: DraggableFolderProps) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const isBeingDragged = draggedIndex === index;
  const shouldMove =
    isDragging &&
    !isBeingDragged &&
    ((draggedIndex < index && hoveredIndex >= index) ||
      (draggedIndex > index && hoveredIndex <= index));

  // Animated style for the dragged item
  const animatedStyle = useAnimatedStyle(() => {
    let targetOffsetY = 0;

    if (isBeingDragged) {
      // Item being dragged
      return {
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
        opacity: opacity.value,
        zIndex: 1000,
        elevation: 10,
      };
    } else if (shouldMove) {
      // Items that need to move to make space
      targetOffsetY = draggedIndex < index ? -ITEM_HEIGHT : ITEM_HEIGHT;
    }

    return {
      transform: [
        {
          translateY: withSpring(targetOffsetY, {
            damping: 20,
            stiffness: 300,
          }),
        },
      ],
      zIndex: 1,
    };
  });

  // Pan gesture with long press activation
  const panGesture = Gesture.Pan()
    .activateAfterLongPress(500) // 500ms long press to activate
    .onStart(() => {
      // Gesture activated after long press
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      runOnJS(onDragStart)(index);
      scale.value = withSpring(1.05);
      opacity.value = withSpring(0.9);
    })
    .onUpdate((event) => {
      // Update position while dragging
      translateY.value = event.translationY;

      // Calculate which position we're hovering over
      const newHoveredIndex = Math.round(
        index + event.translationY / ITEM_HEIGHT
      );
      runOnJS(onDragUpdate)(Math.max(0, newHoveredIndex));
    })
    .onEnd((event) => {
      // Calculate final position
      const moveDistance = event.translationY;
      const numberOfPositions = Math.round(moveDistance / ITEM_HEIGHT);
      const newIndex = Math.max(0, index + numberOfPositions);

      if (numberOfPositions !== 0) {
        runOnJS(onDragEnd)(index, newIndex);
        runOnJS(Haptics.notificationAsync)(
          Haptics.NotificationFeedbackType.Success
        );
      }

      // Reset animations
      translateY.value = withSpring(0, {
        damping: 60,
        stiffness: 80,
      });
      scale.value = withSpring(1, {
        damping: 60,
        stiffness: 80,
      });
      opacity.value = withSpring(1, {
        damping: 60,
        stiffness: 80,
      });
      runOnJS(onDragStop)();
    });

  // Simple tap gesture for normal press
  const tapGesture = Gesture.Tap().onStart(() => {
    if (!isDragging) {
      runOnJS(onPress)();
    }
  });

  // Combine gestures - tap will only work when pan is not active
  const combinedGesture = Gesture.Exclusive(panGesture, tapGesture);

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={[{ marginBottom: 0 }, animatedStyle]}>
        <View style={{ position: "relative" }}>
          <FolderCard
            folder={folder}
            routines={routines}
            onPress={() => {}} // Handled by gesture
            onEdit={onEdit}
            onDelete={onDelete}
          />

          {/* Drag indicator when being dragged */}
          {isBeingDragged && (
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: colors.primary[500],
                borderRadius: 16,
                padding: 6,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Move size={14} color="#ffffff" />
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                Arrastrando
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

interface DraggableFolderListProps {
  folders: Folder[];
  getRoutinesInFolder: (folderId: string) => any[];
  onFolderPress: (folderId: string) => void;
  onEditFolder: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onReorderFolders: (folders: Folder[]) => void;
}

export const DraggableFolderList = ({
  folders,
  getRoutinesInFolder,
  onFolderPress,
  onEditFolder,
  onDeleteFolder,
  onReorderFolders,
}: DraggableFolderListProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [draggedIndex, setDraggedIndex] = React.useState(-1);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);

  const handleDragStart = (index: number) => {
    setIsDragging(true);
    setDraggedIndex(index);
    setHoveredIndex(index);
  };

  const handleDragUpdate = (newHoveredIndex: number) => {
    const clampedIndex = Math.max(
      0,
      Math.min(newHoveredIndex, folders.length - 1)
    );
    setHoveredIndex(clampedIndex);
  };

  const handleDragEnd = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const clampedToIndex = Math.max(0, Math.min(toIndex, folders.length - 1));

    const reorderedFolders = [...folders];
    const [movedFolder] = reorderedFolders.splice(fromIndex, 1);
    reorderedFolders.splice(clampedToIndex, 0, movedFolder);

    onReorderFolders(reorderedFolders);
  };

  const handleDragStop = () => {
    setIsDragging(false);
    setDraggedIndex(-1);
    setHoveredIndex(-1);
  };

  const handleFolderPress = (folderId: string) => {
    if (!isDragging) {
      onFolderPress(folderId);
    }
  };

  return (
    <View>
      {folders.map((folder, index) => (
        <DraggableFolder
          key={folder.id}
          folder={folder}
          routines={getRoutinesInFolder(folder.id)}
          onPress={() => handleFolderPress(folder.id)}
          onEdit={() => onEditFolder(folder.id)}
          onDelete={() => onDeleteFolder(folder.id)}
          index={index}
          isDragging={isDragging}
          draggedIndex={draggedIndex}
          hoveredIndex={hoveredIndex}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragUpdate={handleDragUpdate}
          onDragStop={handleDragStop}
        />
      ))}
    </View>
  );
};
