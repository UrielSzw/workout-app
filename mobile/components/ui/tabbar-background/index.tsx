import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

export const TabBarBackground = () => {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
};
