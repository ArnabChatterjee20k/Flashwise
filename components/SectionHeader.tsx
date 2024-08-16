import { Link } from "expo-router";
import { Text, View } from "react-native-ui-lib";
import Ionicons from "@expo/vector-icons/Ionicons";
import {type Href} from "expo-router"
interface SectionHeaderProps {
  title: string;
  link: Href;
}
export default function SectionHeader({ link, title }: SectionHeaderProps) {
  return (
    <View className="flex flex-row items-end justify-between">
      <Text className="text-white text-2xl font-bold">{title}</Text>
      <Link className="text-[#e3b367] text-sm text-center" href={link}>
        see more <Ionicons name="arrow-forward-outline"/>
      </Link>
    </View>
  );
}
