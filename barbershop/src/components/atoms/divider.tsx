import { View, type StyleProp, type ViewStyle } from "react-native";

import { Palette } from "@/constants/palette";

type DividerProps = { color?: string; style?: StyleProp<ViewStyle> };

export function Divider({ color = Palette.border, style }: DividerProps) {
  return <View style={[{ height: 1, backgroundColor: color }, style]} />;
}
