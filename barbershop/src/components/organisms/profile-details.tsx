import { StyleSheet } from "react-native";

import { AppText, Card, Divider } from "@/components/atoms";
import { IconListItem, SectionHeader } from "@/components/molecules";
import { Palette } from "@/constants/palette";

type ProfileDetailsProps = { name: string; phone: string; onEdit: () => void };

export function ProfileDetails({ name, phone, onEdit }: ProfileDetailsProps) {
  return (
    <>
      <SectionHeader
        title="Data Diri"
        trailing={
          <AppText
            variant="body"
            color={Palette.accent}
            style={styles.edit}
            onPress={onEdit}
            suppressHighlighting
          >
            Edit Profil
          </AppText>
        }
        style={styles.header}
      />

      <Card bordered style={styles.card}>
        <IconListItem icon="♙" caption="Nama lengkap" title={name} style={styles.item} />
        <Divider />
        <IconListItem icon="☎" caption="Nomor HP" title={phone} style={styles.item} />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  header: { marginHorizontal: 20, marginTop: 27, marginBottom: 13 },
  edit: { fontWeight: "800" },
  card: { marginHorizontal: 18, paddingVertical: 0, paddingHorizontal: 15 },
  item: { paddingVertical: 16 },
});
