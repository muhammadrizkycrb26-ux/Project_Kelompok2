import { StyleSheet, View, type ViewProps } from "react-native";

import { Palette } from "@/constants/palette";

type CardProps = ViewProps & { bordered?: boolean };

export function Card({ bordered, style, ...rest }: CardProps) {
  return <View style={[styles.card, bordered && styles.bordered, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Palette.surface, borderRadius: 17, padding: 16 },
  bordered: { borderWidth: 1, borderColor: Palette.border },
});
