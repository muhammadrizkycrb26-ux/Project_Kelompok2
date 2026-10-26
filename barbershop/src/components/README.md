# Atomic Design — aturan struktur

| Level | Folder | Isi | Boleh mengimpor |
|---|---|---|---|
| Atoms | `atoms/` | Elemen UI terkecil: `AppText`, `Button`, `Badge`, `Chip`, `Card`, `IconBox`, `Avatar`, `Divider`, `TextField`, `RadioDot` | token (`constants/palette`) saja |
| Molecules | `molecules/` | Gabungan beberapa atom dengan satu fungsi: `SearchBar`, `SectionHeader`, `ServiceCard`, `ProductCard`, `PaymentOption`, `BottomSheet`, dll. | atoms |
| Organisms | `organisms/` | Bagian layar yang utuh: `ServiceCatalog`, `CartSheet`, `OrderCard`, `BookingSummary`, `ProfileCard`, dialog profil, dll. | atoms, molecules |
| Templates | `templates/` | Kerangka layar (`ScreenTemplate`: status bar, safe area, scroll) | atoms, molecules |
| Pages | `pages/` | Layar lengkap: merangkai hooks + organisms. Di-re-export oleh `src/app/(tabs)/*` | semua level |

Aturan praktis:
- Warna selalu dari `Palette`; jangan menulis hex di komponen.
- Import hanya ke bawah (page → organism → molecule → atom). Jangan sebaliknya.
- Logika state/bisnis ada di `src/hooks` dan `src/store`, bukan di atoms/molecules.
- File di `src/app/` hanya route tipis: `export { default } from "@/components/pages/..."`.
