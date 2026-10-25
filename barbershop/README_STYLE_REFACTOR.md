# Pemisahan Style UI

Style pada screen React Native dipisahkan dari file screen ke file `*.styles.ts` menggunakan `StyleSheet.create`. Ini bukan file CSS web, karena proyek menggunakan React Native.

## File yang dipisahkan
- `src/app/(tabs)/index.tsx` → `index.styles.ts`
- `src/app/(tabs)/booking.tsx` → `booking.styles.ts`
- `src/app/(tabs)/shop.tsx` → `shop.styles.ts`
- `src/app/(tabs)/orders.tsx` → `orders.styles.ts`
- `src/app/(tabs)/profile.tsx` → `profile.styles.ts`
- `src/app/explore.tsx` → `explore.styles.ts`

Setiap screen mengimpor style-nya sendiri, misalnya `import styles from "./booking.styles";`.

## Menjalankan proyek
1. Ekstrak ZIP.
2. Buka folder yang berisi `package.json` di VS Code.
3. Jalankan `npm install`.
4. Jalankan `npx expo start`.

Catatan: dependensi tidak disertakan dalam ZIP; instalasi dilakukan melalui `npm install`.
 ahmdaly