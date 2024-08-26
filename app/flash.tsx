import ThemedText from "@/components/ThemedText";
import { AntDesign } from "@expo/vector-icons";
import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Card, Icon, Text } from "react-native-paper";
import Swiper from "react-native-deck-swiper";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Portal } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function CustomCard() {
  const snapPoints = React.useMemo(() => ["90%"], []);
  const sheetRef = React.useRef<BottomSheet>(null);
  const [content, setContent] = React.useState("");
  function getFullAnswer(answer: string) {
    setContent(answer);
    sheetRef.current?.expand();
  }
  return (
    <View style={styles.container}>
      <RedFilledCircle />
      <RedOutlinedCircle />
      <View className="px-2 justify-center flex-1 space-y-1 relative">
        <SwiperArea onFullAnswer={getFullAnswer} />
        <View className="flex-row w-full absolute bottom-[15%] left-[10]  justify-between space-x-4 px-4 -mb-10">
          <TouchableOpacity className="bg-[#d5724c] shadow-sm rounded-lg p-3 flex-row justify-center flex-1">
            <Text className="text-white font-bold text-xl">Undone</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#09a57a] shadow-sm  rounded-lg p-3 flex-row justify-center flex-1">
            <Text className="text-white font-bold text-xl">Read</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Portal>
        <BottomSheet
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          handleIndicatorStyle={{ backgroundColor: "white" }}
          backgroundStyle={{ backgroundColor: "#494949" }}
        >
          <View className="flex-1 px-5 py-5">
            <BottomSheetScrollView style={{ height: 330, flex: 1 }}>
              <ThemedText className="font-medium font-mono text-xl text-[#EEE3D7]">
                {content}
              </ThemedText>
            </BottomSheetScrollView>
          </View>
        </BottomSheet>
      </Portal>
    </View>
  );
}

interface SwipeAreaProps {
  onFullAnswer: (answer: string) => void;
}

function SwiperArea({ onFullAnswer }: SwipeAreaProps) {
  const params = useLocalSearchParams<{ flashCardID: Id<"flash"> }>();
  const cards = useQuery(api.cards.getCards, {
    flashCardId: params.flashCardID,
  });
  const marginTop = Math.floor(Dimensions.get("window").width / 6);
  if (!cards?.length) return;
  return (
    <View className="w-full flex-1 mr-[100%]">
      <Swiper
        cards={cards || []}
        verticalSwipe={false}
        renderCard={({ question, answer }, index) => (
          <FlashCard
            onFullAnswer={onFullAnswer}
            question={question}
            answer={answer}
            key={index}
          />
        )}
        stackSize={4}
        infinite
        animateCardOpacity
        containerStyle={styles.swiper}
        marginTop={marginTop}
      ></Swiper>
    </View>
  );
}

interface FlashCardProps {
  question: string;
  answer: string;
  onFullAnswer: (answer: string) => void;
}
function FlashCard({ question, answer, onFullAnswer }: FlashCardProps) {
  return (
    <GestureHandlerRootView>
      <View className="bg-[#494949] shadow-sm shadow-black py-6 pt-12 px-4 rounded-3xl space-y-4 relative overflow-hidden h-[500px]">
        <ThemedText className="font-medium font-mono text-3xl text-[#EEE3D7]">
          {question}
        </ThemedText>
        <ScrollView className="max-h-[150px]" persistentScrollbar={false}>
          <Text numberOfLines={5} className="text-[#E2D8CC] text-xl">
            {answer}
          </Text>
        </ScrollView>
        <View className="absolute -bottom-[15%] -left-[8%] my-2">
          <Icon
            source={require("../assets/images/Pattern.png")}
            size={150}
            color="#84817F"
          />
        </View>
        <View className="flex-row-reverse flex-1 ">
          <TouchableOpacity
            onPress={() => onFullAnswer(answer)}
            className="flex-col items-end w-full self-end"
          >
            <AntDesign
              name="arrowright"
              color="#E85E56"
              size={60}
              className="self-end"
            />
            <Text className="text-[#E2D8CC] text-xl">Read Full Answer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

function RedFilledCircle() {
  return (
    <View className="bg-[#E85E56] rounded-full w-96 h-96 absolute -right-[50%] -top-[8%]"></View>
  );
}

function RedOutlinedCircle() {
  return (
    <View className="border-2 border-[#E85E56] bg-transparent h-96 w-96 rounded-full absolute -bottom-[10%] -left-[40%]"></View>
  );
}

function WhiteOutlinedCircle() {
  return (
    <View className="bg-transparent border border-white h-40 w-40 rounded-full absolute top-[10%] -right-[15%]"></View>
  );
}

const styles = StyleSheet.create({
  swiper: {},
  wrapper: {
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4E9DC",
    position: "relative",
  },
  card: {
    width: 250,
    height: 350,
    backgroundColor: "#242e31",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  topText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 10,
  },
  moonIcon: {
    marginTop: 20,
  },
  catShape: {
    width: 120,
    height: 100,
    backgroundColor: "#1A1A2E",
    borderRadius: 60,
    position: "relative",
    top: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    top: -10,
  },
  sideTextLeft: {
    position: "absolute",
    left: 10,
    color: "#ffffff",
    fontSize: 12,
    transform: [{ rotate: "-90deg" }],
  },
  sideTextRight: {
    position: "absolute",
    right: 10,
    color: "#ffffff",
    fontSize: 12,
    transform: [{ rotate: "90deg" }],
  },
  bottomText: {
    color: "#ffffff",
    fontSize: 12,
    marginBottom: 10,
  },
  starIconLeft: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  starIconRight: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
