import { Alert, Platform } from "react-native";

/** Alert yang aman dipakai di web maupun native. */
export function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}
