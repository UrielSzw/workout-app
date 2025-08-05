import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import {
  MoreVertical,
  Plus,
  Link2,
  Unlink,
  Timer,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { Typography, Card } from "@/components/ui";
import { ExercisePlaceholderImage } from "@/components/ui/ExercisePlaceholderImage";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { Exercise } from "@/data/mockExercises";

interface SetData {
  id: string;
  setNumber: number;
  weight?: string;
  reps?: string;
  type:
    | "normal"
    | "warmup"
    | "drop"
    | "failure"
    | "cluster"
    | "rest-pause"
    | "mechanical";
  completed: boolean;
  notes?: string;
  repsType: "reps" | "range" | "time" | "distance";
  repsValue?: string;
  repsRange?: { min: string; max: string };
}

interface ExerciseData {
  id: string;
  exercise: Exercise;
  sets: SetData[];
  restTimeSeconds: number;
  notes?: string;
  blockType?: "individual" | "superset" | "circuit" | "dropset";
  blockId?: string;
}

interface ExerciseRowProps {
  exerciseData: ExerciseData;
  index: number;
  onDelete: (exerciseId: string) => void;
  onUpdate: (exerciseId: string, updatedData: Partial<ExerciseData>) => void;
  onCreateSuperset: (exerciseIds: string[]) => void;
  onBreakSuperset: (blockId: string) => void;
  onShowSetTypeBottomSheet: (setId: string, exerciseId: string) => void;
  onShowRestTimeBottomSheet: (
    exerciseId: string,
    currentRestTime: number
  ) => void;
  globalRepsType: "reps" | "range" | "time" | "distance";
  onChangeGlobalRepsType: () => void;
}

export const ExerciseRow: React.FC<ExerciseRowProps> = ({
  exerciseData,
  index,
  onDelete,
  onUpdate,
  onCreateSuperset,
  onBreakSuperset,
  onShowSetTypeBottomSheet,
  onShowRestTimeBottomSheet,
  globalRepsType,
  onChangeGlobalRepsType,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const getSetTypeLabel = (type: string) => {
    switch (type) {
      case "warmup":
        return "W";
      case "drop":
        return "D";
      case "failure":
        return "F";
      case "cluster":
        return "C";
      case "rest-pause":
        return "RP";
      case "mechanical":
        return "M";
      default:
        return "";
    }
  };

  const getSetTypeColor = (type: string) => {
    switch (type) {
      case "warmup":
        return colors.warning[500];
      case "drop":
        return colors.error[500];
      case "failure":
        return colors.error[500];
      case "cluster":
        return colors.info[500];
      case "rest-pause":
        return colors.secondary[500];
      case "mechanical":
        return colors.success[500];
      default:
        return colors.primary[500];
    }
  };

  const getBlockTypeInfo = () => {
    if (!exerciseData.blockType || exerciseData.blockType === "individual") {
      return null;
    }

    const labels = {
      superset: "Superserie",
      circuit: "Circuito",
      dropset: "Drop Set",
    };

    return {
      label: labels[exerciseData.blockType] || exerciseData.blockType,
      color: colors.primary[500],
    };
  };

  const addSet = () => {
    const newSet: SetData = {
      id: Date.now().toString() + Math.random(),
      setNumber: exerciseData.sets.length + 1,
      weight:
        exerciseData.sets.length > 0
          ? exerciseData.sets[exerciseData.sets.length - 1].weight
          : "",
      reps:
        exerciseData.sets.length > 0
          ? exerciseData.sets[exerciseData.sets.length - 1].reps
          : "",
      type: "normal",
      completed: false,
      repsType: "reps",
    };

    onUpdate(exerciseData.id, {
      sets: [...exerciseData.sets, newSet],
    });
  };

  const updateSet = (setId: string, updates: Partial<SetData>) => {
    const updatedSets = exerciseData.sets.map((set) =>
      set.id === setId ? { ...set, ...updates } : set
    );
    onUpdate(exerciseData.id, { sets: updatedSets });
  };

  const getRepsColumnTitle = () => {
    switch (globalRepsType) {
      case "reps":
        return "REPS";
      case "range":
        return "RANGO";
      case "time":
        return "TIEMPO";
      case "distance":
        return "DIST";
      default:
        return "REPS";
    }
  };

  const formatRestTime = (seconds: number) => {
    if (seconds === 0) return "Sin descanso";
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0
      ? `${mins}:${secs.toString().padStart(2, "0")} min`
      : `${mins} min`;
  };

  const blockInfo = getBlockTypeInfo();

  return (
    <Card variant="outlined" padding="none">
      {/* Block Type Header */}
      {blockInfo && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: blockInfo.color + "20",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Link2 size={16} color={blockInfo.color} />
            <Typography
              variant="caption"
              weight="medium"
              style={{ color: blockInfo.color }}
            >
              {blockInfo.label}
            </Typography>
          </View>

          {exerciseData.blockId && (
            <TouchableOpacity
              onPress={() => onBreakSuperset(exerciseData.blockId!)}
              style={{ padding: 4 }}
            >
              <Unlink size={14} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Exercise Header */}
      <View style={{ padding: 16 }}>
        <View
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}
        >
          <ExercisePlaceholderImage size={48} />

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Typography
                  variant="body1"
                  weight="semibold"
                  style={{ flex: 1 }}
                >
                  {index + 1}. {exerciseData.exercise.name}
                </Typography>

                <TouchableOpacity
                  onPress={() => setIsExpanded(!isExpanded)}
                  style={{ padding: 4 }}
                >
                  {isExpanded ? (
                    <ChevronUp size={16} color={colors.textMuted} />
                  ) : (
                    <ChevronDown size={16} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setShowMenu(!showMenu)}
                style={{ padding: 8, marginLeft: 8 }}
              >
                <MoreVertical size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <Typography
                variant="caption"
                color="textMuted"
                style={{ flex: 1 }}
              >
                {exerciseData.exercise.muscleGroups.join(", ")}
              </Typography>
            </View>

            {/* Rest Time Row */}
            <TouchableOpacity
              onPress={() =>
                onShowRestTimeBottomSheet(
                  exerciseData.id,
                  exerciseData.restTimeSeconds
                )
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: colors.primary[500] + "15",
                borderRadius: 8,
                alignSelf: "flex-start",
                borderWidth: 1,
                borderColor: colors.primary[500] + "30",
              }}
            >
              <Timer size={16} color={colors.primary[500]} />
              <Typography
                variant="body2"
                weight="medium"
                style={{
                  color: colors.primary[500],
                  marginLeft: 8,
                }}
              >
                {formatRestTime(exerciseData.restTimeSeconds)}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options */}
        {showMenu && (
          <View
            style={{
              position: "absolute",
              top: 60,
              right: 16,
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
              zIndex: 1000,
              minWidth: 150,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                // onCreateSuperset([exerciseData.id]); // For future implementation
              }}
              style={{ paddingVertical: 8, paddingHorizontal: 12 }}
            >
              <Typography variant="body2">Crear Superserie</Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                onDelete(exerciseData.id);
              }}
              style={{ paddingVertical: 8, paddingHorizontal: 12 }}
            >
              <Typography variant="body2" style={{ color: colors.error[500] }}>
                Eliminar Ejercicio
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Sets Table */}
      {isExpanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          {/* Table Headers */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              marginBottom: 8,
            }}
          >
            <View style={{ width: 50 }}>
              <Typography variant="caption" weight="medium" color="textMuted">
                SET
              </Typography>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
              <Typography variant="caption" weight="medium" color="textMuted">
                KG
              </Typography>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
              <TouchableOpacity
                onPress={onChangeGlobalRepsType}
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Typography variant="caption" weight="medium" color="textMuted">
                  {getRepsColumnTitle()}
                </Typography>
                <ChevronDown size={12} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Set Rows */}
          {exerciseData.sets.map((set, setIndex) => (
            <View
              key={set.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 8,
                backgroundColor: set.completed
                  ? colors.primary[500] + "10"
                  : "transparent",
                borderRadius: 4,
                marginBottom: 4,
              }}
            >
              {/* Set Number - Now clickable for bottom sheet */}
              <View style={{ width: 50, alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() =>
                    onShowSetTypeBottomSheet(set.id, exerciseData.id)
                  }
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor:
                      set.type !== "normal"
                        ? getSetTypeColor(set.type)
                        : colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    weight="medium"
                    style={{
                      color: set.type !== "normal" ? "white" : colors.text,
                    }}
                  >
                    {getSetTypeLabel(set.type) || setIndex + 1}
                  </Typography>
                </TouchableOpacity>
              </View>

              {/* Weight Input */}
              <View style={{ flex: 1, paddingHorizontal: 8 }}>
                <TextInput
                  value={set.weight}
                  onChangeText={(value) => updateSet(set.id, { weight: value })}
                  placeholder="0"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    textAlign: "center",
                    color: colors.text,
                  }}
                />
              </View>

              {/* Reps Input - Now normal input based on global type */}
              <View style={{ flex: 1, paddingHorizontal: 8 }}>
                {globalRepsType === "reps" && (
                  <TextInput
                    value={set.reps}
                    onChangeText={(value) => updateSet(set.id, { reps: value })}
                    placeholder="0"
                    keyboardType="numeric"
                    style={{
                      backgroundColor: colors.background,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 4,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      textAlign: "center",
                      color: colors.text,
                    }}
                  />
                )}

                {globalRepsType === "time" && (
                  <TextInput
                    value={set.repsValue}
                    onChangeText={(value) =>
                      updateSet(set.id, { repsValue: value })
                    }
                    placeholder="30s"
                    keyboardType="numeric"
                    style={{
                      backgroundColor: colors.background,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 4,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      textAlign: "center",
                      color: colors.text,
                    }}
                  />
                )}

                {globalRepsType === "distance" && (
                  <TextInput
                    value={set.repsValue}
                    onChangeText={(value) =>
                      updateSet(set.id, { repsValue: value })
                    }
                    placeholder="5km"
                    keyboardType="numeric"
                    style={{
                      backgroundColor: colors.background,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 4,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      textAlign: "center",
                      color: colors.text,
                    }}
                  />
                )}

                {globalRepsType === "range" && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      value={set.repsRange?.min || ""}
                      onChangeText={(value) =>
                        updateSet(set.id, {
                          repsRange: {
                            min: value,
                            max: set.repsRange?.max || "10",
                          },
                        })
                      }
                      placeholder="6"
                      keyboardType="numeric"
                      style={{
                        flex: 1,
                        backgroundColor: colors.background,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 4,
                        paddingHorizontal: 4,
                        paddingVertical: 6,
                        textAlign: "center",
                        color: colors.text,
                      }}
                    />
                    <Typography variant="caption" color="textMuted">
                      -
                    </Typography>
                    <TextInput
                      value={set.repsRange?.max || ""}
                      onChangeText={(value) =>
                        updateSet(set.id, {
                          repsRange: {
                            min: set.repsRange?.min || "6",
                            max: value,
                          },
                        })
                      }
                      placeholder="10"
                      keyboardType="numeric"
                      style={{
                        flex: 1,
                        backgroundColor: colors.background,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 4,
                        paddingHorizontal: 4,
                        paddingVertical: 6,
                        textAlign: "center",
                        color: colors.text,
                      }}
                    />
                  </View>
                )}
              </View>
            </View>
          ))}

          {/* Add Set Button */}
          <TouchableOpacity
            onPress={addSet}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 12,
              marginTop: 8,
              borderWidth: 1,
              borderColor: colors.border,
              borderStyle: "dashed",
              borderRadius: 4,
            }}
          >
            <Plus size={16} color={colors.primary[500]} />
            <Typography
              variant="body2"
              weight="medium"
              style={{ color: colors.primary[500], marginLeft: 8 }}
            >
              Agregar Serie
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};
