/**
 * Roost Recorder Theme Colors
 */

export const roostColors = {
  primary: '#e4a324',
  primaryDark: '#c28d1f',
  primaryLight: '#f0b847',
} as const;

export const lightTheme = {
  // Brand colors
  ...roostColors,

  // Background colors
  background: '#ffffff',
  backgroundSecondary: '#f9f9f9',
  backgroundTertiary: '#f5f5f5',
  backgroundHover: '#f0f0f0',

  // Surface colors
  surface: '#ffffff',
  surfaceElevated: '#ffffff',

  // Border colors
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  borderDark: '#d0d0d0',

  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#ffffff',

  // Button colors
  buttonPrimary: roostColors.primary,
  buttonPrimaryHover: roostColors.primaryDark,
  buttonSecondary: '#e8e8e8',
  buttonSecondaryHover: '#d8d8d8',
  buttonText: '#555555',

  // Recording state
  recording: '#e74c3c',
  recordingHover: '#c0392b',

  // Active state
  active: '#3498db',
  activeHover: '#2980b9',

  // Status colors
  success: '#27ae60',
  error: '#e74c3c',
  errorBackground: '#fff5f5',
  errorLight: '#fee',
  warning: '#f39c12',
  info: '#3498db',
  infoBackground: '#f0f8ff',

  // Step card colors
  stepBackground: '#ffffff',
  stepBorder: '#e0e0e0',
  stepNumberBackground: '#f0f0f0',
  stepNumberText: '#666666',
  stepHover: 'rgba(0, 0, 0, 0.08)',

  // Scrollbar
  scrollbarTrack: '#f5f5f5',
  scrollbarThumb: '#cccccc',
  scrollbarThumbHover: '#aaaaaa',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
} as const;

export const darkTheme = {
  // Brand colors
  ...roostColors,

  // Background colors
  background: '#1e1e1e',
  backgroundSecondary: '#252525',
  backgroundTertiary: '#2d2d2d',
  backgroundHover: '#3a3a3a',

  // Surface colors
  surface: '#2d2d2d',
  surfaceElevated: '#363636',

  // Border colors
  border: '#404040',
  borderLight: '#4a4a4a',
  borderDark: '#333333',

  // Text colors
  textPrimary: '#e0e0e0',
  textSecondary: '#b0b0b0',
  textTertiary: '#808080',
  textInverse: '#1e1e1e',

  // Button colors
  buttonPrimary: roostColors.primary,
  buttonPrimaryHover: roostColors.primaryLight,
  buttonSecondary: '#3a3a3a',
  buttonSecondaryHover: '#4a4a4a',
  buttonText: '#c0c0c0',

  // Recording state
  recording: '#e74c3c',
  recordingHover: '#f55a4a',

  // Active state
  active: '#3498db',
  activeHover: '#5dade2',

  // Status colors
  success: '#27ae60',
  error: '#e74c3c',
  errorBackground: '#2d1f1f',
  errorLight: '#3d2525',
  warning: '#f39c12',
  info: '#3498db',
  infoBackground: '#1f2d3d',

  // Step card colors
  stepBackground: '#2d2d2d',
  stepBorder: '#404040',
  stepNumberBackground: '#3a3a3a',
  stepNumberText: '#b0b0b0',
  stepHover: 'rgba(255, 255, 255, 0.05)',

  // Scrollbar
  scrollbarTrack: '#2d2d2d',
  scrollbarThumb: '#555555',
  scrollbarThumbHover: '#666666',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.4)',
} as const;

export type Theme = typeof lightTheme;
