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
import { BottomTabParamList, ClickerParamList, StoreParamList } from '../types';

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
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Store"
        component={StoreNav}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
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
