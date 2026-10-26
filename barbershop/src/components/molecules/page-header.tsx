import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "@/components/atoms";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  titleSize?: number;
  style?: StyleProp<ViewStyle>;
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  trailing,
  titleSize,
  style,
}: PageHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.text}>
        <AppText variant="eyebrow" style={styles.eyebrow}>
          {eyebrow}
        </AppText>
        <AppText variant="pageTitle" style={titleSize ? { fontSize: titleSize } : undefined}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
  },
  text: { flex: 1 },
  eyebrow: { marginBottom: 5 },
  subtitle: { marginTop: 5, fontSize: 12 },
});
