// src/navigation/ClientStack.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { HomeScreen } from '../screens/client/HomeScreen';
import { AgendamentoScreen } from '../screens/client/AgendamentoScreen';
import { HistoricoScreen } from '../screens/client/HistoricoScreen';
import { PerfilScreen } from '../screens/client/PerfilScreen';
import { ConfirmacaoScreen } from '../screens/client/ConfirmacaoScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Agendamento" component={AgendamentoScreen} />
      <Stack.Screen name="Confirmacao" component={ConfirmacaoScreen} />
    </Stack.Navigator>
  );
}

export function ClientStack() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background.secondary,
          borderTopColor: theme.border.primary,
          borderTopWidth: 1,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: theme.accent.secondary,
        tabBarInactiveTintColor: theme.text.tertiary,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Home: ['home', 'home-outline'],
            Historico: ['time', 'time-outline'],
            Perfil: ['person', 'person-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['help', 'help-outline'];
          return <Ionicons name={focused ? active : inactive as any} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Início' }} />
      <Tab.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Histórico' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}