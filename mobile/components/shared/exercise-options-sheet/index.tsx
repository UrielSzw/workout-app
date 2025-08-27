import React, { forwardRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  onDelete: () => void;
  onShowReplace: () => void;
  isInMultipleExercisesBlock?: boolean;
  exerciseName?: string | null;
};

export const ExerciseOptionsBottomSheet = forwardRef<BottomSheetModal, Props>(
  (
    { onDelete, onShowReplace, isInMultipleExercisesBlock, exerciseName },
    ref,
  ) => {
    const { colors } = useColorScheme();

    const exerciseOptions = [{ type: 'replace', label: 'Remplazar ejercicio' }];

    const handleOptionPress = (type: string) => {
      switch (type) {
        case 'replace':
          onShowReplace();
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
          <Typography variant="h3" weight="semibold">
            Opciones de Ejercicio
          </Typography>
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginBottom: 16 }}
          >
            {exerciseName}
          </Typography>

          {exerciseOptions.map((option) => (
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
          ))}

          {isInMultipleExercisesBlock && (
            <TouchableOpacity
              onPress={onDelete}
              style={{ paddingVertical: 16, paddingHorizontal: 16 }}
            >
              <Typography variant="body1" style={{ color: colors.error[500] }}>
                Eliminar ejercicio
              </Typography>
            </TouchableOpacity>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

ExerciseOptionsBottomSheet.displayName = 'ExerciseOptionsBottomSheet';
