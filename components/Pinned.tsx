import { View } from "react-native";
import SectionHeader from "./SectionHeader";
import FlashCard from "./FlashCard";
import type { FlashCardProps } from "./FlashCard";
import { Colors } from "@/constants/Colors";
interface FlashCardListProps {
  cards: FlashCardProps[];
  title: string;
}
export function FlashCardList({ cards, title }: FlashCardListProps) {
  const pairs = [];

  // Create pairs of two
  for (let i = 0; i < cards.length; i += 2) {
    pairs.push(cards.slice(i, i + 2));
  }

  return (
    <View className="px-6 py-4">
      <SectionHeader title={title} link="/deck" />

      {pairs.map((pair, index) => (
        <View
          className="flex-row py-4"
          style={{
            rowGap: 20,
            justifyContent:
              pair.length % 2 == 1 ? "flex-start" : "space-between",
            paddingHorizontal: 10
          }}
        >
          {pair.map((data) => (
            <FlashCard _id={data._id} name={data.name} key={data.name} color={data.color} icon={data.icon}/>
          ))}
        </View>
      ))}
    </View>
  );
}
