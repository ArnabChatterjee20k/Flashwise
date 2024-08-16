import { ScrollView, View } from "react-native";
import SectionHeader from "./SectionHeader";
import FlashCard from "./FlashCard";
import type { FlashCardProps } from "./FlashCard";
import { Colors } from "@/constants/Colors";
const flashCards: FlashCardProps[] = [
  {
    title: "Card 1",
    cards: "50",
    icon: "API",
    quantifier: "Q",
    color: Colors.cards.Yellow,
  },
  {
    title: "Card 2",
    cards: "100",
    icon: "Trophy",
    quantifier: "Q",
    color: Colors.cards.Green,
  },
  {
    title: "Card 3",
    cards: "100",
    icon: "USB",
    quantifier: "Q",
    color: Colors.cards.Red,
  },
  {
    title: "Card 4",
    cards: "100",
    icon: "HTML",
    quantifier: "Q",
    color: Colors.cards.Blue,
  },
];
export default function UnSolved() {
  return (
    <View className="px-6 py-4">
      <SectionHeader title="Unsolved" link="/pinned" />
      <View className="flex-row justify-between py-5 flex-wrap" style={{rowGap:25}}>
        {flashCards.map((data) => (
          <FlashCard {...data} key={data.title}/>
        ))}
      </View>
    </View>
  );
}
