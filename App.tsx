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
import { LevelProvider } from './context/LevelContext';
import { GameProvider } from './game/game';
import { UiSettingsProvider } from './context/UiSettingsContext';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>

        <UiSettingsProvider>
          <UpdateProvider>
            <WorldProvider>
              <LevelProvider>
                <GameProvider>
                  
                  <Navigation colorScheme={colorScheme} />
                  <StatusBar />

                </GameProvider>
              </LevelProvider>
            </WorldProvider>
          </UpdateProvider>
        </UiSettingsProvider>

      </SafeAreaProvider>
    );
  }
}
