import Pinned from "@/components/Pinned";
import UnSolved from "@/components/UnSolved";
import { Colors } from "@/constants/Colors";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ backgroundColor: Colors.dark.background, flex: 1 }}>
      <Redirect href="/form"/>
      <Pinned />
      <UnSolved />
    </View>
  );
}
