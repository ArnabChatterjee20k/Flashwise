import ThemedText from "@/components/ThemedText";
import { AntDesign } from "@expo/vector-icons";
import * as React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Card, Icon, Text } from "react-native-paper";

export default function CustomCard() {
  return (
    <View style={styles.container}>
      <RedFilledCircle />
      <RedOutlinedCircle />
      <View className="px-2 justify-center flex-1 space-y-7">
        <FlashCard />
        <View className="flex-row w-full justify-between space-x-4 px-4 -mb-10">
          <TouchableOpacity className="bg-[#d5724c] shadow-sm rounded-lg p-3 flex-row justify-center flex-1">
            <Text className="text-white font-bold text-xl">Undone</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#09a57a] shadow-sm  rounded-lg p-3 flex-row justify-center flex-1">
            <Text className="text-white font-bold text-xl">Read</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}
const question =
  "What is the name of the iconic yellow umbrella that appears throughout the series?";
const answer =
  "The yellow umbrella is a symbol of Ted and Robin's relationship, as they both share a romantic connection to it.";
function FlashCard() {
  return (
    <View className="bg-[#494949] shadow-sm shadow-black py-6 pt-12 px-4 rounded-3xl space-y-4 relative overflow-hidden min-h-[500px]">
      <ThemedText className="font-medium font-mono text-3xl text-[#EEE3D7]">
        {question}
      </ThemedText>
      <Text className="text-[#E2D8CC] text-xl">{answer}</Text>
      <View className="absolute -bottom-[15%] -left-[8%] my-2">
        <Icon
          source={require("../assets/images/Pattern.png")}
          size={150}
          color="#84817F"
        />
      </View>
      <View className="flex-row-reverse flex-1 ">
        <View className="flex-col items-end w-full self-end">
          <AntDesign
            name="arrowright"
            color="#E85E56"
            size={60}
            className="self-end"
          />
          <Text className="text-[#E2D8CC] text-xl">Keep Swiping</Text>
        </View>
      </View>
    </View>
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
