/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import Clicker from '../screens/Clicker';
import GameStore from '../screens/GameStore';
import Settings from '../screens/Settings';
import Worlds from '../screens/Worlds';
import { BottomTabParamList, ClickerParamList, SettingsParamList, StoreParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Clicker"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Clicker"
        component={ClickerNav}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="fast-food" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Store"
        component={StoreNav}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name='cart-outline' color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsNav}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name='settings-outline' color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<ClickerParamList>();

function ClickerNav() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="Clicker"
        component={Clicker}
        options={{ headerTitle: 'Clicker' }}
      />
      <TabOneStack.Screen name='Worlds' component={Worlds} options={{ title: 'Worlds' }} />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<StoreParamList>();

function StoreNav() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="Store"
        component={GameStore}
        options={{ headerTitle: 'Store' }}
      />
    </TabTwoStack.Navigator>
  );
}


const TabThreeStack = createStackNavigator<SettingsParamList>();

function SettingsNav() {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen
        name="Settings"
        component={Settings}
        options={{ headerTitle: 'Store' }}
      />
    </TabThreeStack.Navigator>
  );
}
