import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Play, Dumbbell, Hash, Clock } from 'lucide-react-native';
import { Typography, Button, Card } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';
import { IRoutine } from '@/types/routine';

interface RoutineCardProps {
  routine: IRoutine;
  onStart: (routine: IRoutine) => void;
  onLongPress?: (routine: IRoutine) => void;
  onPress: (routine: IRoutine | null) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onStart,
  onLongPress,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  // Calcular estadísticas de la rutina
  const totalExercises = routine.blocks.reduce(
    (total, block) => total + block.exercises.length,
    0,
  );

  const totalSets = routine.blocks.reduce(
    (total, block) =>
      total +
      block.exercises.reduce(
        (blockTotal, exercise) => blockTotal + exercise.sets.length,
        0,
      ),
    0,
  );

  // Estimación de tiempo aproximado (sets * 45seg + descansos promedio)
  const estimatedMinutes = Math.round(
    totalSets * 0.75 +
      routine.blocks.reduce(
        (total, block) => total + block.restTimeSeconds,
        0,
      ) /
        60,
  );

  // Verificar si es una rutina reciente (modificada en los últimos 7 días)
  const isRecent = () => {
    const updatedDate = new Date(routine.updatedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return updatedDate > weekAgo;
  };

  const handleSelectRoutine = () => {
    onPress(routine);
  };

  return (
    <TouchableOpacity
      onLongPress={onLongPress ? () => onLongPress(routine) : undefined}
      delayLongPress={500}
      activeOpacity={onLongPress ? 0.7 : 1}
      onPress={handleSelectRoutine}
    >
      <Card
        variant="outlined"
        padding="md"
        style={{
          marginBottom: 12,
        }}
      >
        {/* Header con título y indicador de reciente */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Typography variant="h6" weight="semibold" style={{ flex: 1 }}>
              {routine.name}
            </Typography>

            {isRecent() && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary[500],
                }}
              />
            )}
          </View>
        </View>

        {/* Estadísticas en fila */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            marginBottom: 16,
          }}
        >
          {/* Bloques */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Hash size={14} color={colors.textMuted} />
            <Typography variant="caption" color="textMuted">
              {routine.blocks.length} bloque
              {routine.blocks.length !== 1 ? 's' : ''}
            </Typography>
          </View>

          {/* Ejercicios */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Dumbbell size={14} color={colors.textMuted} />
            <Typography variant="caption" color="textMuted">
              {totalExercises} ejercicio{totalExercises !== 1 ? 's' : ''}
            </Typography>
          </View>

          {/* Tiempo estimado */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Clock size={14} color={colors.textMuted} />
            <Typography variant="caption" color="textMuted">
              ~{estimatedMinutes} min
            </Typography>
          </View>
        </View>

        <Button
          variant="primary"
          size="md"
          onPress={() => onStart(routine)}
          icon={<Play size={18} color="#ffffff" />}
          iconPosition="left"
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}
        >
          Iniciar Entrenamiento
        </Button>
      </Card>
    </TouchableOpacity>
  );
};
