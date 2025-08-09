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
import { Dumbbell, ArrowLeft } from 'lucide-react-native';

import { Typography } from '@/components/ui';
import { FormInput } from '@/components/ui/FormInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { registerSchema, RegisterFormData } from '@/lib/validation';

export default function RegisterScreen() {
  const { colors } = useColorScheme();

  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const result = await register(data.name, data.email, data.password);

      if (result.success) {
        Alert.alert(
          '¡Registro Exitoso! 🎉',
          'Tu cuenta ha sido creada. ¡Bienvenido a tu nueva aventura fitness!',
          [
            {
              text: 'Continuar',
              onPress: () => router.replace('/(tabs)'),
            },
          ],
        );
      } else {
        Alert.alert('Error de Registro', result.error || 'Ocurrió un error');
      }
    } catch (error) {
      console.error('Register error:', error);
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
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 40,
                marginBottom: 40,
              }}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}
              >
                <ArrowLeft size={20} color={colors.text} />
              </TouchableOpacity>

              <View style={{ flex: 1, alignItems: 'center' }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: colors.primary[500],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Dumbbell size={30} color="white" />
                </View>

                <Typography
                  variant="h5"
                  weight="bold"
                  style={{ marginBottom: 8 }}
                >
                  Crear Cuenta
                </Typography>

                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ textAlign: 'center' }}
                >
                  Únete y comienza tu transformación
                </Typography>
              </View>
            </View>

            {/* Form */}
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Nombre completo"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    autoComplete="name"
                    error={errors.name?.message}
                  />
                )}
              />

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
                    autoComplete="new-password"
                    error={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Confirmar contraseña"
                    value={value}
                    onChangeText={onChange}
                    isPassword
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                  />
                )}
              />

              <AuthButton
                title="Crear Cuenta"
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
                  ¿Ya tienes una cuenta?
                </Typography>

                <TouchableOpacity onPress={() => router.back()}>
                  <Typography
                    variant="body2"
                    weight="semibold"
                    style={{ color: colors.primary[500] }}
                  >
                    Inicia sesión
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
