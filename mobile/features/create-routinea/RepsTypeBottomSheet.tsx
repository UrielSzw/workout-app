import React, { forwardRef } from "react";
import { TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Typography } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

interface RepsTypeBottomSheetProps {
  currentRepsType: "reps" | "range" | "time" | "distance";
  onSelectRepsType: (type: "reps" | "range" | "time" | "distance") => void;
}

export const RepsTypeBottomSheet = forwardRef<
  BottomSheetModal,
  RepsTypeBottomSheetProps
>(({ currentRepsType, onSelectRepsType }, ref) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const repsTypes = [
    { type: "reps" as const, label: "Repeticiones" },
    { type: "range" as const, label: "Rango de Repeticiones" },
    { type: "time" as const, label: "Tiempo" },
    { type: "distance" as const, label: "Distancia" },
  ];

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["40%"]}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
    >
      <BottomSheetView style={{ padding: 16, paddingBottom: 40 }}>
        <Typography variant="h3" weight="semibold" style={{ marginBottom: 16 }}>
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
                  ? colors.primary[500] + "20"
                  : "transparent",
            }}
          >
            <Typography
              variant="body1"
              style={{
                color:
                  currentRepsType === option.type
                    ? colors.primary[500]
                    : colors.text,
                fontWeight: currentRepsType === option.type ? "600" : "400",
              }}
            >
              {option.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

RepsTypeBottomSheet.displayName = "RepsTypeBottomSheet";
