// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label, onPress, variant = 'primary',
  loading, disabled, style, fullWidth = true,
}: ButtonProps) {
  const { theme } = useTheme();

  const styles = {
    primary: {
      bg: theme.accent.primary,
      text: theme.text.inverse,
      border: theme.accent.primary,
    },
    secondary: {
      bg: 'transparent',
      text: theme.accent.primary,
      border: theme.accent.primary,
    },
    ghost: {
      bg: 'transparent',
      text: theme.text.secondary,
      border: 'transparent',
    },
    danger: {
      bg: theme.status.error,
      text: '#FDFAF6',
      border: theme.status.error,
    },
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        {
          backgroundColor: styles.bg,
          borderColor: styles.border,
          borderWidth: 1.5,
          borderRadius: borderRadius.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
          minHeight: 50,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={styles.text} />
      ) : (
        <Text style={[typography.button, { color: styles.text }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}