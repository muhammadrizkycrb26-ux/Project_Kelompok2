import { StyleSheet, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";

import { AppText, TextField } from "@/components/atoms";

type FormFieldProps = TextInputProps & {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function FormField({ label, containerStyle, ...inputProps }: FormFieldProps) {
  return (
    <View style={containerStyle}>
      <AppText variant="body" style={styles.label}>
        {label}
      </AppText>
      <TextField {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: "800", marginBottom: 8 },
});
