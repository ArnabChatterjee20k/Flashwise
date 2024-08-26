import { FlashCardList } from "@/components/Pinned";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ScrollView, View } from "react-native";

const pinnedColors = ["#fef08a", "#bef264", "#ef4444", "#bfdbfe"];
const unsolvedColors = ["#93c5fd", "#a3e635", "#fbbf24", "#f97316"];

const pinnedIcons = ["API", "Trophy", "HTML", "Safety"];
const unsolvedIcons = ["alipay-circle", "apple-o", "antdesign", "addfolder"];

const flashCards = [
  {
    title: "Card 1",
    cards: "50",
    icon: "API",
  },
  {
    title: "Card 2",
    cards: "100",
    icon: "Trophy",
  },
  {
    title: "Card 1",
    cards: "50",
    icon: "API",
  },
  {
    title: "Card 2",
    cards: "100",
    icon: "Trophy",
  },
];

export default function HomeScreen() {
  const pinnedCards = useQuery(api.cards.getPinnedFlash);
  const cards = useQuery(api.cards.getFlashCard, { limit: 4 });
  return (
    <ScrollView style={{ backgroundColor: Colors.dark.background, flex: 1 }}>
      <View style={{ paddingBottom: 300 }}>
        <FlashCardList
          title="Pinned"
          cards={
            pinnedCards?.map((data, i) => ({
              ...data,
              color: pinnedColors[i],
              icon: pinnedIcons[i],
            })) || []
          }
        />
        <FlashCardList
          title="Unsolved"
          cards={
            cards?.map((data, i) => ({
              ...data,
              color: unsolvedColors[i],
              icon: unsolvedIcons[i],
            })) || []
          }
        />
      </View>
    </ScrollView>
  );
}
