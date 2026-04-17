import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, style, padding = spacing.md }: CardProps) {
  const { theme } = useTheme();
  return (
    <View style={[
      {
        backgroundColor: theme.background.card,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.border.primary,
        padding,
      },
      style,
    ]}>
      {children}
    </View>
  );
}