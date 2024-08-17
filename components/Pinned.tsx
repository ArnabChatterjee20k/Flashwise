import { View } from "react-native";
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
];
export default function Pinned() {
  return (
    <View className="px-6 py-4">
      <SectionHeader title="Pinned" link="/form" />
      <View className="flex-row justify-between py-5">
        {flashCards.map((data) => (
          <FlashCard {...data} />
        ))}
      </View>
    </View>
  );
}
