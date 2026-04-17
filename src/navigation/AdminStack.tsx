// src/navigation/AdminStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { typography } from '../theme/typography';
import { spacing } from '@/theme/spacing';

function PainelAdminScreen() {
  const { theme } = useTheme();
  const { signOut } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h2, { color: theme.text.primary }]}>Painel Admin</Text>
        <Text style={[typography.body, { color: theme.text.tertiary, marginTop: spacing.sm, marginBottom: spacing.xl }]}>
          Gestão global da plataforma SaaS
        </Text>
        <Button label="Sair" onPress={signOut} variant="ghost" />
      </View>
    </SafeAreaView>
  );
}

const Stack2 = createNativeStackNavigator();
export function AdminStack() {
  return (
    <Stack2.Navigator screenOptions={{ headerShown: false }}>
      <Stack2.Screen name="PainelAdmin" component={PainelAdminScreen} />
    </Stack2.Navigator>
  );
}