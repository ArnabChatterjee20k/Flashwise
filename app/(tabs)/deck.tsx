import IconButton from "@/components/IconButton";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Link, useRouter } from "expo-router";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { FontAwesome, Ionicons, AntDesign } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

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
      <FlatList
        className="px-2 py-5"
        ItemSeparatorComponent={() => <View className="my-3"></View>}
        data={cards}
        renderItem={({ item: { name, generating } }) => (
          <Card title={name} generating={generating || false} cards={12} />
        )}
      />
      <View
        className="absolute"
        style={{ top: window.height - 120, left: window.width - 80 }}
      >
        <IconButton onPress={create} style={styles.fab} icon="plus" />
      </View>
    </View>
  );
}

interface CardProps {
  title: string;
  cards: number;
  generating: boolean;
  color?: string;
}
function Card({ title, cards, generating }: CardProps) {
  return (
    <TouchableOpacity
      className="w-[95%] h-36 rounded-lg  px-6 py-3 justify-between relative"
      style={{ backgroundColor: "#1B998B" }}
    >
      <View>
        <Text className="text-base font-bold text-white">{title}</Text>
        <Text className="text-base font-normal text-white">{cards} cards</Text>
      </View>
      <View className="flex flex-row items-center gap-2">
        {generating ? (
          <Loader />
        ) : (
          <>
            <Text className="text-base font-medium text-white">Ready</Text>
            <FontAwesome name="rocket" color="white" size={22} />
          </>
        )}
      </View>
      <View className="absolute right-0 top-[50%] mx-3">
        <Ionicons name="chevron-forward-outline" color="white" size={30} />
      </View>
    </TouchableOpacity>
  );
}

function Loader() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      <Text className="text-base font-medium text-white mr-2">Ready</Text>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <AntDesign name="loading1" color="white" size={20} />
      </Animated.View>
    </>
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
