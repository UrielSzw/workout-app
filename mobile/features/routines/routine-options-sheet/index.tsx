import React, { forwardRef } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  onDelete: () => void;
};

export const RoutineOptionsBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ onDelete }, ref) => {
    const { colors } = useColorScheme();
    const insets = useSafeAreaInsets();

    // Calcular el bottomInset considerando el tab bar
    const tabBarHeight = Platform.OS === 'ios' ? 49 : 56;
    const bottomInset = insets.bottom + tabBarHeight;

    const routineOptions = [
      { type: 'edit', label: 'Editar Rutina' },
      { type: 'duplicate', label: 'Duplicar Rutina' },
    ];

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['50%']}
        enablePanDownToClose
        bottomInset={bottomInset}
        backgroundStyle={{
          backgroundColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8, // Para Android
        }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      >
        <BottomSheetView style={{ padding: 16, paddingBottom: 40 }}>
          <Typography
            variant="h3"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Opciones de Rutina
          </Typography>

          {routineOptions.map((option) => (
            <TouchableOpacity
              key={option.type}
              //   onPress={() => onSelectSetType(option.type)}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Typography variant="body1">{option.label}</Typography>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={onDelete}
            style={{ paddingVertical: 16, paddingHorizontal: 16 }}
          >
            <Typography variant="body1" style={{ color: colors.error[500] }}>
              Eliminar rutina
            </Typography>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

RoutineOptionsBottomSheet.displayName = 'RoutineOptionsBottomSheet';
