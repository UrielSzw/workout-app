import { Button } from "@/components/ui";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { RoutineCard } from "../routine-card";
import { Routine } from "@/store/useAppStore";

type Props = {
  setSelectedFolder: (folderId: string | null) => void;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  filteredRoutines: Routine[];
  onEditRoutine: (routine: Routine) => void;
  onDeleteRoutine: (routine: Routine) => void;
  onStartWorkout: (routine: Routine) => void;
  onLongPressRoutine: (routine: Routine) => void;
};

export const FoldersBody: React.FC<Props> = ({
  setSelectedFolder,
  refreshing,
  onRefresh,
  filteredRoutines,
  onDeleteRoutine,
  onEditRoutine,
  onLongPressRoutine,
  onStartWorkout,
}) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onPress={() => setSelectedFolder(null)}
        style={{ alignSelf: "flex-start", marginBottom: 16 }}
      >
        ← Volver a carpetas
      </Button>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ marginBottom: 24 }}>
          {filteredRoutines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onEdit={onEditRoutine}
              onDelete={onDeleteRoutine}
              onStart={onStartWorkout}
              onLongPress={onLongPressRoutine}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
};
