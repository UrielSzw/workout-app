import { getThemeColors } from '@/constants/Colors';
import { mainStore } from '@/store/main-store';

export const useColorScheme = () => {
  const colorScheme = mainStore((state) => state.colorScheme);
  const setColorScheme = mainStore((state) => state.setColorScheme);

  const isDarkMode = colorScheme === 'dark';
  const colors = getThemeColors(isDarkMode);

  return { colorScheme, setColorScheme, colors, isDarkMode };
};
