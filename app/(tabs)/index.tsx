import Pinned from "@/components/Pinned";
import UnSolved from "@/components/UnSolved";
import { Colors } from "@/constants/Colors";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ backgroundColor: Colors.dark.background, flex: 1 }}>
      <Pinned />
      <UnSolved />
    </View>
  );
}
