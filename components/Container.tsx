import { Colors } from "@/constants/Colors";
import { View, ViewProps } from "react-native";
export default function Container({ children }: ViewProps) {
  return <View className="px-6 py-4 flex-1" style={{backgroundColor:Colors.dark.background}}>{children}</View>;
}
