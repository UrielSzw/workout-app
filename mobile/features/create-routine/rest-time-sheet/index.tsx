import React, { forwardRef, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Timer, Minus, Plus } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/constants/Colors';

type Props = {
  currentRestTime: number; // in seconds
  onSelectRestTime: (seconds: number) => void;
};

export const RestTimeBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ currentRestTime, onSelectRestTime }, ref) => {
    const colorScheme = useColorScheme();
    const colors = getThemeColors(colorScheme === 'dark');
    const [selectedTime, setSelectedTime] = useState(currentRestTime);

    // Predefined rest time options (in seconds)
    const quickOptions = [
      { label: 'Sin descanso', value: 0 },
      { label: '30 seg', value: 30 },
      { label: '45 seg', value: 45 },
      { label: '1 min', value: 60 },
      { label: '1:30 min', value: 90 },
      { label: '2 min', value: 120 },
      { label: '2:30 min', value: 150 },
      { label: '3 min', value: 180 },
      { label: '4 min', value: 240 },
      { label: '5 min', value: 300 },
    ];

    const formatTime = (seconds: number) => {
      if (seconds === 0) return 'Sin descanso';
      if (seconds < 60) return `${seconds}s`;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0
        ? `${mins}:${secs.toString().padStart(2, '0')} min`
        : `${mins} min`;
    };

    const handleIncrease = () => {
      const newTime = selectedTime + 15; // Increment by 15 seconds
      if (newTime <= 600) {
        // Max 10 minutes
        setSelectedTime(newTime);
      }
    };

    const handleDecrease = () => {
      const newTime = selectedTime - 15; // Decrement by 15 seconds
      if (newTime >= 0) {
        setSelectedTime(newTime);
      }
    };

    const handleSave = () => {
      onSelectRestTime(selectedTime);
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['60%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      >
        <BottomSheetView style={{ padding: 16, paddingBottom: 40 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Timer size={20} color={colors.primary[500]} />
            <Typography
              variant="h3"
              weight="semibold"
              style={{ marginLeft: 8 }}
            >
              Tiempo de Descanso
            </Typography>
          </View>

          {/* Custom Time Selector */}
          <View style={{ marginBottom: 24 }}>
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginBottom: 12 }}
            >
              Tiempo personalizado
            </Typography>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background,
                borderRadius: 12,
                padding: 16,
                borderWidth: 2,
                borderColor: colors.primary[500] + '30',
              }}
            >
              <TouchableOpacity
                onPress={handleDecrease}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Minus size={20} color="white" />
              </TouchableOpacity>

              <View
                style={{ flex: 1, alignItems: 'center', marginHorizontal: 24 }}
              >
                <Typography
                  variant="h2"
                  weight="bold"
                  style={{ color: colors.primary[500] }}
                >
                  {formatTime(selectedTime)}
                </Typography>
              </View>

              <TouchableOpacity
                onPress={handleIncrease}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Options */}
          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginBottom: 12 }}
          >
            Opciones rápidas
          </Typography>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {quickOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setSelectedTime(option.value)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  marginRight: 8,
                  borderRadius: 20,
                  backgroundColor:
                    selectedTime === option.value
                      ? colors.primary[500]
                      : colors.border + '40',
                  borderWidth: 1,
                  borderColor:
                    selectedTime === option.value
                      ? colors.primary[500]
                      : colors.border,
                }}
              >
                <Typography
                  variant="caption"
                  weight="medium"
                  style={{
                    color:
                      selectedTime === option.value ? 'white' : colors.text,
                  }}
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: colors.primary[500],
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body1"
              weight="semibold"
              style={{ color: 'white' }}
            >
              Aplicar Tiempo
            </Typography>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

RestTimeBottomSheet.displayName = 'RestTimeBottomSheet';
