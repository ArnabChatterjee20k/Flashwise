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
  FlatList,
  Vibration,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, Ionicons, AntDesign } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
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
import BottomSheet from "@gorhom/bottom-sheet";
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

  const snapPoints = useMemo(() => ["40%"], []);
  const sheetRef = useRef<BottomSheet>(null);
  const openSheet = () => {
    Vibration.vibrate(1);
    sheetRef.current?.expand();
  };

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
        renderItem={({ item: { _id, name, generating } }) => (
          <Card
            _id={_id}
            title={name}
            generating={generating || false}
            cards={12}
            onpress={openSheet}
          />
        )}
      />
      <View
        className="absolute"
        style={{ top: window.height - 120, left: window.width - 80 }}
      >
        <IconButton onPress={create} style={styles.fab} icon="plus" />
      </View>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: "#fff" }}
        backgroundStyle={{ backgroundColor: "#1d0f4e", zIndex: 10000 }}
      >
        <Text>hello</Text>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

interface CardProps {
  _id: string;
  title: string;
  cards: number;
  generating: boolean;
  color?: string;
  onpress?: () => void;
}
function Card({ _id, title, cards, generating, onpress }: CardProps) {
  const [deleted, setDeleted] = useState(false);
  const swipeTranslateX = useSharedValue(0);
  const pressed = useSharedValue(false);
  const WIDTH_SCREEN = Dimensions.get("window").width;
  const MAX_SWIPE = WIDTH_SCREEN - 10;

  async function remove(title: string) {
    setDeleted(true);
    alert(`Deleted ${title}`);
  }

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((e) => {
      if (e.translationX > 0 && e.translationX < MAX_SWIPE) {
        swipeTranslateX.value = e.translationX;
      }
    })
    .onFinalize(() => {
      const isShouldDelete = swipeTranslateX.value >= MAX_SWIPE - 20;

      if (isShouldDelete) {
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
        swipeTranslateX.value = withSpring(0);
      }

      pressed.value = false;
    });

  const transformStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      swipeTranslateX.value,
      [0, MAX_SWIPE],
      ["#1B998B", "#FF0000"]
    );

    return {
      transform: [{ translateX: swipeTranslateX.value }],
      backgroundColor,
    };
  });

  const opacityStyle = useAnimatedStyle(() => {
    const absTranslateX = Math.abs(swipeTranslateX.value);
    const opacity = interpolate(
      absTranslateX,
      [0, MAX_SWIPE],
      [0, 1],
      Extrapolation.IDENTITY
    );

    return {
      opacity,
    };
  });
  const AnimatedTouch = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View className="flex flex-row items-center">
      <Animated.View
        className="absolute"
        style={[opacityStyle, { display: deleted ? "none" : "flex" }]}
      >
        <Ionicons name="trash-bin" color="red" size={30} />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[transformStyle, { backgroundColor: "#1B998B" }]} className="w-[95%] h-36 rounded-lg px-6 py-3 relative">
          <AnimatedTouch
            onLongPress={onpress}
            className="flex-1 justify-between"
          >
            <View>
              <Text className="text-base font-bold text-white">{title}</Text>
              <Text className="text-base font-normal text-white">
                {cards} cards
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              {generating ? (
                <Loader />
              ) : (
                <>
                  <Text className="text-base font-medium text-white">
                    Ready
                  </Text>
                  <FontAwesome name="rocket" color="white" size={22} />
                </>
              )}
            </View>
            <View className="absolute right-0 top-[40%] mx-3">
              <Ionicons
                name="chevron-forward-outline"
                color="white"
                size={30}
              />
            </View>
          </AnimatedTouch>
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
