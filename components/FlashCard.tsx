import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View,TouchableOpacity } from "react-native";

export interface FlashCardProps {
  name: string;
  icon?: string;
  color: string;
  _id:string
}

export default function FlashCard({
  name,
  icon,
  color,
  _id
}: FlashCardProps) {
  const router = useRouter()
  const goToForm = () => {
    router.push({ pathname: "/flash", params: { flashCardID: _id } });
  };
  return (
    <TouchableOpacity className={`w-40 h-36 rounded-xl p-5 justify-evenly`} style={{backgroundColor:color}} onPress={goToForm}>
      <AntDesign name={icon} size={30} color="black" />
      <View>
        <Text numberOfLines={2} className="font-medium text-2xl text-black">{name}</Text>
      </View>
    </TouchableOpacity>
  );
}
