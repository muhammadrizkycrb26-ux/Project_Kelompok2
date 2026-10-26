import type { ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { Palette } from "@/constants/palette";

type IconBoxProps = {
  /** Karakter simbol (string) atau node kustom. */
  symbol: ReactNode;
  size?: number;
  radius?: number;
  fontSize?: number;
  tone?: "soft" | "dark" | "raised";
  style?: StyleProp<ViewStyle>;
};

const backgrounds = {
  soft: Palette.accentSoft,
  dark: Palette.dark,
  raised: "#403B36",
} as const;

export function IconBox({
  symbol,
  size = 42,
  radius,
  fontSize,
  tone = "soft",
  style,
}: IconBoxProps) {
  return (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: radius ?? Math.round(size * 0.3),
          backgroundColor: backgrounds[tone],
        },
        style,
      ]}
    >
      {typeof symbol === "string" ? (
        <Text style={{ color: Palette.accent, fontSize: fontSize ?? Math.round(size * 0.5) }}>
          {symbol}
        </Text>
      ) : (
        symbol
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: "center", justifyContent: "center" },
});
