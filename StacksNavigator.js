import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "./config/theme";
import TabsNavigator from "./TabsNavigator";
import Chat from "./screens/Chat";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";

const Stack = createNativeStackNavigator();

const StacksNavigator = () => {
  const theme = { mode: "dark" };
  const activeColors = colors[theme.mode];

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "left",
        headerTitleStyle: {
          paddingLeft: 10,
        },
        headerStyle: {
          backgroundColor: activeColors.secondary,
        },
        headerTintColor: activeColors.tint,
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          presentation: "fullScreenModal",
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default StacksNavigator;
