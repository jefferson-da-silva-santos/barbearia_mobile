import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ClientStack } from './ClientStack';
import { BarberStack } from './BarberStack';
import { OwnerStack } from './OwnerStack';
import { AdminStack } from './AdminStack';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background.primary }}>
        <ActivityIndicator color={theme.accent.primary} size="large" />
      </View>
    );
  }

  function getStackForRole() {
    if (!isAuthenticated) return <Stack.Screen name="Login" component={LoginScreen} />;
    switch (user?.role) {
      case 'CLIENTE': return <Stack.Screen name="Client" component={ClientStack} />;
      case 'BARBEIRO': return <Stack.Screen name="Barber" component={BarberStack} />;
      case 'DONO': return <Stack.Screen name="Owner" component={OwnerStack} />;
      case 'ADMIN': return <Stack.Screen name="Admin" component={AdminStack} />;
      default: return <Stack.Screen name="Login" component={LoginScreen} />;
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {getStackForRole()}
      </Stack.Navigator>
    </NavigationContainer>
  );
}