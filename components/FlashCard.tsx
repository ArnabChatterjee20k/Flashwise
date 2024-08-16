import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";

export interface FlashCardProps {
  title: string;
  cards: string;
  icon?: string;
  quantifier?: string;
  color: string;
}

export default function FlashCard({
  title,
  cards,
  icon,
  quantifier,
  color,
}: FlashCardProps) {
  return (
    <View className={`w-36 h-36 rounded-3xl p-5 justify-between`} style={{backgroundColor:color}}>
      <AntDesign name={icon} size={30} color="black" />
      <View>
        <Text className="font-semibold text-sm text-black">{title}</Text>
        <Text className="font-bold text-2xl text-black">
          {cards} {quantifier || "Q"}
        </Text>
      </View>
    </View>
  );
}
