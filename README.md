# 🌙 Kalkulator Zakat Indonesia

Aplikasi Kalkulator Zakat berbasis web yang bersih, interaktif, dan komprehensif untuk membantu perhitungan kewajiban zakat sesuai nisab dan ketentuan syariat di Indonesia.

🌐 **Live Demo**: https://kalkulator-zakat.vercel.app

## 🚀 Fitur Utama
- **5 Kategori Zakat**: Zakat Penghasilan (Profesi), Mal (Kekayaan), Emas & Perak, Perniagaan, dan Fitrah.
- **Harga Acuan Dinamis**: Mengambil harga emas & perak terkini via Gemini AI Search Grounding dengan fitur *caching* dan *manual override*.
- **Visualisasi Proporsi**: Diagram Recharts (Pie Chart & Bar Chart) untuk melihat persentase kontribusi setiap jenis zakat.
- **Single-Page Experience**: Desain intuitif satu halaman dengan *sticky navigation bar* melayang.
- **Panduan Penyaluran Zakat**: Rekomendasi dan pranala langsung ke BAZNAS, Dompet Dhuafa, Rumah Zakat, LAZISMU, dan LAZISNU.

## Cara Menjalankan

```bash
npm install
cp .env.example .env   # opsional: isi GEMINI_API_KEY untuk harga emas/perak terkini via AI
npm run dev
```

Buka `http://localhost:3000`. Tanpa API key aplikasi tetap berjalan — harga acuan bisa diisi manual.

## Tech Stack

- React 19 + TypeScript + Vite, Recharts (visualisasi)
- Express (`server.ts`) — endpoint AI di sisi server
- Google Gemini SDK (`@google/genai`) untuk harga acuan dinamis

---

## License

MIT License © 2026 Yudhan Sebastian
