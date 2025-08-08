import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Edit, Trash2, Play } from 'lucide-react-native';
import { Typography, Button, Card } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';
import { IRoutine } from '@/types/routine';

interface RoutineCardProps {
  routine: IRoutine;
  onEdit: (routine: IRoutine) => void;
  onDelete: (routine: IRoutine) => void;
  onStart: (routine: IRoutine) => void;
  onLongPress?: (routine: IRoutine) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onEdit,
  onDelete,
  onStart,
  onLongPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  return (
    <TouchableOpacity
      onLongPress={onLongPress ? () => onLongPress(routine) : undefined}
      delayLongPress={500}
      activeOpacity={onLongPress ? 0.7 : 1}
    >
      <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Typography
              variant="h6"
              weight="semibold"
              style={{ marginBottom: 4 }}
            >
              {routine.name}
            </Typography>

            {routine.description && (
              <Typography
                variant="body2"
                color="textMuted"
                style={{ marginBottom: 8 }}
              >
                {routine.description}
              </Typography>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginLeft: 8 }}
              >
                • {routine.blocks.length} bloque
                {routine.blocks.length !== 1 ? 's' : ''}
              </Typography>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => onEdit(routine)}
              icon={<Edit size={16} color={colors.textMuted} />}
            >
              {''}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => onDelete(routine)}
              icon={<Trash2 size={16} color={colors.error[500]} />}
            >
              {''}
            </Button>
          </View>
        </View>

        <Button
          variant="primary"
          fullWidth
          onPress={() => onStart(routine)}
          icon={<Play size={20} color="#ffffff" />}
          iconPosition="left"
          style={{ marginTop: 12 }}
        >
          Iniciar Entrenamiento
        </Button>
      </Card>
    </TouchableOpacity>
  );
};
