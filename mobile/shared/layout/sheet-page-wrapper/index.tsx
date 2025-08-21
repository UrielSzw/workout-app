import { useColorScheme } from '@/hooks/useColorScheme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
};

export const SheetPageWrapper = ({ children }: Props) => {
  const { colors } = useColorScheme();

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {children}
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
