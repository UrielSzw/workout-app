import React, { forwardRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Typography } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

interface SetTypeBottomSheetProps {
  onSelectSetType: (
    type:
      | "normal"
      | "warmup"
      | "drop"
      | "failure"
      | "cluster"
      | "rest-pause"
      | "mechanical"
  ) => void;
  onDeleteSet: () => void;
}

export const SetTypeBottomSheet = forwardRef<
  BottomSheetModal,
  SetTypeBottomSheetProps
>(({ onSelectSetType, onDeleteSet }, ref) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const setTypes = [
    { type: "normal" as const, label: "Normal" },
    { type: "warmup" as const, label: "Calentamiento" },
    { type: "failure" as const, label: "Al Fallo" },
    { type: "drop" as const, label: "Drop Set" },
    { type: "cluster" as const, label: "Cluster" },
    { type: "rest-pause" as const, label: "Rest-Pause" },
    { type: "mechanical" as const, label: "Mecánico" },
  ];

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["50%"]}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
    >
      <BottomSheetView style={{ padding: 16, paddingBottom: 40 }}>
        <Typography variant="h3" weight="semibold" style={{ marginBottom: 16 }}>
          Tipo de Serie
        </Typography>

        {setTypes.map((option) => (
          <TouchableOpacity
            key={option.type}
            onPress={() => onSelectSetType(option.type)}
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

        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginVertical: 8,
          }}
        />

        <TouchableOpacity
          onPress={onDeleteSet}
          style={{ paddingVertical: 16, paddingHorizontal: 16 }}
        >
          <Typography variant="body1" style={{ color: colors.error[500] }}>
            Eliminar Serie
          </Typography>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

SetTypeBottomSheet.displayName = "SetTypeBottomSheet";
