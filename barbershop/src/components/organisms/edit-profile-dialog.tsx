import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Button } from "@/components/atoms";
import { CenterDialog, FormField } from "@/components/molecules";

type EditProfileDialogProps = {
  visible: boolean;
  name: string;
  phone: string;
  onClose: () => void;
  onSave: (name: string, phone: string) => void;
};

export function EditProfileDialog({ visible, name, phone, onClose, onSave }: EditProfileDialogProps) {
  const [draftName, setDraftName] = useState(name);
  const [draftPhone, setDraftPhone] = useState(phone);

  // Setiap dialog dibuka, draft disinkronkan ulang dengan data tersimpan.
  useEffect(() => {
    if (visible) {
      setDraftName(name);
      setDraftPhone(phone);
    }
  }, [visible, name, phone]);

  return (
    <CenterDialog
      visible={visible}
      onClose={onClose}
      title="Edit Profil"
      subtitle="Perbarui informasi data dirimu."
      actions={
        <>
          <Button variant="outline" label="Batal" onPress={onClose} />
          <Button label="Simpan" onPress={() => onSave(draftName, draftPhone)} />
        </>
      }
    >
      <FormField
        label="Nama lengkap"
        containerStyle={styles.field}
        value={draftName}
        onChangeText={setDraftName}
        placeholder="Masukkan nama"
        autoCapitalize="words"
        maxLength={80}
      />
      <FormField
        label="Nomor HP"
        containerStyle={styles.field}
        value={draftPhone}
        onChangeText={setDraftPhone}
        placeholder="Contoh: 081234567890"
        keyboardType="phone-pad"
        maxLength={20}
      />
    </CenterDialog>
  );
}

const styles = StyleSheet.create({
  field: { marginTop: 18 },
});
