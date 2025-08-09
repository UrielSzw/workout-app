import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dumbbell } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { FormInput } from '@/components/ui/FormInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, LoginFormData } from '@/lib/validation';

export default function LoginScreen() {
  const { colors } = useColorScheme();

  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        // Navigate to main app after successful login
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error de Login', result.error || 'Ocurrió un error');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, padding: 24 }}>
            {/* Header */}
            <View
              style={{ alignItems: 'center', marginTop: 60, marginBottom: 40 }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                }}
              >
                <Dumbbell size={40} color="white" />
              </View>

              <Typography
                variant="h4"
                weight="bold"
                style={{ marginBottom: 8 }}
              >
                ¡Bienvenido de vuelta!
              </Typography>

              <Typography
                variant="body1"
                color="textMuted"
                style={{ textAlign: 'center' }}
              >
                Inicia sesión para continuar con tus entrenamientos
              </Typography>
            </View>

            {/* Form */}
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Contraseña"
                    value={value}
                    onChangeText={onChange}
                    isPassword
                    autoComplete="password"
                    error={errors.password?.message}
                  />
                )}
              />

              {/* Demo Info */}
              <View
                style={{
                  backgroundColor: colors.primary[100],
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 24,
                }}
              >
                <Typography
                  variant="caption"
                  weight="semibold"
                  style={{ color: colors.primary[700], marginBottom: 4 }}
                >
                  💡 Demo - Usa estas credenciales:
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: colors.primary[600] }}
                >
                  Email: cualquier@email.com
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: colors.primary[600] }}
                >
                  Contraseña: password123
                </Typography>
              </View>

              <AuthButton
                title="Iniciar Sesión"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                style={{ marginBottom: 24 }}
              />

              <View style={{ alignItems: 'center' }}>
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ marginBottom: 8 }}
                >
                  ¿No tienes una cuenta?
                </Typography>

                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Typography
                    variant="body2"
                    weight="semibold"
                    style={{ color: colors.primary[500] }}
                  >
                    Regístrate aquí
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
