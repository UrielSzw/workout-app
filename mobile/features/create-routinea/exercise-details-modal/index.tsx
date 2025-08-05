import React, { useState } from "react";
import { View, Modal, TextInput, ScrollView } from "react-native";
import { X, Save } from "lucide-react-native";
import { Typography, Button, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { Exercise } from "@/data/mockExercises";

interface ExerciseInBlock {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: string;
  weight?: string;
  restSeconds: number;
  notes?: string;
}

interface ExerciseDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  initialValues?: Partial<ExerciseInBlock>;
  onSave: (exerciseDetails: Omit<ExerciseInBlock, "id">) => void;
}

export const ExerciseDetailsModal: React.FC<ExerciseDetailsModalProps> = ({
  visible,
  onClose,
  exercise,
  initialValues,
  onSave,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const [sets, setSets] = useState(initialValues?.sets?.toString() || "3");
  const [reps, setReps] = useState(initialValues?.reps || "12");
  const [weight, setWeight] = useState(initialValues?.weight || "");
  const [restMinutes, setRestMinutes] = useState(
    Math.floor((initialValues?.restSeconds || 90) / 60).toString()
  );
  const [restSeconds, setRestSeconds] = useState(
    ((initialValues?.restSeconds || 90) % 60).toString()
  );
  const [notes, setNotes] = useState(initialValues?.notes || "");

  const handleSave = () => {
    if (!exercise) return;

    const totalRestSeconds = parseInt(restMinutes) * 60 + parseInt(restSeconds);

    onSave({
      exercise,
      sets: parseInt(sets) || 3,
      reps,
      weight: weight.trim() || undefined,
      restSeconds: totalRestSeconds,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  if (!exercise) return null;

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
              Configurar Ejercicio
            </Typography>
            <Typography variant="body2" color="textMuted">
              {exercise.name}
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

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Exercise Info */}
          <Card variant="outlined" padding="md" style={{ marginBottom: 20 }}>
            <Typography
              variant="h6"
              weight="semibold"
              style={{ marginBottom: 8 }}
            >
              {exercise.name}
            </Typography>
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginBottom: 8 }}
            >
              {exercise.muscleGroups.join(", ")}
            </Typography>
            <Typography variant="body2" color="textMuted">
              Equipo: {exercise.equipment}
            </Typography>
          </Card>

          {/* Sets */}
          <View style={{ marginBottom: 20 }}>
            <Typography
              variant="body1"
              weight="semibold"
              style={{ marginBottom: 8 }}
            >
              Series
            </Typography>
            <TextInput
              value={sets}
              onChangeText={setSets}
              placeholder="3"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                backgroundColor: colors.background,
                color: colors.text,
              }}
            />
          </View>

          {/* Reps */}
          <View style={{ marginBottom: 20 }}>
            <Typography
              variant="body1"
              weight="semibold"
              style={{ marginBottom: 8 }}
            >
              Repeticiones
            </Typography>
            <TextInput
              value={reps}
              onChangeText={setReps}
              placeholder="12 o 8-12"
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                backgroundColor: colors.background,
                color: colors.text,
              }}
            />
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginTop: 4 }}
            >
              Puedes usar rangos como &quot;8-12&quot; o &quot;máximo&quot;
            </Typography>
          </View>

          {/* Weight */}
          <View style={{ marginBottom: 20 }}>
            <Typography
              variant="body1"
              weight="semibold"
              style={{ marginBottom: 8 }}
            >
              Peso (opcional)
            </Typography>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="60kg o peso corporal"
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                backgroundColor: colors.background,
                color: colors.text,
              }}
            />
          </View>

          {/* Rest Time */}
          <View style={{ marginBottom: 20 }}>
            <Typography
              variant="body1"
              weight="semibold"
              style={{ marginBottom: 8 }}
            >
              Tiempo de Descanso
            </Typography>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ marginBottom: 4 }}
                >
                  Minutos
                </Typography>
                <TextInput
                  value={restMinutes}
                  onChangeText={setRestMinutes}
                  placeholder="1"
                  keyboardType="numeric"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    backgroundColor: colors.background,
                    color: colors.text,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ marginBottom: 4 }}
                >
                  Segundos
                </Typography>
                <TextInput
                  value={restSeconds}
                  onChangeText={setRestSeconds}
                  placeholder="30"
                  keyboardType="numeric"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    backgroundColor: colors.background,
                    color: colors.text,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Notes */}
          <View style={{ marginBottom: 40 }}>
            <Typography
              variant="body1"
              weight="semibold"
              style={{ marginBottom: 8 }}
            >
              Notas (opcional)
            </Typography>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Técnica especial, variaciones, etc."
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                backgroundColor: colors.background,
                color: colors.text,
                minHeight: 80,
                textAlignVertical: "top",
              }}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          style={{
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Button
            variant="primary"
            fullWidth
            onPress={handleSave}
            icon={<Save size={20} color="#ffffff" />}
          >
            Guardar Ejercicio
          </Button>
        </View>
      </View>
    </Modal>
  );
};
