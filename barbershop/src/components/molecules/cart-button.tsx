import { Pressable, StyleSheet } from "react-native";

import { AppText, Badge } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type CartButtonProps = { count: number; onPress: () => void };

export function CartButton({ count, onPress }: CartButtonProps) {
  return (
    <Pressable accessibilityLabel="Buka keranjang" style={styles.button} onPress={onPress}>
      <AppText style={styles.icon}>🛒</AppText>
      {count > 0 ? (
        <Badge
          label={count > 99 ? "99+" : String(count)}
          tone="accent"
          style={styles.badge}
          textStyle={styles.badgeText}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Palette.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Palette.border,
    marginLeft: 12,
  },
  icon: { fontSize: 22 },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    paddingVertical: 0,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 10, fontWeight: "900", letterSpacing: 0 },
});
