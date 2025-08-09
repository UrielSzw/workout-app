import { Button, Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const NotActiveWorkout = () => {
  const { colors } = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Typography variant="h5" weight="semibold" style={{ marginBottom: 16 }}>
          No hay entrenamiento activo
        </Typography>
        <Typography
          variant="body2"
          color="textMuted"
          style={{ textAlign: 'center', marginBottom: 24 }}
        >
          Selecciona una rutina para comenzar tu entrenamiento
        </Typography>
        <Button variant="primary" onPress={() => router.back()}>
          Volver a Rutinas
        </Button>
      </View>
    </SafeAreaView>
  );
};
