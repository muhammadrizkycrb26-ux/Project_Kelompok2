import { Pressable, StyleSheet, Text, View } from "react-native";

import { Palette } from "@/constants/palette";

type AvatarProps = {
  label: string;
  size?: number;
  tone?: "dark" | "soft";
  onPress?: () => void;
};

export function Avatar({ label, size = 44, tone = "dark", onPress }: AvatarProps) {
  const soft = tone === "soft";
  const circle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: soft ? Palette.accentSoft : Palette.dark,
    ...(soft ? { borderWidth: 3, borderColor: "#D99B6B" } : null),
  };
  const text = {
    fontSize: Math.round(size * 0.42),
    fontWeight: soft ? ("900" as const) : ("bold" as const),
    color: soft ? Palette.accent : Palette.surface,
  };

  const content = <Text style={text}>{label}</Text>;

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" style={[styles.center, circle]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.center, circle]}>{content}</View>;
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
});
