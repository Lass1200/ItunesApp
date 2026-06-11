import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { RootStackParamList } from './dossier/types/index';
import SearchScreen from './dossier/screens/SearchScreen';
import DetailScreen from './dossier/screens/DetailScreen';
import FavoritesScreen from './dossier/screens/FavoritesScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerStyle: { backgroundColor: '#1C1C1E' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' }
        }}
      >
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Détails du morceau' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Mes Favoris' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}