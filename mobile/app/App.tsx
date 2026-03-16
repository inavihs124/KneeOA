import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import DeviceConnectScreen from './screens/DeviceConnectScreen';
import SessionScreen from './screens/SessionScreen';
import HistoryScreen from './screens/HistoryScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons: Record<string, string> = { Home: '🏠', Session: '⚡', History: '📋', Analytics: '📊', Settings: '⚙️' };

function MainTabs() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: { backgroundColor: '#0A1628', borderTopColor: '#1E3A5F', height: 70, paddingBottom: 10, paddingTop: 8 },
            tabBarActiveTintColor: '#00E5A0',
            tabBarInactiveTintColor: '#8899AA',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>{tabIcons[route.name]}</Text>,
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }
        })}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Session" component={SessionScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Analytics" component={AnalyticsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="DeviceConnect" component={DeviceConnectScreen} options={{ presentation: 'modal' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
