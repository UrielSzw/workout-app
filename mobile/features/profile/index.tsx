import React from "react";
import { View, ScrollView, SafeAreaView, Switch } from "react-native";
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
} from "lucide-react-native";

import { Typography, Card, Button } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { ProfileSection } from "./profile-section";
import { SettingItem } from "./setting-item";
import { StatItem } from "./stat-item";

export const ProfileFeature = () => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(
    colorScheme === "dark"
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Typography variant="h2" weight="bold" style={{ marginBottom: 4 }}>
            Mi Perfil
          </Typography>
          <Typography variant="body2" color="textMuted">
            Configuración y estadísticas personales
          </Typography>
        </View>

        {/* Profile Card */}
        <Card variant="elevated" padding="lg" style={{ marginBottom: 24 }}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primary[500],
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <User size={40} color="#ffffff" />
            </View>

            <Typography variant="h4" weight="bold" style={{ marginBottom: 4 }}>
              Uriel Szwarcberg
            </Typography>
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginBottom: 16 }}
            >
              Miembro desde Enero 2025
            </Typography>

            <Button variant="outline" size="sm">
              Editar Perfil
            </Button>
          </View>

          {/* Quick Stats */}
          <View
            style={{
              flexDirection: "row",
              paddingTop: 20,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <StatItem
              label="Entrenamientos"
              value="47"
              color={colors.primary[500]}
            />
            <StatItem
              label="Racha Actual"
              value="7 días"
              color={colors.success[500]}
            />
            <StatItem
              label="PRs este mes"
              value="8"
              color={colors.warning[500]}
            />
          </View>
        </Card>

        {/* Preferences */}
        <ProfileSection title="Preferencias">
          <SettingItem
            icon={
              darkModeEnabled ? (
                <Moon size={20} color={colors.textMuted} />
              ) : (
                <Sun size={20} color={colors.textMuted} />
              )
            }
            title="Modo Oscuro"
            subtitle="Cambia el tema de la aplicación"
            rightElement={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{
                  false: colors.gray[300],
                  true: colors.primary[500],
                }}
                thumbColor={darkModeEnabled ? "#ffffff" : "#ffffff"}
              />
            }
          />

          <SettingItem
            icon={<Bell size={20} color={colors.textMuted} />}
            title="Notificaciones"
            subtitle="Recordatorios de entrenamientos"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: colors.gray[300],
                  true: colors.primary[500],
                }}
                thumbColor={notificationsEnabled ? "#ffffff" : "#ffffff"}
              />
            }
          />
        </ProfileSection>

        {/* Training */}
        <ProfileSection title="Entrenamiento">
          <SettingItem
            icon={<Settings size={20} color={colors.textMuted} />}
            title="Configuración de Entrenamiento"
            subtitle="Pesos, unidades, tiempos de descanso"
            onPress={() => {}}
          />

          <SettingItem
            icon={<User size={20} color={colors.textMuted} />}
            title="Datos Personales"
            subtitle="Peso, altura, nivel de experiencia"
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Support */}
        <ProfileSection title="Soporte">
          <SettingItem
            icon={<HelpCircle size={20} color={colors.textMuted} />}
            title="Ayuda y Preguntas Frecuentes"
            subtitle="¿Necesitas ayuda? Encuentra respuestas aquí"
            onPress={() => {}}
          />

          <SettingItem
            icon={<Shield size={20} color={colors.textMuted} />}
            title="Privacidad y Seguridad"
            subtitle="Gestiona tu privacidad y datos"
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Achievements */}
        <ProfileSection title="Logros">
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Card variant="outlined" padding="md" style={{ width: "48%" }}>
              <View style={{ alignItems: "center" }}>
                <Typography variant="h3" style={{ marginBottom: 8 }}>
                  💪
                </Typography>
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{ marginBottom: 4 }}
                >
                  Fuerza
                </Typography>
                <Typography variant="caption" color="textMuted" align="center">
                  100kg en sentadillas
                </Typography>
              </View>
            </Card>

            <Card variant="outlined" padding="md" style={{ width: "48%" }}>
              <View style={{ alignItems: "center" }}>
                <Typography variant="h3" style={{ marginBottom: 8 }}>
                  🔥
                </Typography>
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{ marginBottom: 4 }}
                >
                  Consistencia
                </Typography>
                <Typography variant="caption" color="textMuted" align="center">
                  30 entrenamientos
                </Typography>
              </View>
            </Card>

            <Card variant="outlined" padding="md" style={{ width: "48%" }}>
              <View style={{ alignItems: "center" }}>
                <Typography variant="h3" style={{ marginBottom: 8 }}>
                  📈
                </Typography>
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{ marginBottom: 4 }}
                >
                  Progreso
                </Typography>
                <Typography variant="caption" color="textMuted" align="center">
                  10 nuevos PRs
                </Typography>
              </View>
            </Card>
          </View>
        </ProfileSection>

        {/* Logout */}
        <View style={{ marginBottom: 32 }}>
          <SettingItem
            icon={<LogOut size={20} color={colors.error[500]} />}
            title="Cerrar Sesión"
            onPress={() => {}}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
