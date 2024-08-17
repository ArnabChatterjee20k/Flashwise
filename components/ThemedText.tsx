import { Text, TextProps } from "react-native";
export default ({ children,...props }: TextProps) => {
  return <Text {...props} className="text-white">{children}</Text>;
};
