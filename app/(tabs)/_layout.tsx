import { Tabs } from 'expo-router';
import React, {useEffect} from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import {getUser} from "@/auth";
import {useDispatch} from "react-redux";

export default function TabLayout() {
    const dispatch = useDispatch<any>();

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);


  return (
    <Tabs
        initialRouteName="(home)"
      screenOptions={{
        tabBarActiveTintColor: "#E91E63",
        headerShown: false,
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(create)"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
          ),
        }}
      />
        <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
