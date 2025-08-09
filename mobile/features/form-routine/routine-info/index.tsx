import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Typography, Card } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';

type Props = {
  routineName: string;
  onRoutineNameChange: (name: string) => void;
};

export const RoutineInfo: React.FC<Props> = ({
  routineName,
  onRoutineNameChange,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const [isNameFocused, setIsNameFocused] = useState(false);

  return (
    <Card variant="outlined" padding="lg" style={{ marginBottom: 24 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Nombre de la Rutina
      </Typography>

      <View style={{ marginBottom: 16 }}>
        <TextInput
          value={routineName}
          onChangeText={onRoutineNameChange}
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
