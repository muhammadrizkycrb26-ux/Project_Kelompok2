import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { Palette } from "@/constants/palette";

type ScreenTemplateProps = {
  children: ReactNode;
  /** Bungkus isi dengan ScrollView. Matikan jika `children` sudah berupa FlatList. */
  scroll?: boolean;
  /** Hormati safe area bagian atas. */
  safeArea?: boolean;
  /** Header tetap di atas area scroll. */
  header?: ReactNode;
  /** Elemen melayang / modal yang dirender setelah konten. */
  overlay?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: "always" | "never" | "handled";
};

export function ScreenTemplate({
  children,
  scroll = true,
  safeArea = false,
  header,
  overlay,
  contentStyle,
  keyboardShouldPersistTaps,
}: ScreenTemplateProps) {
  const body = (
    <>
      <StatusBar style="dark" />
      {header}
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          contentContainerStyle={[styles.content, contentStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
      {overlay}
    </>
  );

  if (safeArea) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        {body}
      </SafeAreaView>
    );
  }

  return <View style={styles.container}>{body}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.background },
  content: { paddingBottom: 24 },
});
