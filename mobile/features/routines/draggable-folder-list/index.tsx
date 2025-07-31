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
  onDragEnd: (fromIndex: number, toIndex: number) => void;
  index: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragStop: () => void;
  isReady: boolean;
  onLongPress: () => void;
}

const ITEM_HEIGHT = 100; // Approximate height of a folder card

export const DraggableFolder = ({
  folder,
  routines,
  onPress,
  onEdit,
  onDelete,
  onDragEnd,
  index,
  isDragging,
  onDragStart,
  onDragStop,
  isReady,
  onLongPress,
}: DraggableFolderProps) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
    zIndex: isDragging ? 1000 : 1,
    elevation: isDragging ? 8 : isReady ? 4 : 0, // Android shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: isDragging ? 8 : isReady ? 4 : 0,
    },
    shadowOpacity: isDragging ? 0.3 : isReady ? 0.15 : 0,
    shadowRadius: isDragging ? 12 : isReady ? 6 : 0,
  }));

  // Pan gesture that becomes drag after long press
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Start the long press timer
    })
    .onUpdate((event) => {
      // Only drag if ready state is active
      if (isReady) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (isReady) {
        const moveDistance = event.translationY;
        const numberOfPositions = Math.round(moveDistance / ITEM_HEIGHT);
        const newIndex = Math.max(0, Math.min(index + numberOfPositions, 999));

        if (numberOfPositions !== 0) {
          runOnJS(onDragEnd)(index, newIndex);
          runOnJS(Haptics.notificationAsync)(
            Haptics.NotificationFeedbackType.Success
          );
        }

        runOnJS(onDragStop)();
      }

      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      opacity.value = withSpring(1);
    });

  // Long press gesture that activates drag mode
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      runOnJS(onLongPress)();
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      scale.value = withSpring(1.05);
      opacity.value = withSpring(0.8);
      runOnJS(onDragStart)();
    });

  // Tap gesture for normal press (when not ready)
  const tapGesture = Gesture.Tap()
    .enabled(!isReady)
    .onStart(() => {
      runOnJS(onPress)();
    });

  // Combine gestures - simultaneous long press and pan
  const combinedGesture = Gesture.Simultaneous(
    longPressGesture,
    Gesture.Exclusive(panGesture, tapGesture)
  );

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={animatedStyle}>
        <View style={{ position: "relative" }}>
          <FolderCard
            folder={folder}
            routines={routines}
            onPress={() => {}} // Handled by gesture
            onEdit={onEdit}
            onDelete={onDelete}
          />

          {/* Ready to drag indicator */}
          {isReady && (
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
                shadowOpacity: 0.2,
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
                Arrastra
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
  const [readyFolderId, setReadyFolderId] = React.useState<string | null>(null);

  const handleDragEnd = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const reorderedFolders = [...folders];
    const [movedFolder] = reorderedFolders.splice(fromIndex, 1);
    reorderedFolders.splice(toIndex, 0, movedFolder);

    onReorderFolders(reorderedFolders);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = () => {
    setIsDragging(false);
    setReadyFolderId(null); // Reset ready state after drag
  };

  const handleLongPress = (folderId: string) => {
    setReadyFolderId(folderId);

    // Auto-cancel ready state after 5 seconds
    setTimeout(() => {
      setReadyFolderId((current) => (current === folderId ? null : current));
    }, 2000);
  };

  const handleFolderPress = (folderId: string) => {
    // Only allow normal press if not in ready state
    if (!readyFolderId) {
      onFolderPress(folderId);
    } else {
      // Cancel ready state if tapping another folder
      setReadyFolderId(null);
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
          onDragEnd={handleDragEnd}
          index={index}
          isDragging={isDragging}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          isReady={readyFolderId === folder.id}
          onLongPress={() => handleLongPress(folder.id)}
        />
      ))}
    </View>
  );
};
