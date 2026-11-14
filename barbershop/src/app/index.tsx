import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuthReady, useCurrentUser } from "@/data/auth";

export default function Index() {
  const ready = useAuthReady();
  const user = useCurrentUser();

  // Selama sesi login tersimpan masih diperiksa, tampilkan loading
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#C9824A" />
      </View>
    );
  }
  if (!user) return <Redirect href="/login" />;
  return <Redirect href={user.role === "admin" ? "/admin" : "/(tabs)"} />;
}
