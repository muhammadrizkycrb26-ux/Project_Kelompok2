import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type HeroBannerProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** lg = hero halaman utama, md = hero halaman form. */
  size?: "lg" | "md";
  children?: ReactNode;
};

export function HeroBanner({ eyebrow, title, description, size = "md", children }: HeroBannerProps) {
  const large = size === "lg";

  return (
    <View style={[styles.card, large ? styles.cardLarge : styles.cardMedium]}>
      <AppText variant="eyebrow" color={Palette.accentOnDark} style={styles.eyebrow}>
        {eyebrow}
      </AppText>
      <AppText
        variant="pageTitle"
        color={Palette.surface}
        style={large ? styles.titleLarge : styles.titleMedium}
      >
        {title}
      </AppText>
      <AppText
        variant="body"
        color={Palette.textOnDark}
        style={large ? styles.descriptionLarge : styles.descriptionMedium}
      >
        {description}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Palette.dark },
  cardLarge: { marginHorizontal: 20, borderRadius: 24, padding: 24, minHeight: 270, justifyContent: "center" },
  cardMedium: { marginHorizontal: 18, borderRadius: 23, padding: 23 },
  eyebrow: { fontSize: 10, letterSpacing: 2 },
  titleLarge: { fontSize: 35, lineHeight: 42, marginTop: 15 },
  titleMedium: { fontSize: 31, lineHeight: 37, marginTop: 14 },
  descriptionLarge: { fontSize: 13, lineHeight: 20, marginTop: 12 },
  descriptionMedium: { lineHeight: 19, marginTop: 10 },
});
