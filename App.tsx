import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import { UpdatePendingProvider as UpdateProvider } from './context/UpdateContext'
import { WorldProvider } from './context/WorldContext';
import { LevelProvider } from './context/LevelContext';
import { GameProvider } from './game/game';
import { UiSettingsProvider } from './context/UiSettingsContext';

export default function App() {
  const isLoadingComplete = useCachedResources();

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
                  
                  <Navigation />
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
