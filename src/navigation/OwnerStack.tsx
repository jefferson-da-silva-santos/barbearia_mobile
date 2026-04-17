// src/navigation/OwnerStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { typography } from '../theme/typography';
import { spacing } from '@/theme/spacing';

function PainelGeralScreen() {
  const { theme } = useTheme();
  const { signOut } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h2, { color: theme.text.primary }]}>Painel do Dono</Text>
        <Text style={[typography.body, { color: theme.text.tertiary, marginTop: spacing.sm, marginBottom: spacing.xl }]}>
          Visão geral da barbearia, equipe e faturamento
        </Text>
        <Button label="Sair" onPress={signOut} variant="ghost" />
      </View>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();
export function OwnerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PainelGeral" component={PainelGeralScreen} />
    </Stack.Navigator>
  );
}