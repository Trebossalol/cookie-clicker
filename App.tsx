import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Text} from 'react-native'
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { UpdatePendingProvider as UpdateProvider } from './context/UpdateContext'
import { WorldProvider } from './context/WorldContext';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <UpdateProvider>
          <WorldProvider>

            <Navigation colorScheme={colorScheme} />
            <StatusBar />

          </WorldProvider>
        </UpdateProvider>
      </SafeAreaProvider>
    );
  }
}
