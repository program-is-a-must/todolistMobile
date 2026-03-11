/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF7A00';
const tintColorDark = '#FF7A00';
const successLight = '#2E7D32';
const successDark = '#4CAF50';
const ashLight = '#D9D9D9';
const ashDark = '#C9C9C9';
const borderLight = '#E6E6E6';
const borderDark = '#333333';

export const Colors = {
  light: {
    text: '#1F1F1F',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: ashLight,
    tabIconDefault: ashLight,
    tabIconSelected: tintColorLight,
    success: successLight,
    border: borderLight,
  },
  dark: {
    text: '#E6E6E6',
    background: '#1A1A1A',
    tint: tintColorDark,
    icon: ashDark,
    tabIconDefault: ashDark,
    tabIconSelected: tintColorDark,
    success: successDark,
    border: borderDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
