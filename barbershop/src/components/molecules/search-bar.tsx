import { StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from "react-native";

import { Palette } from "@/constants/palette";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
};

export function SearchBar({ value, onChangeText, placeholder, style }: SearchBarProps) {
  return (
    <View style={[styles.box, style]}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Palette.muted}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  icon: { fontSize: 25, color: Palette.accent, marginRight: 9 },
  input: { flex: 1, fontSize: 12, color: Palette.dark, paddingVertical: 0 },
});
