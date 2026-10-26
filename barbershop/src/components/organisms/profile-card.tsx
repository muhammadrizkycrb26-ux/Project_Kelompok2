import { StyleSheet, View } from "react-native";

import { AppText, Avatar, Badge } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type ProfileCardProps = { name: string; phone: string };

export function ProfileCard({ name, phone }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <Avatar tone="soft" size={78} label={name.trim().charAt(0).toUpperCase() || "U"} />
      <AppText variant="sectionTitle" color={Palette.surface} style={styles.name}>
        {name}
      </AppText>
      <AppText variant="body" color="#D0C8BF" style={styles.phone}>
        {phone}
      </AppText>
      <Badge label="PELANGGAN BARBERSHOP" tone="dark" style={styles.badge} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    borderRadius: 22,
    backgroundColor: Palette.dark,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  name: { fontSize: 20, marginTop: 14 },
  phone: { marginTop: 6 },
  badge: { marginTop: 15, alignSelf: "center" },
});
