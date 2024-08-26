import IconButton from "@/components/IconButton";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  Vibration,
  TouchableOpacity,
} from "react-native";
import {
  FontAwesome,
  Ionicons,
  AntDesign,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Icon, Menu } from "react-native-paper";
import { Portal } from "react-native-portalize";
import { Id } from "@/convex/_generated/dataModel";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const snapPoints = useMemo(() => ["25%"], []);
  const sheetRef = useRef<BottomSheet>(null);
  const [sheetID, setSheetID] = useState("");
  const currentInteractedCard = cards
    ?.filter(({ _id }) => _id === sheetID)
    .at(0);

  const openSheet = (_id: string) => {
    Vibration.vibrate(1);
    setSheetID(_id);
    sheetRef.current?.expand();
  };
  const onCloseSheet = () => {
    setSheetID("");
  };
  const goToForm = (flashCardId: string) => {
    // router.push({ pathname: "/form", params: { flashCardID: flashCardId } });
    router.push({ pathname: "/flash", params: { flashCardID: flashCardId } });
  };
  useFocusEffect(
    useCallback(() => {
      return () => sheetRef.current?.close();
    }, [])
  );
  const setPinnedCard = useMutation(api.cards.updateFlashCard);
  return (
    <View
      className="px-6 py-12"
      style={{ backgroundColor: "#1F1D2B", flex: 1 }}
    >
      {currentInteractedCard && <View style={styles.blurOverlay}></View>}
      <View>
        <Text className="text-3xl text-white font-bold">My Deck</Text>
        <Text className="text-lg text-white font-normal">See and create your flash cars</Text>
      </View>
      
      <FlatList
        className="px-2 pt-8 pb-6"
        ItemSeparatorComponent={() => <View className="my-3"></View>}
        data={cards}
        renderItem={({ item: { _id, name, generating, pinned } }) => (
          <Card
            _id={_id}
            title={name}
            generating={generating || false}
            pinned={pinned || false}
            cards={12}
            onpress={() => openSheet(_id)}
            onclick={() => goToForm(_id)}
          />
        )}
      />
      <View
        className="absolute"
        style={{ top: window.height - 120, left: window.width - 80 }}
      >
        <IconButton onPress={create} style={styles.fab} icon="plus" />
      </View>
      <Portal>
        <BottomSheet
          onClose={onCloseSheet}
          ref={sheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          handleIndicatorStyle={{ backgroundColor: "white" }}
          backgroundStyle={{ backgroundColor: "#232323" }}
        >
          <View style={{ flex: 1 }} className="p-6 space-y-4">
            <TouchableOpacity
              className="flex flex-row items-center justify-between px-2"
              onPress={() => {
                setPinnedCard({
                  id: sheetID as Id<"flash">,
                  pin: currentInteractedCard?.pinned ? false : true,
                });
              }}
            >
              <View className="flex flex-row gap-2 items-center">
                <MaterialIcons
                  name={
                    currentInteractedCard?.pinned
                      ? "bookmark-remove"
                      : "bookmark-add"
                  }
                  size={22}
                  color="white"
                />
                <Text className="text-white text-lg">
                  {currentInteractedCard?.pinned ? "Unpin" : "Pin"}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row items-center justify-between px-2">
              <View className="flex flex-row gap-2 items-center">
                <MaterialIcons name="api" size={22} color="white" />
                <Text className="text-white text-lg">Regenerate</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-row items-center justify-between px-2">
              <View className="flex flex-row gap-2 items-center">
                <MaterialIcons
                  name="delete-outline"
                  size={22}
                  color="#e85954"
                />
                <Text className="text-[#e85954] text-lg">Delete</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#e85954" />
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </Portal>
    </View>
  );
}

interface CardProps {
  _id: string;
  title: string;
  cards: number;
  generating: boolean;
  color?: string;
  onpress?: () => void;
  onclick?: () => void;
  pinned: boolean;
}
function Card({
  _id,
  title,
  cards,
  generating,
  onpress,
  onclick,
  pinned,
}: CardProps) {
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
      ["#272635", "#FF0000"]
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
        <Animated.View
          style={[transformStyle, { backgroundColor: "#272635" }]}
          className="w-[95%] h-24 rounded-lg px-6 py-3 relative"
        >
          <AnimatedTouch
            onLongPress={onpress}
            onPress={onclick}
            className="flex-1 justify-between"
          >
            <View>
              <Text className="text-xl font-bold text-white">{title}</Text>
              <Text className="text-lg font-normal text-white">
                {cards} cards
              </Text>
            </View>
            <View className="absolute right-0 top-[30%] mx-3">
              <Ionicons
                name="chevron-forward-outline"
                color="white"
                size={25}
              />
            </View>
            {pinned ? (
              <View className="absolute -right-3 top-0">
                <Entypo name="pin" color="white" size={22} />
              </View>
            ) : (
              <></>
            )}
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
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
});
