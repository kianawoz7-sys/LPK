# LPK J.A.T Banjarnegara

Website company profile multi-page untuk LPK J.A.T Banjarnegara. Menggunakan desain Editorial Minimalist, foto kegiatan, aksen biru-oranye, dan tampilan responsif. Aplikasi dibangun dengan Next.js App Router dan diekspor menjadi website statis.

## Halaman dan fitur

| Halaman | Route |
| --- | --- |
| Beranda | `/` |
| Tentang Kami | `/tentang/` |
| Program Pelatihan | `/program/` |
| Bahasa Jepang (Gakkou) | `/program/bahasa-jepang/` |
| Tokutei Ginou (TG) | `/program/tokutei-ginou/` |
| Magang Jepang (Ginou Jisshusei) | `/program/magang-jepang/` |
| Engineering | `/program/engineering/` |
| Galeri | `/galeri/` |
| Kontak | `/kontak/` |

- Navbar menyembunyikan diri saat scroll ke bawah dan muncul kembali saat scroll ke atas. Menu mobile/tablet memenuhi layar dengan tautan Beranda, Tentang Kami, Program Pelatihan, dan Galeri. Kontak tersedia melalui footer.
- Program ditampilkan sebagai kartu foto putih yang tersusun vertikal; setiap kartu menuju halaman detail.
- Tentang Kami memuat profil singkat, foto kelas, lokasi umum, dan peta Jepang.
- Galeri menampilkan lima foto kegiatan dalam masonry grid. Foto dapat diperbesar, ditutup dengan tombol X/Escape, atau digeser vertikal untuk menutup.
- Latar memakai grid halus dan gelombang partikel. Reduced motion dihormati; pola titik statis tersedia ketika WebGL tidak didukung.
- Menu dan galeri mendukung keyboard, pengelolaan fokus, serta penguncian scroll halaman belakang.

## Teknologi

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Motion/Framer Motion, Three.js, dan Lucide React. Struktur shadcn dikonfigurasi pada `components.json`; komponen UI berada di `src/components/ui/` dan helper `cn` di `src/lib/utils.ts`.

Tidak diperlukan database, API key, atau file `.env` untuk menjalankan proyek. Kontak WhatsApp berupa tautan eksternal, tanpa backend atau formulir pendaftaran.

## Menjalankan secara lokal

Gunakan Node.js 22 atau lebih baru dan npm. Proyek telah diverifikasi dengan Node.js 22.

```bash
git clone https://github.com/kianawoz7-sys/LPK.git
cd LPK
npm ci
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Indikator development Next.js dinonaktifkan melalui `devIndicators: false`; error development tetap ditampilkan.

### Membuka dari HP

1. Hubungkan laptop dan HP ke jaringan Wi-Fi yang sama.
2. Jalankan `npm run dev` di laptop. Script sudah memakai `--hostname 0.0.0.0`.
3. Cari IPv4 laptop dengan `ipconfig` pada Windows.
4. Buka `http://IP-LAPTOP:3000` dari browser HP. Gunakan port yang ditampilkan terminal jika 3000 terpakai.

Restart server setelah berpindah jaringan agar `allowedDevOrigins` mengikuti alamat IPv4 terbaru. Jika koneksi terhalang Windows Firewall, izinkan Node.js pada jaringan Private yang digunakan.

## Build, preview, dan deploy

```bash
npm run build
npm run preview
```

Build menghasilkan website statis di `out/`. Preview lokal menggunakan [http://127.0.0.1:3000](http://127.0.0.1:3000). Jika server dev masih memakai port tersebut, tetapkan port preview lain; pada PowerShell:

```powershell
$env:PORT = '3100'
npm run preview
```

Untuk hosting statis yang mengambil source dari GitHub, gunakan konfigurasi berikut:

| Pengaturan | Nilai |
| --- | --- |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Publish/output directory | `out` |
| Node.js | 22 atau lebih baru |
| Environment variables | Tidak diperlukan |

`output: 'export'` dan `trailingSlash: true` menghasilkan halaman seperti `tentang/index.html`, sehingga hosting perlu melayani `index.html` di setiap direktori. Tidak diperlukan proses Next.js server pada production. Folder `out/` dihasilkan saat build dan tidak disimpan di Git.

Metadata saat ini masih menggunakan `noindex, nofollow` pada `src/app/layout.tsx`. Pengaturan tersebut dapat disesuaikan ketika website siap untuk diindeks mesin pencari.

## Verifikasi

Jalankan build sebelum memeriksa hasil production:

```bash
npm run build
npm run typecheck
npm run verify
npm run verify:gallery
npm run verify:texture
npm run verify:navbar
```

| Script | Pemeriksaan |
| --- | --- |
| `typecheck` | Tipe TypeScript |
| `verify` | Sembilan halaman pada desktop/mobile/tablet, navigasi, tautan, gambar, metadata, dan overflow pada lebar 320–1920px |
| `verify:gallery` | Modal foto, keyboard, drag, fokus, reduced motion, dan grid responsif |
| `verify:texture` | Animasi partikel, batas pixel ratio, reduced motion, navigasi, dan fallback tanpa WebGL |
| `verify:navbar` | Arah scroll, menu layar penuh, scroll lock, fokus, penutupan, resize, landscape, serta integrasi galeri |

Pemeriksaan browser memerlukan Google Chrome. Untuk Microsoft Edge, set `$env:BROWSER_CHANNEL = 'msedge'` di PowerShell sebelum menjalankan script. Setiap script menggunakan server production sementara dan menghentikannya setelah selesai.

Laporan JSON dan screenshot dibuat di `artifacts/`. Folder hasil verifikasi, cache, dan build tidak disimpan di Git; semua dapat dihasilkan kembali. Gunakan `VERIFY_OUTPUT` pada `verify` atau `verify:navbar` untuk memilih folder laporan lain.

## Struktur proyek

```text
src/app/                 Halaman, layout, metadata, dan stylesheet global
src/components/          Navbar, section konten, foto, dan footer
src/components/ui/       Galeri, kartu program, partikel, dan peta Jepang
src/lib/                 Data program/kontak, media, dan helper UI
public/                  Aset foto, SVG, favicon, serta sumber media
scripts/                 Preview statis, verifikasi, dan generator peta
references/              Referensi desain, poster, dan data geografis
preview/                 Prototype editorial awal
```

- [PRD](PRD_LPK_JAT_BANJARNEGARA.md) memuat dasar fakta dan desain awal. [Revisi multi-page](REVISION_MULTI_PAGE.md) mencatat scope serta penyesuaian terbaru.
- Data lembaga dan program dapat diperbarui melalui `src/lib/content.ts`; foto kegiatan melalui `src/lib/gallery.ts`.
- Beberapa rincian program, Admin 2, dan alamat lengkap masih berupa informasi yang perlu dikonfirmasi. Tidak ada statistik, testimoni, legalitas, atau hasil pelatihan yang dikarang.
- [Sumber media](public/images/SOURCES.md) dan `public/images/jat-gallery-sources.json` menyimpan provenance foto. Foto Jepang merupakan ilustrasi; foto kegiatan berasal dari listing J.A.T yang diberikan pemilik proyek.
- Peta memakai data Natural Earth public domain. Sumber tersimpan di [references/map-data](references/map-data/README.md); regenerasi offline dengan `node scripts/generate-japan-map.mjs`.
