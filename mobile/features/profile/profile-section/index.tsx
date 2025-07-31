import React from "react";
import { View } from "react-native";
import { Typography } from "@/components/ui";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View style={{ marginBottom: 24 }}>
      <Typography variant="h5" weight="semibold" style={{ marginBottom: 16 }}>
        {title}
      </Typography>
      {children}
    </View>
  );
};
