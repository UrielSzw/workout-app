import React from "react";
import { SafeAreaView, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

type Props = {
  children?: React.ReactNode;
};

export const ScreenWrapper: React.FC<Props> = ({ children }) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {children}
      </View>
    </SafeAreaView>
  );
};
