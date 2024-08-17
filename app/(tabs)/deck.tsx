import IconButton from "@/components/IconButton";
import { Colors } from "@/constants/Colors";
import { View, Text, Dimensions, StyleSheet } from "react-native";

export default function TabTwoScreen() {
  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");
  return (
    <View
      className="px-6 py-4"
      style={{ backgroundColor: Colors.dark.background, flex: 1 }}
    >
      <Text className="text-2xl text-white font-bold">Deck</Text>
      <View
        className="absolute"
        style={{ top: window.height - 120, left: window.width - 80 }}
      >
        <IconButton style={styles.fab} icon="plus" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10, // For Android
  },
});
