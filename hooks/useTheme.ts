import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/design';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // For now, we'll use light theme only
  // In the future, this can be extended for dark mode support
  return {
    colors: Colors,
    isDark: false,
    colorScheme: 'light' as const,
  };
}