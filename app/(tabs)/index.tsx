import { Image, StyleSheet, Platform, Text } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import Pinned from "@/components/Pinned";
import UnSolved from "@/components/UnSolved";

export default function HomeScreen() {
  return (
    <>
      <Pinned />
      <UnSolved />
    </>
  );
}