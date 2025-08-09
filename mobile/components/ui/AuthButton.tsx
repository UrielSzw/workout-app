import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  style,
}) => {
  const { colors } = useColorScheme();

  const buttonStyle: ViewStyle = {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: loading ? 0.7 : 1,
    ...(variant === 'primary' && {
      backgroundColor: colors.primary[500],
    }),
    ...(variant === 'secondary' && {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary[500],
    }),
    ...style,
  };

  const textColor = variant === 'primary' ? 'white' : colors.primary[500];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={{ marginRight: 8 }}
        />
      )}
      <Typography
        variant="button"
        weight="semibold"
        style={{ color: textColor }}
      >
        {title}
      </Typography>
    </TouchableOpacity>
  );
};
