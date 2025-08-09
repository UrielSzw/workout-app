import React, { forwardRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IRepsType } from '@/types/routine';

type Props = {
  currentRepsType: IRepsType;
  onSelectRepsType: (type: IRepsType) => void;
};

export const RepsTypeBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ currentRepsType, onSelectRepsType }, ref) => {
    const { colors } = useColorScheme();

    const repsTypes = [
      { type: 'reps' as const, label: 'Repeticiones' },
      { type: 'range' as const, label: 'Rango de Repeticiones' },
      { type: 'time' as const, label: 'Tiempo' },
      { type: 'distance' as const, label: 'Distancia' },
    ];

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['40%']}
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
        <BottomSheetView style={{ padding: 16, paddingBottom: 40 }}>
          <Typography
            variant="h3"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Tipo de Medición
          </Typography>

          {repsTypes.map((option) => (
            <TouchableOpacity
              key={option.type}
              onPress={() => onSelectRepsType(option.type)}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                backgroundColor:
                  currentRepsType === option.type
                    ? colors.primary[500] + '20'
                    : 'transparent',
              }}
            >
              <Typography
                variant="body1"
                style={{
                  color:
                    currentRepsType === option.type
                      ? colors.primary[500]
                      : colors.text,
                  fontWeight: currentRepsType === option.type ? '600' : '400',
                }}
              >
                {option.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

RepsTypeBottomSheet.displayName = 'RepsTypeBottomSheet';
