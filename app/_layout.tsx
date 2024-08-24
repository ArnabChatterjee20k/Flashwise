import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import IconButton from "@/components/IconButton";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(
  "https://admired-cormorant-413.convex.cloud",
  { skipConvexDeploymentUrlCheck: true }
);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  // using Portal Host inside the GestureHandlerRootView so that we can use portalised ui inside the gesturehandler
  return (
    <ConvexProvider client={convex}>
      <GestureHandlerRootView>
        <Host>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="form"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen
              name="flash"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen
              name="ai"
              options={{
                presentation: "modal",
                title: "Flash Card AI",
                headerTitleStyle: { color: "white" },
                headerStyle: { backgroundColor: "black" },
                headerLeft: (props) => <BackBtn />,
              }}
            />
          </Stack>
        </Host>
      </GestureHandlerRootView>
    </ConvexProvider>
  );
}
const BackBtn = () => {
  const router = useRouter();
  return <IconButton icon="arrowleft" onPress={() => router.back()} />;
};
