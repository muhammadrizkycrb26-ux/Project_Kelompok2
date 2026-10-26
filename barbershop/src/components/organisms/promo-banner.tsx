import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type PromoBannerProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** Elemen dekoratif di sisi kanan (mis. emoji). */
  trailing?: ReactNode;
  /** Teks tautan di bawah deskripsi; aktif jika `onPress` diberikan. */
  linkLabel?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PromoBanner({
  eyebrow,
  title,
  description,
  trailing,
  linkLabel,
  onPress,
  style,
}: PromoBannerProps) {
  const content = (
    <>
      <View style={styles.text}>
        <AppText variant="eyebrow" color={Palette.accentOnDark} style={styles.eyebrow}>
          {eyebrow}
        </AppText>
        <AppText variant="sectionTitle" color={Palette.surface} style={styles.title}>
          {title}
        </AppText>
        <AppText variant="body" color={Palette.textOnDark}>
          {description}
        </AppText>
        {linkLabel ? (
          <AppText variant="body" color={Palette.accent} style={styles.link}>
            {linkLabel}
          </AppText>
        ) : null}
      </View>
      {trailing}
    </>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" style={[styles.card, style]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Palette.dark,
    overflow: "hidden",
  },
  text: { flex: 1, gap: 8 },
  eyebrow: { fontSize: 9, letterSpacing: 1.5 },
  title: { fontSize: 22, lineHeight: 27, fontWeight: "900" },
  link: { fontWeight: "800", marginTop: 6 },
});
