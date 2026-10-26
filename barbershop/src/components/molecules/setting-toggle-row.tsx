import { StyleSheet, Switch, View } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type SettingToggleRowProps = {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function SettingToggleRow({ title, subtitle, value, onValueChange }: SettingToggleRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <AppText variant="cardTitle">{title}</AppText>
        <AppText variant="caption" style={styles.subtitle}>
          {subtitle}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D7D0C7", true: Palette.accent }}
        thumbColor={Palette.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 16,
  },
  text: { flex: 1 },
  subtitle: { marginTop: 4 },
});
