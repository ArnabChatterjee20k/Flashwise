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
import { useEffect, useRef, useState } from "react";
import { Animated as RNAnimated } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Extrapolation,
  interpolateColor,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

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
    <GestureHandlerRootView
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
    </GestureHandlerRootView>
  );
}

interface CardProps {
  title: string;
  cards: number;
  generating: boolean;
  color?: string;
}
function Card({ title, cards, generating }: CardProps) {
  const [deleted, setDeleted] = useState(false);
  const swipeTranslateX = useSharedValue(0);
  const pressed = useSharedValue(false);
  const WIDTH_SCREEN = Dimensions.get("window").width;
  const MAX_SWIPE = WIDTH_SCREEN - 10;
  async function remove(title: string) {
    setDeleted(true);
    alert(`delted ${title}`);
  }
  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((e) => {
      // Restrict swipe within the defined range
      if (e.translationX > 0 && e.translationX < MAX_SWIPE) {
        swipeTranslateX.value = e.translationX;
      }
    })
    .onFinalize(() => {
      // Check if swipe exceeded the threshold for deletion
      const isShouldDelete = swipeTranslateX.value >= MAX_SWIPE - 20;

      if (isShouldDelete) {
        // Trigger an alert with the message "Delete"
        swipeTranslateX.value = withTiming(
          WIDTH_SCREEN,
          undefined,
          (isDone) => {
            if (isDone) {
              runOnJS(remove)(title);
            }
          }
        );
      } else {
        // Reset swipe position if threshold not met
        swipeTranslateX.value = withSpring(0);
      }

      pressed.value = false;
    });

  const transformStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      swipeTranslateX.value,
      [0, MAX_SWIPE], // Input range: no swipe to max swipe
      ["#1B998B", "#FF0000"] // Output range: initial color to red
    );

    return {
      transform: [{ translateX: swipeTranslateX.value }],
      backgroundColor, // Add the interpolated background color
    };
  });
  const opacityStyle = useAnimatedStyle(() => {
    // Calculate the absolute value of swipeTranslateX to handle both left and right swipes
    const absTranslateX = Math.abs(swipeTranslateX.value);

    // Interpolate the opacity between 1 and 0 based on the swipe distance
    const opacity = interpolate(
      absTranslateX,
      [0, MAX_SWIPE], // Input range (0 to MAX_SWIPE distance)
      [0, 1], // Output range (full opacity to fully transparent)
      Extrapolation.IDENTITY // Ensure it doesn't go below 0 or above 1
    );

    return {
      opacity,
    };
  });

  return (
    <View className="flex flex-row items-center">
      <Animated.View
        className="absolute"
        style={[opacityStyle, { display: deleted ? "none" : "flex" }]}
      >
        <Ionicons name="trash-bin" color="red" size={30} />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View
          className="w-[95%] h-36 rounded-lg px-6 py-3 justify-between relative"
          style={[transformStyle, { backgroundColor: "#1B998B" }]}
        >
          <Text className="text-base font-bold text-white">{title}</Text>
          <Text className="text-base font-normal text-white">
            {cards} cards
          </Text>
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
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function Loader() {
  const spinValue = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = RNAnimated.loop(
      RNAnimated.timing(spinValue, {
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
      <RNAnimated.View style={{ transform: [{ rotate: spin }] }}>
        <AntDesign name="loading1" color="white" size={20} />
      </RNAnimated.View>
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
