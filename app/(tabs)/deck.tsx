import IconButton from "@/components/IconButton";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Link, useRouter } from "expo-router";
import { View, Text, Dimensions, StyleSheet } from "react-native";

export default function TabTwoScreen() {
  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");
  const router = useRouter();
  const addFlashCard = useMutation(api.cards.createFlashCard);
  const create = async () => {
    const flashCardId = await addFlashCard({ title: "Untitled" });
    router.push({ pathname: "/form", params: { flashCardID: flashCardId } });
  };
  const cards = useQuery(api.cards.getFlashCard);
  return (
    <View
      className="px-6 py-4"
      style={{ backgroundColor: Colors.dark.background, flex: 1 }}
    >
      <Text className="text-2xl text-white font-bold">Deck</Text>
      {cards?.map(({ name, _id }) => (
        <Link
          className="text-white text-2xl"
          href={{ pathname: "/form", params: { flashCardID: _id } }}
        >
          {name}
        </Link>
      ))}
      <View
        className="absolute"
        style={{ top: window.height - 120, left: window.width - 80 }}
      >
        <IconButton onPress={create} style={styles.fab} icon="plus" />
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
    backgroundColor: "black",
  },
});
