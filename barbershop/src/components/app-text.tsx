import {
  Text as NativeText,
  StyleSheet,
  type TextProps,
  type TextStyle,
} from "react-native";

function getInterFont(weight?: TextStyle["fontWeight"]) {
  const numericWeight = weight === "bold" ? 700 : Number(weight ?? 400);
  if (numericWeight >= 900) return "Inter_900Black";
  if (numericWeight >= 800) return "Inter_800ExtraBold";
  if (numericWeight >= 700) return "Inter_700Bold";
  if (numericWeight >= 600) return "Inter_600SemiBold";
  if (numericWeight >= 500) return "Inter_500Medium";
  return "Inter_400Regular";
}

export default function AppText({ style, ...props }: TextProps) {
  const textStyle = StyleSheet.flatten(style);
  const fontFamily = textStyle?.fontFamily ?? getInterFont(textStyle?.fontWeight);

  return <NativeText {...props} style={[{ fontFamily }, style]} />;
}
