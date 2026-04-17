import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, ...props }: InputProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[{ marginBottom: spacing.md }, containerStyle]}>
      {label && (
        <Text style={[typography.label, { color: theme.text.secondary, marginBottom: spacing.xs }]}>
          {label}
        </Text>
      )}
      <TextInput
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={theme.text.tertiary}
        style={[
          typography.body,
          {
            backgroundColor: theme.background.input,
            color: theme.text.primary,
            borderColor: error ? theme.status.error : focused ? theme.border.focus : theme.border.primary,
            borderWidth: focused ? 1.5 : 1,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 4,
            height: 50,
          },
        ]}
      />
      {error && (
        <Text style={[typography.caption, { color: theme.status.error, marginTop: 4 }]}>
          {error}
        </Text>
      )}
    </View>
  );
}