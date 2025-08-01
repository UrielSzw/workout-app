import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import {
  MoreVertical,
  Plus,
  Link2,
  Timer,
  ChevronDown,
  ChevronUp,
  Trash2,
  Split,
  RotateCcw,
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

interface ExerciseInBlock {
  id: string;
  exercise: Exercise;
  sets: SetData[];
  orderIndex: number;
  notes?: string;
}

interface BlockData {
  id: string;
  type: "individual" | "superset" | "circuit";
  orderIndex: number;
  exercises: ExerciseInBlock[];
  restTimeSeconds: number;
  restBetweenExercisesSeconds: number;
  name?: string;
}

interface BlockRowProps {
  blockData: BlockData;
  index: number;
  onDeleteBlock: (blockId: string) => void;
  onConvertToIndividual: (blockId: string) => void;
  onUpdateBlock: (blockId: string, updatedData: Partial<BlockData>) => void;
  onShowSetTypeBottomSheet: (setId: string, exerciseId: string) => void;
  onShowRestTimeBottomSheet: (
    blockId: string,
    currentRestTime: number,
    type: "between-rounds" | "between-exercises"
  ) => void;
  globalRepsType: "reps" | "range" | "time" | "distance";
  onChangeGlobalRepsType: () => void;
}

export const BlockRow: React.FC<BlockRowProps> = ({
  blockData,
  index,
  onDeleteBlock,
  onConvertToIndividual,
  onUpdateBlock,
  onShowSetTypeBottomSheet,
  onShowRestTimeBottomSheet,
  globalRepsType,
  onChangeGlobalRepsType,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // Color scheme for block types
  const getBlockColors = () => {
    switch (blockData.type) {
      case "superset":
        return {
          primary: "#FF6B35", // Orange
          light: "#FF6B3520",
          border: "#FF6B3530",
        };
      case "circuit":
        return {
          primary: "#4A90E2", // Blue
          light: "#4A90E220",
          border: "#4A90E230",
        };
      default: // individual
        return {
          primary: colors.primary[500],
          light: colors.primary[500] + "20",
          border: colors.primary[500] + "30",
        };
    }
  };

  const blockColors = getBlockColors();

  const getBlockTypeLabel = () => {
    switch (blockData.type) {
      case "superset":
        return "Superserie";
      case "circuit":
        return "Circuito";
      default:
        return "Individual";
    }
  };

  const getBlockTypeIcon = () => {
    switch (blockData.type) {
      case "superset":
        return <Link2 size={18} color={blockColors.primary} />;
      case "circuit":
        return <RotateCcw size={18} color={blockColors.primary} />;
      default:
        return <Link2 size={18} color={blockColors.primary} />;
    }
  };

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

  const addSetToExercise = (exerciseId: string) => {
    const exercise = blockData.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const newSet: SetData = {
      id: Date.now().toString() + Math.random(),
      setNumber: exercise.sets.length + 1,
      weight:
        exercise.sets.length > 0
          ? exercise.sets[exercise.sets.length - 1].weight
          : "",
      reps:
        exercise.sets.length > 0
          ? exercise.sets[exercise.sets.length - 1].reps
          : "",
      type: "normal",
      completed: false,
      repsType: "reps",
    };

    const updatedExercises = blockData.exercises.map((ex) =>
      ex.id === exerciseId ? { ...ex, sets: [...ex.sets, newSet] } : ex
    );

    onUpdateBlock(blockData.id, { exercises: updatedExercises });
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    updates: Partial<SetData>
  ) => {
    const updatedExercises = blockData.exercises.map((ex) =>
      ex.id === exerciseId
        ? {
            ...ex,
            sets: ex.sets.map((set) =>
              set.id === setId ? { ...set, ...updates } : set
            ),
          }
        : ex
    );

    onUpdateBlock(blockData.id, { exercises: updatedExercises });
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

  const handleDeleteBlock = () => {
    setShowMenu(false);
    // Add confirmation logic here if needed
    onDeleteBlock(blockData.id);
  };

  const handleConvertToIndividual = () => {
    setShowMenu(false);
    onConvertToIndividual(blockData.id);
  };

  return (
    <Card variant="outlined" padding="none">
      {/* Block Header with Continuous Line */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: blockColors.light,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        {/* First Row - Block Title and Main Controls */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          {/* Left - Block Title */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            {getBlockTypeIcon()}
            <Typography
              variant="body2"
              weight="semibold"
              style={{ color: blockColors.primary }}
            >
              {blockData.name || `${getBlockTypeLabel()} ${index + 1}`}
            </Typography>
          </View>

          {/* Right - Main Controls */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {/* Expand/Collapse */}
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

            {/* Menu for multi-exercise blocks */}
            {blockData.exercises.length > 1 && (
              <TouchableOpacity
                onPress={() => setShowMenu(!showMenu)}
                style={{ padding: 4 }}
              >
                <MoreVertical size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Second Row - Exercise Count and Rest Times */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left - Exercise Count */}
          <Typography variant="caption" color="textMuted">
            {blockData.exercises.length} ejercicio
            {blockData.exercises.length !== 1 ? "s" : ""}
          </Typography>

          {/* Right - Rest Time Buttons */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {blockData.exercises.length > 1 ? (
              // Multi-exercise blocks: show 2 buttons
              <>
                {/* Rest Between Exercises */}
                <TouchableOpacity
                  onPress={() =>
                    onShowRestTimeBottomSheet(
                      blockData.id,
                      blockData.restBetweenExercisesSeconds,
                      "between-exercises"
                    )
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 3,
                    paddingHorizontal: 6,
                    backgroundColor: blockColors.primary + "10",
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: blockColors.border,
                  }}
                >
                  <Timer size={12} color={blockColors.primary} />
                  <Typography
                    variant="caption"
                    weight="medium"
                    style={{
                      color: blockColors.primary,
                      marginLeft: 3,
                      fontSize: 10,
                    }}
                  >
                    Entre:{" "}
                    {formatRestTime(blockData.restBetweenExercisesSeconds)}
                  </Typography>
                </TouchableOpacity>

                {/* Rest Between Rounds */}
                <TouchableOpacity
                  onPress={() =>
                    onShowRestTimeBottomSheet(
                      blockData.id,
                      blockData.restTimeSeconds,
                      "between-rounds"
                    )
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 4,
                    paddingHorizontal: 6,
                    backgroundColor: blockColors.primary + "15",
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: blockColors.border,
                  }}
                >
                  <Timer size={12} color={blockColors.primary} />
                  <Typography
                    variant="caption"
                    weight="medium"
                    style={{
                      color: blockColors.primary,
                      marginLeft: 3,
                      fontSize: 10,
                    }}
                  >
                    Vueltas: {formatRestTime(blockData.restTimeSeconds)}
                  </Typography>
                </TouchableOpacity>
              </>
            ) : (
              // Individual exercises: show 1 button (between sets)
              <TouchableOpacity
                onPress={() =>
                  onShowRestTimeBottomSheet(
                    blockData.id,
                    blockData.restTimeSeconds,
                    "between-rounds"
                  )
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  backgroundColor: blockColors.primary + "15",
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: blockColors.border,
                }}
              >
                <Timer size={12} color={blockColors.primary} />
                <Typography
                  variant="caption"
                  weight="medium"
                  style={{
                    color: blockColors.primary,
                    marginLeft: 3,
                    fontSize: 10,
                  }}
                >
                  {formatRestTime(blockData.restTimeSeconds)}
                </Typography>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Menu Options - Only for multi-exercise blocks */}
      {showMenu && blockData.exercises.length > 1 && (
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
            minWidth: 180,
          }}
        >
          <TouchableOpacity
            onPress={handleConvertToIndividual}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 8,
              paddingHorizontal: 12,
              gap: 8,
            }}
          >
            <Split size={16} color={colors.text} />
            <Typography variant="body2">Separar ejercicios</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteBlock}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 8,
              paddingHorizontal: 12,
              gap: 8,
            }}
          >
            <Trash2 size={16} color={colors.error[500]} />
            <Typography variant="body2" style={{ color: colors.error[500] }}>
              Eliminar bloque
            </Typography>
          </TouchableOpacity>
        </View>
      )}

      {/* Exercises List with Continuous Visual Line */}
      {isExpanded && (
        <View style={{ position: "relative" }}>
          {/* Continuous Line - THIS IS THE KEY FEATURE! */}
          {blockData.exercises.length > 1 && (
            <View
              style={{
                position: "absolute",
                left: 32,
                top: 0,
                bottom: 0,
                width: 3,
                backgroundColor: blockColors.primary,
                borderRadius: 1.5,
                zIndex: 1,
              }}
            />
          )}

          {blockData.exercises.map((exerciseInBlock, exerciseIndex) => (
            <View key={exerciseInBlock.id} style={{ position: "relative" }}>
              {/* Exercise Container */}
              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  {/* Exercise Number with Connection to Line */}
                  <View style={{ alignItems: "center" }}>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor:
                          blockData.exercises.length > 1
                            ? blockColors.primary
                            : colors.border,
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                        borderWidth: blockData.exercises.length > 1 ? 2 : 0,
                        borderColor: colors.background,
                      }}
                    >
                      <Typography
                        variant="caption"
                        weight="bold"
                        style={{
                          color:
                            blockData.exercises.length > 1
                              ? "white"
                              : colors.text,
                        }}
                      >
                        {exerciseIndex + 1}
                      </Typography>
                    </View>
                  </View>

                  {/* Exercise Details */}
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <ExercisePlaceholderImage size={40} />
                      <View style={{ flex: 1 }}>
                        <Typography variant="body1" weight="semibold">
                          {exerciseInBlock.exercise.name}
                        </Typography>
                        <Typography variant="caption" color="textMuted">
                          {exerciseInBlock.exercise.muscleGroups.join(", ")}
                        </Typography>
                      </View>
                    </View>

                    {/* Sets Table */}
                    <View style={{ marginTop: 12 }}>
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
                        <View style={{ width: 40 }}>
                          <Typography
                            variant="caption"
                            weight="medium"
                            color="textMuted"
                          >
                            SET
                          </Typography>
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 8 }}>
                          <Typography
                            variant="caption"
                            weight="medium"
                            color="textMuted"
                          >
                            KG
                          </Typography>
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 8 }}>
                          <TouchableOpacity
                            onPress={onChangeGlobalRepsType}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Typography
                              variant="caption"
                              weight="medium"
                              color="textMuted"
                            >
                              {getRepsColumnTitle()}
                            </Typography>
                            <ChevronDown size={12} color={colors.textMuted} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Set Rows */}
                      {exerciseInBlock.sets.map((set, setIndex) => (
                        <View
                          key={set.id}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 6,
                            backgroundColor: set.completed
                              ? blockColors.light
                              : "transparent",
                            borderRadius: 4,
                            marginBottom: 4,
                          }}
                        >
                          {/* Set Number */}
                          <View style={{ width: 40, alignItems: "center" }}>
                            <TouchableOpacity
                              onPress={() =>
                                onShowSetTypeBottomSheet(
                                  set.id,
                                  exerciseInBlock.id
                                )
                              }
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 14,
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
                                  color:
                                    set.type !== "normal"
                                      ? "white"
                                      : colors.text,
                                  fontSize: 10,
                                }}
                              >
                                {getSetTypeLabel(set.type) ||
                                  (setIndex + 1).toString()}
                              </Typography>
                            </TouchableOpacity>
                          </View>

                          {/* Weight Input */}
                          <View style={{ flex: 1, paddingHorizontal: 8 }}>
                            <TextInput
                              value={set.weight}
                              onChangeText={(value) =>
                                updateSet(exerciseInBlock.id, set.id, {
                                  weight: value,
                                })
                              }
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
                                fontSize: 14,
                              }}
                            />
                          </View>

                          {/* Reps Input */}
                          <View style={{ flex: 1, paddingHorizontal: 8 }}>
                            <TextInput
                              value={set.reps}
                              onChangeText={(value) =>
                                updateSet(exerciseInBlock.id, set.id, {
                                  reps: value,
                                })
                              }
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
                                fontSize: 14,
                              }}
                            />
                          </View>
                        </View>
                      ))}

                      {/* Add Set Button */}
                      <TouchableOpacity
                        onPress={() => addSetToExercise(exerciseInBlock.id)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingVertical: 8,
                          marginTop: 4,
                          borderWidth: 1,
                          borderColor: blockColors.primary,
                          borderStyle: "dashed",
                          borderRadius: 4,
                          backgroundColor: blockColors.light,
                        }}
                      >
                        <Plus size={14} color={blockColors.primary} />
                        <Typography
                          variant="caption"
                          weight="medium"
                          style={{ color: blockColors.primary, marginLeft: 4 }}
                        >
                          Agregar Serie
                        </Typography>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {/* Rest Between Exercises (for circuits) */}
              {blockData.type === "circuit" &&
                exerciseIndex < blockData.exercises.length - 1 &&
                blockData.restBetweenExercisesSeconds > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 8,
                      marginHorizontal: 16,
                      backgroundColor: blockColors.light,
                      borderRadius: 8,
                      marginBottom: 8,
                      position: "relative",
                    }}
                  >
                    {/* Rest indicator on the line */}
                    <View
                      style={{
                        position: "absolute",
                        left: 16,
                        width: 3,
                        height: "100%",
                        backgroundColor: blockColors.primary,
                      }}
                    />
                    <Timer size={14} color={blockColors.primary} />
                    <Typography
                      variant="caption"
                      style={{ color: blockColors.primary, marginLeft: 4 }}
                    >
                      Descanso:{" "}
                      {formatRestTime(blockData.restBetweenExercisesSeconds)}
                    </Typography>
                  </View>
                )}
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};
