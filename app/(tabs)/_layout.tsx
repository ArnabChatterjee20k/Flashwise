import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.dark.background }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.dark.tint,
          headerShown: false,
          tabBarStyle: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            paddingBottom: 5,
            paddingTop: 5,
            borderColor: "black",
            backgroundColor: "#0d090f",
            elevation: 4,
            position: "absolute",
            shadowColor: "#0d090f",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="deck"
          options={{
            title: "Deck",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "cards" : "cards-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
