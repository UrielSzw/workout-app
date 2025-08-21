import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Typography, Card } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  useInfoActions,
  useInfoState,
} from '../../hooks/use-form-routine-store';

export const RoutineInfo = () => {
  const { colors } = useColorScheme();
  const { setRoutineName } = useInfoActions();
  const routineName = useInfoState();

  const [isNameFocused, setIsNameFocused] = useState(false);

  return (
    <Card variant="outlined" padding="lg" style={{ marginBottom: 24 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Nombre de la Rutina
      </Typography>

      <View style={{ marginBottom: 16 }}>
        <TextInput
          value={routineName}
          onChangeText={setRoutineName}
          onFocus={() => setIsNameFocused(true)}
          onBlur={() => setIsNameFocused(false)}
          placeholder="Ej: Push Pull Legs"
          style={{
            borderWidth: 1,
            borderColor: isNameFocused ? colors.primary[500] : colors.border,
            borderRadius: 12,
            backgroundColor: colors.background,
            padding: 12,
            fontSize: 16,
            color: colors.text,
          }}
          placeholderTextColor={colors.textMuted}
        />
      </View>
    </Card>
  );
};
