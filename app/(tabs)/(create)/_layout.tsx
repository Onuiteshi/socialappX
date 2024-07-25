import React from 'react';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function CreatePostLayout() {

    return (
        <Stack initialRouteName="index">
            <Stack.Screen name="index" options={{ headerShown: false }}/>
            <Stack.Screen name="preview" options={{ headerShown: false }}/>
        </Stack>
    );
}
