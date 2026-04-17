// src/navigation/BarberStack.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { DashboardScreen } from '../screens/barber/DashboardScreen';
import { AgendaScreen } from '../screens/barber/AgendaScreen';
import { ClientesScreen } from '../screens/barber/ClientesScreen';
import { ConfiguracoesScreen } from '../screens/barber/ConfiguracoesScreen';

const Tab = createBottomTabNavigator();

export function BarberStack() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background.secondary,
          borderTopColor: theme.border.primary,
          height: 60, paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.accent.secondary,
        tabBarInactiveTintColor: theme.text.tertiary,
        tabBarIcon: ({ focused, color }) => {
          const map: Record<string, [string, string]> = {
            Dashboard: ['grid', 'grid-outline'],
            Agenda: ['calendar', 'calendar-outline'],
            Clientes: ['people', 'people-outline'],
            Configuracoes: ['settings', 'settings-outline'],
          };
          const [a, i] = map[route.name] ?? ['help', 'help-outline'];
          return <Ionicons name={focused ? a : i as any} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Agenda" component={AgendaScreen} options={{ title: 'Agenda' }} />
      <Tab.Screen name="Clientes" component={ClientesScreen} options={{ title: 'Clientes' }} />
      <Tab.Screen name="Configuracoes" component={ConfiguracoesScreen} options={{ title: 'Config.' }} />
    </Tab.Navigator>
  );
}