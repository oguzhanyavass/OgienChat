import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { colors } from "./config/theme";
import ChatList from "./screens/ChatList";
import Settings from "./screens/Settings";

const Tabs = createBottomTabNavigator();

const TabsNavigator = () => {
  const navigation = useNavigation();

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        navigation.navigate("SignUp");
      }
    });
  }, []);

  const theme = { mode: "dark" };
  const activeColors = colors[theme.mode];

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: activeColors.secondary,
        },
        headerTintColor: activeColors.tint,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "ChatList") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          // İstediğiniz herhangi bir bileşeni burada döndürebilirsiniz!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: activeColors.accent,
        tabBarInactiveTintColor: activeColors.tint,
        tabBarStyle: {
          backgroundColor: activeColors.secondary,
        },
      })}
    >
      <Tabs.Screen name="ChatList" component={ChatList} />
      <Tabs.Screen name="Settings" component={Settings} />
    </Tabs.Navigator>
  );
};

export default TabsNavigator;
