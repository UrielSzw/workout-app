import React, { useState } from "react";
import { View, ScrollView, Modal, TouchableOpacity } from "react-native";
import { X, Search, Plus, Info } from "lucide-react-native";
import { Typography, Button, Card } from "@/components/ui";
import { ExercisePlaceholderImage } from "@/components/ui/ExercisePlaceholderImage";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import {
  Exercise,
  exerciseCategories,
  getExercisesByCategory,
} from "@/data/mockExercises";

interface ExerciseSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  selectedExercises: Exercise[];
  onAddAsIndividual: () => void;
  onAddAsBlock: () => void;
}

export const ExerciseSelectorModal: React.FC<ExerciseSelectorModalProps> = ({
  visible,
  onClose,
  onSelectExercise,
  selectedExercises,
  onAddAsIndividual,
  onAddAsBlock,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const [selectedCategory, setSelectedCategory] = useState(
    exerciseCategories[0].id
  );
  const [searchQuery, setSearchQuery] = useState("");

  const exercises = getExercisesByCategory(selectedCategory);
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isExerciseSelected = (exerciseId: string) => {
    return selectedExercises.some((ex) => ex.id === exerciseId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return colors.success[500];
      case "intermediate":
        return colors.warning[500];
      case "advanced":
        return colors.error[500];
      default:
        return colors.text;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Principiante";
      case "intermediate":
        return "Intermedio";
      case "advanced":
        return "Avanzado";
      default:
        return difficulty;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <View style={{ flex: 1 }}>
            <Typography variant="h5" weight="semibold">
              Seleccionar Ejercicios
            </Typography>
            <Typography variant="body2" color="textMuted">
              {selectedExercises.length} ejercicios seleccionados
            </Typography>
          </View>

          <Button
            variant="ghost"
            size="sm"
            onPress={onClose}
            icon={<X size={20} color={colors.text} />}
          >
            {""}
          </Button>
        </View>

        {/* Search Bar */}
        <View style={{ padding: 20, paddingBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.gray[100],
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Search size={20} color={colors.textMuted} />
            <Typography
              variant="body1"
              color="textMuted"
              style={{ marginLeft: 12, flex: 1 }}
            >
              Buscar ejercicios...
            </Typography>
          </View>
        </View>

        {/* Categories */}
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 8 }}
          >
            <View style={{ flexDirection: "row", gap: 12 }}>
              {exerciseCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor:
                      selectedCategory === category.id
                        ? colors.primary[500]
                        : colors.gray[100],
                  }}
                >
                  <Typography
                    variant="body2"
                    weight="medium"
                    color={selectedCategory === category.id ? "white" : "text"}
                  >
                    {category.icon} {category.name}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Exercises List */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          <View style={{ gap: 12, paddingBottom: 40 }}>
            {filteredExercises.map((exercise) => (
              <Card
                key={exercise.id}
                variant="outlined"
                padding="md"
                style={{
                  opacity: isExerciseSelected(exercise.id) ? 0.6 : 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  {/* Exercise Image */}
                  <ExercisePlaceholderImage size={56} />

                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Typography
                        variant="h6"
                        weight="semibold"
                        style={{ flex: 1 }}
                      >
                        {exercise.name}
                      </Typography>

                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 12,
                          backgroundColor:
                            getDifficultyColor(exercise.difficulty) + "20",
                        }}
                      >
                        <Typography
                          variant="caption"
                          weight="medium"
                          style={{
                            color: getDifficultyColor(exercise.difficulty),
                          }}
                        >
                          {getDifficultyLabel(exercise.difficulty)}
                        </Typography>
                      </View>
                    </View>

                    <Typography
                      variant="body2"
                      color="textMuted"
                      style={{ marginBottom: 8 }}
                    >
                      {exercise.equipment} •{" "}
                      {exercise.muscleGroups.slice(0, 2).join(", ")}
                    </Typography>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <Button
                        variant={
                          isExerciseSelected(exercise.id)
                            ? "secondary"
                            : "primary"
                        }
                        size="sm"
                        onPress={() => onSelectExercise(exercise)}
                        disabled={isExerciseSelected(exercise.id)}
                        icon={
                          isExerciseSelected(exercise.id) ? (
                            <Typography variant="body2" weight="medium">
                              ✓
                            </Typography>
                          ) : (
                            <Plus size={16} color="#ffffff" />
                          )
                        }
                      >
                        {isExerciseSelected(exercise.id)
                          ? "Agregado"
                          : "Agregar"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Info size={16} color={colors.primary[500]} />}
                      >
                        Info
                      </Button>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        {selectedExercises.length > 0 && (
          <View
            style={{
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <View style={{ gap: 12 }}>
              {selectedExercises.length > 1 && (
                <Button variant="primary" fullWidth onPress={onAddAsBlock}>
                  Agregar {selectedExercises.length} ejercicios en bloque
                </Button>
              )}
              <Button variant="outline" fullWidth onPress={onAddAsIndividual}>
                Agregar {selectedExercises.length} ejercicio
                {selectedExercises.length > 1 ? "s" : ""} individual
                {selectedExercises.length > 1 ? "es" : ""}
              </Button>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};
