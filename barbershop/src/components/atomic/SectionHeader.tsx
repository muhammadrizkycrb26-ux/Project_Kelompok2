import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

type SectionHeaderProps = {
  title: string;
  description?: string;
  trailing?: string;
  style?: StyleProp<ViewStyle>;
};

const COLORS = { dark: "#242321", muted: "#8C8781", orange: "#F59A38" };

/** Header bagian berisi judul, deskripsi opsional, dan label sisi kanan. */
export default function SectionHeader({ title, description, trailing, style }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {trailing ? <Text style={styles.trailing}>{trailing}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 24, marginTop: 28, marginBottom: 15 },
  textGroup: { flex: 1, paddingRight: 8 },
  title: { color: COLORS.dark, fontSize: 20, fontWeight: "800" },
  description: { color: COLORS.muted, fontSize: 11, marginTop: 5 },
  trailing: { color: COLORS.orange, fontSize: 11, fontWeight: "700" },
});
