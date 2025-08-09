import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { SafeAreaView, View } from 'react-native';

type Props = {
  children?: React.ReactNode;
};

export const ScreenWrapper: React.FC<Props> = ({ children }) => {
  const { colors } = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {children}
      </View>
    </SafeAreaView>
  );
};
