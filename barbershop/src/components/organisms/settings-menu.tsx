import { StyleSheet } from "react-native";

import { AppText, Card, Divider } from "@/components/atoms";
import { IconListItem, SectionHeader } from "@/components/molecules";
import { Palette } from "@/constants/palette";

type SettingsMenuProps = { onOpenPreferences: () => void; onOpenAbout: () => void };

const Chevron = (
  <AppText color={Palette.muted} style={{ fontSize: 25, paddingHorizontal: 5 }}>
    ›
  </AppText>
);

export function SettingsMenu({ onOpenPreferences, onOpenAbout }: SettingsMenuProps) {
  return (
    <>
      <SectionHeader title="Pengaturan" style={styles.header} />

      <Card bordered style={styles.card}>
        <IconListItem
          icon="⚙"
          title="Preferensi aplikasi"
          subtitle="Notifikasi dan tampilan aplikasi"
          trailing={Chevron}
          onPress={onOpenPreferences}
          style={styles.item}
        />
        <Divider />
        <IconListItem
          icon="ⓘ"
          title="Tentang aplikasi"
          subtitle="Informasi aplikasi Barbershop"
          trailing={Chevron}
          onPress={onOpenAbout}
          style={styles.item}
        />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  header: { marginHorizontal: 20, marginTop: 27, marginBottom: 13 },
  card: { marginHorizontal: 18, paddingVertical: 0, paddingHorizontal: 15 },
  item: { minHeight: 72, paddingVertical: 12 },
});
