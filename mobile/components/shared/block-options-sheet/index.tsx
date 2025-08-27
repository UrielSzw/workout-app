import React, { forwardRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  onDelete: () => void;
  onConvertToIndividual: () => void;
  onShowAddExerciseModal: () => void;
  isMultiBlock: boolean;
};

export const BlockOptionsBottomSheet = forwardRef<BottomSheetModal, Props>(
  (
    { onDelete, onConvertToIndividual, onShowAddExerciseModal, isMultiBlock },
    ref,
  ) => {
    const { colors } = useColorScheme();

    const blockOptions = [
      { type: 'convert', label: 'Separar ejercicios' },
      {
        type: 'add-exercise',
        label: 'Agregar ejercicio',
      },
    ];

    const handleOptionPress = (type: string) => {
      switch (type) {
        case 'convert':
          onConvertToIndividual();
          break;
        case 'add-exercise':
          onShowAddExerciseModal();
          break;
        default:
          break;
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['50%']}
        enablePanDownToClose
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
        <BottomSheetView style={{ padding: 16, paddingBottom: 120 }}>
          <Typography
            variant="h3"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Opciones de Bloque
          </Typography>

          {blockOptions.map((option) => {
            if (!isMultiBlock && option.type === 'convert') return null;

            return (
              <TouchableOpacity
                key={option.type}
                onPress={() => handleOptionPress(option.type)}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Typography variant="body1">{option.label}</Typography>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={onDelete}
            style={{ paddingVertical: 16, paddingHorizontal: 16 }}
          >
            <Typography variant="body1" style={{ color: colors.error[500] }}>
              Eliminar bloque
            </Typography>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

BlockOptionsBottomSheet.displayName = 'BlockOptionsBottomSheet';
