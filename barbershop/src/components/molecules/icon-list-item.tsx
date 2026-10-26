import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText, IconBox } from "@/components/atoms";

type IconListItemProps = {
  icon: string;
  /** Baris kecil di atas judul (mis. label field). */
  caption?: string;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function IconListItem({
  icon,
  caption,
  title,
  subtitle,
  trailing,
  onPress,
  style,
}: IconListItemProps) {
  const content = (
    <>
      <IconBox symbol={icon} />
      <View style={styles.text}>
        {caption ? <AppText variant="caption">{caption}</AppText> : null}
        <AppText variant="cardTitle" style={caption ? styles.afterCaption : undefined}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing}
    </>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" style={[styles.row, style]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.row, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  text: { flex: 1, marginLeft: 12 },
  afterCaption: { marginTop: 5 },
  subtitle: { marginTop: 4 },
});
