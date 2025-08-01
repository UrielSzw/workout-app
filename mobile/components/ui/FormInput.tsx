import React, { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { Typography } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

interface FormInputProps extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  isPassword = false,
  value,
  onChangeText,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animation] = useState(new Animated.Value(value ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animation]);

  const labelStyle = {
    position: "absolute" as const,
    left: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 4,
    fontSize: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        colors.textMuted,
        isFocused ? colors.primary[500] : colors.text,
      ],
    }),
    top: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -8],
    }),
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ position: "relative" }}>
        <TextInput
          {...props}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          style={{
            borderWidth: 2,
            borderColor: error
              ? colors.error[500]
              : isFocused
                ? colors.primary[500]
                : colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            fontSize: 16,
            color: colors.text,
            backgroundColor: colors.background,
            paddingRight: isPassword ? 50 : 16,
          }}
          placeholderTextColor={colors.textMuted}
        />

        <Animated.Text style={labelStyle}>{label}</Animated.Text>

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 16,
              top: 16,
              padding: 4,
            }}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.textMuted} />
            ) : (
              <Eye size={20} color={colors.textMuted} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Typography
          variant="caption"
          style={{ color: colors.error[500], marginTop: 4, marginLeft: 4 }}
        >
          {error}
        </Typography>
      )}
    </View>
  );
};
