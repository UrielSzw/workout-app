import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import {
  Play,
  Calendar,
  Trophy,
  TrendingUp,
  Plus,
  Dumbbell,
} from 'lucide-react-native';

import { Typography, Button, Card } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';
import { QuickActionCard } from './quick-action-card';
import { StatCard } from './stat-card';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HomeFeature = () => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const { routines, activeWorkout } = useAppStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const getNextWorkout = () => {
    return routines.length > 0 ? routines[0] : null;
  };

  const handleStartQuickWorkout = () => {
    const nextWorkout = getNextWorkout();
    if (nextWorkout) {
      router.push('/workout/active');
    } else {
      router.push('/routines');
    }
  };

  const handleContinueWorkout = () => {
    router.push('/workout/active');
  };

  const nextWorkout = getNextWorkout();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Greeting Header */}
        <View style={{ marginBottom: 32 }}>
          <Typography variant="h1" weight="bold" style={{ marginBottom: 4 }}>
            {getGreeting()}
          </Typography>
          <Typography variant="body1" color="textMuted">
            ¿Listo para entrenar hoy?
          </Typography>
        </View>

        <Button onPress={() => AsyncStorage.clear()}>
          LIMPIRAR LOCAL STORAGE
        </Button>

        {/* Active Workout Card */}
        {activeWorkout && (
          <Card
            variant="elevated"
            padding="lg"
            style={{ marginBottom: 24, backgroundColor: colors.primary[500] }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1 }}>
                <Typography
                  variant="overline"
                  color="white"
                  style={{ marginBottom: 4 }}
                >
                  ENTRENAMIENTO ACTIVO
                </Typography>
                <Typography
                  variant="h5"
                  weight="bold"
                  color="white"
                  style={{ marginBottom: 8 }}
                >
                  {activeWorkout.routineName}
                </Typography>
                <Typography
                  variant="body2"
                  color="white"
                  style={{ opacity: 0.9 }}
                >
                  Iniciado hace{' '}
                  {Math.floor(
                    (Date.now() - new Date(activeWorkout.startedAt).getTime()) /
                      60000,
                  )}{' '}
                  min
                </Typography>
              </View>
              <Button
                variant="secondary"
                size="sm"
                onPress={handleContinueWorkout}
                icon={<Play size={16} color="#ffffff" />}
              >
                Continuar
              </Button>
            </View>
          </Card>
        )}

        {/* Next Workout Card */}
        {!activeWorkout && nextWorkout && (
          <Card variant="outlined" padding="lg" style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1 }}>
                <Typography
                  variant="overline"
                  color="primary"
                  style={{ marginBottom: 4 }}
                >
                  PRÓXIMO ENTRENAMIENTO
                </Typography>
                <Typography
                  variant="h5"
                  weight="bold"
                  style={{ marginBottom: 4 }}
                >
                  {nextWorkout.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ marginBottom: 12 }}
                >
                  {nextWorkout.estimatedDurationMinutes} min •{' '}
                  {nextWorkout.blocks.length} bloques
                </Typography>
                <Button
                  variant="primary"
                  fullWidth
                  onPress={handleStartQuickWorkout}
                  icon={<Play size={20} color="#ffffff" />}
                  iconPosition="left"
                >
                  Iniciar Entrenamiento
                </Button>
              </View>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Acciones Rápidas
          </Typography>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <QuickActionCard
              title="Nueva Rutina"
              subtitle="Crear ejercicios"
              icon={<Plus size={24} color={colors.primary[500]} />}
              onPress={() => router.push('/routines/create')}
              color={colors.primary[500]}
            />
            <QuickActionCard
              title="Mis Rutinas"
              subtitle="Ver todas"
              icon={<Dumbbell size={24} color={colors.secondary[500]} />}
              onPress={() => router.push('/routines')}
              color={colors.secondary[500]}
            />
          </View>
        </View>

        {/* Weekly Stats */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Esta Semana
          </Typography>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <StatCard
              label="Entrenamientos"
              value="3"
              icon={<Calendar size={20} color={colors.success[500]} />}
              color={colors.success[500]}
            />
            <StatCard
              label="Volumen Total"
              value="2.4K kg"
              icon={<TrendingUp size={20} color={colors.warning[500]} />}
              color={colors.warning[500]}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <StatCard
              label="Nuevos PRs"
              value="2"
              icon={<Trophy size={20} color={colors.error[500]} />}
              color={colors.error[500]}
            />
            <StatCard
              label="Racha Actual"
              value="7 días"
              icon={<TrendingUp size={20} color={colors.primary[500]} />}
              color={colors.primary[500]}
            />
          </View>
        </View>

        {/* Recent Achievements */}
        <View style={{ marginBottom: 32 }}>
          <Typography
            variant="h5"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Logros Recientes
          </Typography>
          <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.success[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Trophy size={20} color={colors.success[500]} />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="h6" weight="semibold">
                  Nuevo PR en Press de Banca
                </Typography>
                <Typography variant="body2" color="textMuted">
                  85kg × 5 reps • Ayer
                </Typography>
              </View>
            </View>
          </Card>

          <Card variant="outlined" padding="md">
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Calendar size={20} color={colors.primary[500]} />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="h6" weight="semibold">
                  7 días consecutivos
                </Typography>
                <Typography variant="body2" color="textMuted">
                  ¡Sigue así! • Esta semana
                </Typography>
              </View>
            </View>
          </Card>
        </View>

        {/* Empty State */}
        {routines.length === 0 && (
          <Card variant="outlined" padding="lg" style={{ marginBottom: 32 }}>
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: colors.gray[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Dumbbell size={28} color={colors.textMuted} />
              </View>
              <Typography
                variant="h6"
                weight="semibold"
                style={{ marginBottom: 8 }}
              >
                ¡Bienvenido a tu app de entrenamiento!
              </Typography>
              <Typography
                variant="body2"
                color="textMuted"
                align="center"
                style={{ marginBottom: 16 }}
              >
                Comienza creando tu primera rutina de ejercicios
              </Typography>
              <Button
                variant="primary"
                onPress={() => router.push('/routines/create')}
                icon={<Plus size={20} color="#ffffff" />}
                iconPosition="left"
              >
                Crear Primera Rutina
              </Button>
            </View>
          </Card>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
