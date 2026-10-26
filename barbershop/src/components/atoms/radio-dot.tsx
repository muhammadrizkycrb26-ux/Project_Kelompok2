import { View } from "react-native";

import { Palette } from "@/constants/palette";

type RadioDotProps = { selected: boolean; size?: number };

export function RadioDot({ selected, size = 20 }: RadioDotProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: selected ? Palette.accent : "#D9D1C8",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selected ? (
        <View
          style={{
            width: size / 2,
            height: size / 2,
            borderRadius: size / 4,
            backgroundColor: Palette.accent,
          }}
        />
      ) : null}
    </View>
  );
}
