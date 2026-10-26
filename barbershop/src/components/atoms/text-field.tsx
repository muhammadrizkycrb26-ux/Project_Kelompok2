import { StyleSheet, TextInput, type TextInputProps } from "react-native";

import { Palette } from "@/constants/palette";

export function TextField({ style, ...rest }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={Palette.placeholder}
      style={[styles.input, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surfaceTint,
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 13,
    color: Palette.dark,
  },
});
