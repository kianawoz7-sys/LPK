# PRD — WEBSITE COMPANY PROFILE DEMO LPK J.A.T BANJARNEGARA

**Versi:** 2.0 / Editorial Minimalist — 13 Oktober 2026  
**Status:** DEMO PENAWARAN, bukan proyek yang sudah disetujui klien atau situs resmi  
**Deliverable:** satu homepage responsif yang bisa dijalankan secara lokal, dengan screenshot desktop dan mobile hasil render browser  
**Bahasa:** Indonesia  
**Sumber kebenaran desain:** `references/editorial_desktop.png`, `references/editorial_mobile.png`, dan `preview/index.html` (desain nyata berbasis HTML/CSS).  
**Sumber kebenaran fakta:** `references/poster_lpk_jat.png`, bukan mockup atau situs LPK lain.

---

## 0. PERINTAH WAJIB AGENT

1. Implementasikan website **nyata**, bukan gambar AI, Figma dummy, atau landing page yang sekadar terlihat bisa diklik. Harus dapat dijalankan dan diperiksa di browser.
2. **Ikuti arah visual EDITORIAL MINIMALIST dari preview baru**, jangan kembalikan estetika lama `Modern Japanese Corporate`/AI template. Gambar mockup AI lama yang berisi Fuji/sakura/angka palsu tidak boleh dipakai atau dicari kembali.
3. Jangan melenceng dari scope: **hanya 1 homepage (`/`)**. Tidak ada dashboard, admin, database, API, CMS, login, formulir pendaftaran, payment, atau halaman baru.
4. Perhatikan keseluruhan komposisi: tipografi besar, hirarki editorial, garis pemisah halus, whitespace, foto nyata yang diberi konteks, dan aksen warna seminimal mungkin.
5. **Jangan menciptakan fakta.** Tidak boleh ada statistik/alumni/kemitraan/pengajar berpengalaman/izin resmi/garansi kerja/gaji/jadwal/biaya/durasi/kuota/testimoni tanpa konfirmasi klien.
6. Jika foto bukan aset yang diserahkan resmi oleh LPK, hanya gunakan sebagai preview lokal dengan label sumber sementara dan minta izin sebelum publikasi. Jangan menggunakan gambar dari LPK Bangkit sebagai dokumentasi LPK J.A.T.
7. Jangan membuat copy, elemen, atau section tambahan yang memaksa desain menjadi template generik. Bila PRD dan screenshot tidak persis identik, gunakan PRD untuk fakta dan behavior, screenshot/HTML untuk estetika.
8. Bila nanti dideploy sebagai demo review, tampilkan status *konsep tidak resmi* dan set `noindex,nofollow`.
9. Lakukan build dan screenshot nyata sebelum menyatakan tugas selesai.

## 1. TUJUAN PRODUK DAN AUDIENS

Landing page demo yang meyakinkan untuk ditunjukkan kepada pengelola LPK J.A.T Banjarnegara sekaligus memperlihatkan bagaimana calon peserta dan orang tua/wali akan menemukan program, informasi awal, dan kontak pendaftaran. Website harus tampak dirancang khusus untuk J.A.T, bukan copy-paste desain perusahaan lain.

**Alur pengguna:** datang → memahami nilai utama → melihat keempat jalur program → mendapat konteks lembaga dan langkah awal → menghubungi admin.

**Indikator sukses demo:** owner dapat melihat website rapi di desktop/HP; nama LPK dan 4 program akurat; CTA mengarah ke nomor yang valid; tidak ada data yang direkayasa.

## 2. DATA YANG TERKONFIRMASI DARI POSTER

| Item | Isi yang boleh digunakan |
|---|---|
| Identitas | LPK J.A.T BANJARNEGARA |
| Fokus | Pelatihan bahasa Jepang dan pendampingan karier ke Jepang |
| Program 01 | Bahasa Jepang (Gakkou) |
| Program 02 | Tokutei Ginou (TG) |
| Program 03 | Magang Jepang (Ginou Jisshusei) |
| Program 04 | Engineering |
| Admin 1 | 0857 4334 7760 — nomor WA yang dipakai CTA demo |
| Admin 2 | Nomor pada poster terbaca `0821 4394 492`, **BELUM terverifikasi**. Tampilkan sebagai teks saja dengan label “Konfirmasi nomor ke LPK”, jangan link WhatsApp aktif |
| Lokasi umum | Prigi, Banjarnegara, Jawa Tengah; alamat lengkap perlu verifikasi |
| Warna | Biru dan putih dominan pada poster, oranye pada logo dan materi (HEX desain = estimasi) |

**Jangan tampilkan sebagai fakta**: tahun berdiri, jumlah alumni, siswa, kantor cabang, perusahaan mitra, nomor izin, prestasi, biaya, jadwal, kelulusan atau keberangkatan pasti. Hindari kalimat “pasti kerja di Jepang”, walau materi promosi menggunakan slogan serupa. `OPEN REGISTRATION` sebagai status real-time juga jangan ditampilkan tanpa konfirmasi bahwa pendaftarannya masih dibuka.

## 3. DESIGN DIRECTION — EDITORIAL MINIMALIST

**Harus mengikuti screenshot dan file `preview/index.html`, bukan mockup AI lama.** Komposisi desktop dan mobile perlu mirip secara visual, tetapi agent boleh memperbaiki detail aksesibilitas/performa/interaksi.

- **Karakter:** layout editorial modern, formal tapi tetap human, tegas, elegan, rapi; jangan banyak ornament.
- **Background:** putih tulang / off-white dan putih; bagian Tentang boleh abu-biru lembut. Section Kontak memakai navy gelap sebagai kontras penutup.
- **Tipografi:** Inter, Geist, atau font sans modern sejenis dengan fallback `system-ui`. Headline hero sangat dominan, condensed melalui pengaturan tracking/line-height (bukan font dekoratif). Tidak perlu Poppins jika malah membuat tampilan terasa template.
- **Warna (target awal):** ink `#152D4A`, navy `#0C3264`, blue `#12529A`, orange `#F06B36`, paper `#F8F9F7`, muted `#5F6F7D`, line `#DCE2E8`.
- **Ciri elemen:** section nomor kecil (`01 / PROGRAM`), divider tipis, teks heading besar, susunan asimetris terkendali, sudut tombol relatif tegas (radius kecil), ikon sangat minim.
- **Tidak boleh:** background hero biru full, empat program sebagai kartu kotak, komposisi template SaaS, banyak ikon bulat, statistik tidak valid, Fuji/sakura/torii sebagai dekorasi klise, gradient neon, glassmorphism, glowing button, 3D, efek parallax berat.
- **Fotografi:** foto kegiatan asli J.A.T *jika izin penggunaan tersedia*. Gambar yang disertakan dalam preview diambil dari konteks screenshot publik untuk **evaluasi internal**, bukan bukti izin publikasi. Jika ragu, pakai placeholder berlabel daripada mencari foto stock siswa Jepang lalu mengklaim itu kelas LPK.

### Visual baseline (wajib)

`references/editorial_desktop.png` = tampilan desktop homepage yang disetujui sebagai arah desain; `references/editorial_mobile.png` = versi mobile; `references/editorial_showcase.png` = perbandingan. `preview/index.html` dan `preview/assets/*` = implementasi HTML/CSS lama sebagai baseline. Boleh pakai kode prototipe untuk ide CSS/spacing, **tidak wajib mempertahankan bug atau data yang belum diverifikasi**.

## 4. SECTION HALAMAN (urutan target)

### A. Brand banner & navbar

- Banner info kecil di atas berlabel `DESIGN CONCEPT / BUKAN WEBSITE RESMI` selama tahap demo.
- Navbar dengan wordmark sementara `LPK J.A.T BANJARNEGARA` (bukan menggambar ulang logo baru dan mengklaim resmi); desktop: Beranda, Program, Tentang Kami, Alur, CTA Hubungi Admin. Mobile hamburger benar-benar terbuka/tertutup, keyboard/ARIA bekerja.
- Tidak perlu sticky/floating navbar bila tidak menambah kegunaan.

### B. Hero putih/editorial (bagian terpenting)

- **Latar off-white**, bukan full navy; desktop dua kolom tidak simetris (teks lebih dominan). Mobile satu kolom dengan foto di bawah copy.
- Eyebrow kecil `LPK J.A.T · BANJARNEGARA` dengan garis oranye.
- **H1:** `LANGKAH BARU MENUJU JEPANG.` — kata `JEPANG.` berwarna oranye; baris dapat dibagi sesuai ukuran layar.
- Copy ringkas: `Pelatihan bahasa Jepang dan pendampingan karier untuk kamu yang ingin mempersiapkan masa depan di Jepang.`
- CTA primer `Tanya Program` → `#kontak` (atau nomor WA Admin 1); CTA sekunder `Lihat Program` → `#program`.
- Foto kelas menempati sisi kanan dengan frame tipis / blok pendukung netral, tanpa gimmick dekoratif.
- Jangan pakai status pendaftaran aktif atau statistik rekaan pada hero.

### C. Program strip (informasi ringkas)

- Strip navy tipis tepat di bawah hero berisi empat nama program, tanpa klaim tambahan.
- Desktop 4 kolom; mobile dua kolom. Ini **label navigasi/informasi**, bukan KPI atau jumlah peserta.

### D. Program utama (`#program`)

- Headline editorial `Setiap tujuan punya jalan persiapannya.`
- **Empat BARIS daftar (bukan kartu)**, dengan `01/02/03/04`, nama program besar, deskripsi satu kalimat, arrow kecil di kanan, pembatas horizontal.
- Urutan wajib: Bahasa Jepang (Gakkou) → Tokutei Ginou (TG) → Magang Jepang (Ginou Jisshusei) → Engineering.
- Baris boleh mengarah ke `#kontak` atau URL WA Admin 1 dengan pesan pra-isi yang menyebut program; jangan arahkan ke halaman detail yang tidak ada.

### E. Tentang (`#tentang`)

- Block off-blue sangat lembut; dua kolom asimetris untuk desktop, satu kolom mobile.
- Judul `Belajar dengan arah yang jelas.`
- Teks pendek, faktual, **bukan** profil lengkap yang dikarang: `LPK J.A.T Banjarnegara memperkenalkan program pelatihan bahasa Jepang dan pendampingan karier menuju Jepang. Temukan informasi awal tentang pilihan program dan hubungi admin untuk mengetahui proses pendaftarannya.`
- Sisi kanan **typographic poster/statement sederhana**, bukan stok foto, statistik, atau deretan badge pencapaian.

### F. Langkah awal (`#alur`)

- Tiga langkah editorial dengan top border, nomor `STEP / 01` dst., bukan timeline kartun:
  1. Konsultasi program — hubungi admin untuk mendiskusikan tujuan.
  2. Tanyakan persyaratan — pastikan dokumen, jadwal, dan detail yang terbaru.
  3. Siapkan langkahmu — pilih langkah berikut sesuai informasi resmi LPK.
- Wajib ada disclaimer `Ini adalah gambaran alur konsultasi, bukan prosedur resmi yang sudah diverifikasi.`
- Mobile vertikal, desktop 3 kolom; jangan menampilkan visa, keberangkatan atau penempatan kerja sebagai langkah otomatis.

### G. Kontak / CTA akhir (`#kontak`)

- Satu blok navy kontras untuk closing. Judul editorial `Perjalanan besar dimulai dari satu pertanyaan.`
- Card putih yang berisi:
  - Admin 1 `0857 4334 7760` → link WA `https://wa.me/6285743347760` (pesan pra-isi opsional).
  - Admin 2 `0821 4394 492 (perlu konfirmasi)` → hanya teks NON-CLICKABLE sampai nomor diverifikasi; jangan berasumsi valid.
  - Lokasi cukup teks `Prigi, Banjarnegara, Jawa Tengah`; jika ingin Maps link harus pakai lokasi dan URL terverifikasi dari sumber yang relevan, tidak mengarang.
- Footer pendek berisi identitas dan disclaimer: `Konsep desain tidak resmi — memerlukan persetujuan pihak LPK sebelum publikasi.`

### H. Section tambahan (TIDAK WAJIB pada demo)

- **Galeri** hanya jika tersedia foto J.A.T yang legal dan layak tayang, bukan grid placeholder kosong atau foto lembaga lain.
- **FAQ** hanya jika membantu menjawab pertanyaan tanpa merekayasa informasi; jangan memaksakan accordion demi menambah panjang halaman.
- Jangan menambah kartu testimoni, leaderboard, logo mitra, counter animasi, peta Jepang, statistik, atau section lain tanpa approval.

## 5. RESPONSIVE, INTERACTION, ACCESSIBILITY

- Render wajib diuji pada **1440×900**, **390×844**; tambahan **768×1024** dianjurkan.
- Desktop container maksimum 1240px, padding horizontal 36–48px; mobile padding 20–24px. Spacing section lega, tidak perlu setiap section setinggi viewport.
- Hero desktop kiri-kanan; mobile urutan copy → CTA → foto. H1 mobile 42–58px adaptif, tidak melewati tepi.
- Program list mobile mempertahankan nomor dan arah panah; teks deskripsi pindah ke bawah judul, bukan tabel horizontal yang overflow.
- Menu mobile accessible: `aria-expanded` sesuai state, bisa ditutup sesudah pilih link, tautan bisa digunakan keyboard.
- Semua target tap minimum nyaman sekitar 44px, kontras memadai, alt foto tepat, hanya 1 H1, focus visible, `prefers-reduced-motion`.
- Hover transisi 150–250ms. Tidak perlu library animasi berat.
- Link WA `target="_blank"` disertai `rel="noopener noreferrer"`.

## 6. IMPLEMENTASI TEKNIS

- **Jika repo sudah ada**, ikuti stack dan struktur yang ada. Jangan hapus atau reset project.
- **Jika repo kosong**, pakai Next.js App Router + TypeScript + Tailwind CSS. `lucide-react` hanya jika benar-benar dibutuhkan, tidak wajib.
- Komponen dipisah secukupnya: Header, Hero, ProgramStrip, Programs, About, Steps, Contact, Footer; data program dan nomor kontak dalam konstanta lokal.
- Tidak perlu dependency tambahan untuk CMS, backend, Firebase, database, chat widget, auth, upload, pembayaran.
- Optimasi gambar, pemuatan font, semantic HTML, SEO title/description yang tidak mengandung klaim palsu. Untuk demo publik gunakan `noindex,nofollow`.
- Hindari pengambilan aset pihak ketiga tanpa izin; foto dari Google Maps diperlakukan sebagai **referensi lokal** sampai izin penggunaan dikonfirmasi.
- Kode bersih, mudah dilanjutkan ketika calon klien menyetujui kerja sama.

## 7. DEFINITION OF DONE — HARUS LULUS

- [ ] Website berjalan dan production build berhasil.
- [ ] Satu homepage saja, tanpa fitur/backend di luar scope.
- [ ] Tampilan setia pada `editorial_desktop.png` dan `editorial_mobile.png`, bukan referensi AI yang lama.
- [ ] Hero off-white editorial dengan H1 besar, CTA jelas, foto/placeholder rapi.
- [ ] Empat program berupa **baris bernomor**; nama dan urutan akurat.
- [ ] Tidak ada statistik, logo mitra, jaminan kerja, klaim validasi, atau foto fiktif.
- [ ] Admin 1 link WA benar; Admin 2 tidak clickable sebelum diverifikasi.
- [ ] Mobile menu benar-benar bekerja; anchor nav dan CTA benar.
- [ ] Tidak ada horizontal overflow pada 390px atau elemen terpotong di desktop.
- [ ] Semua ilustrasi/placeholder diberi label yang tidak menyesatkan.
- [ ] Jika dipublikasikan untuk review: status demo tidak resmi dan `noindex,nofollow`.
- [ ] Screenshot desktop+mobile diambil dari browser rendering aktual (bukan image generation).
- [ ] Catat file berubah, hasil build, masalah yang masih tertunda, dan aset yang harus diminta ke LPK.

## 8. SUMBER DAN PRIORITAS KONFLIK

1. Instruksi terbaru dari pemilik proyek.
2. PRD V2 ini (fakta, fitur, scope, kualitas).
3. Poster asli J.A.T (nama/program/kontak), dengan penanda data yang masih perlu verifikasi.
4. Screenshot editorial dan HTML prototype baru (layout, proporsi, style).
5. Referensi website LPK Bangkit yang mungkin sudah dilihat user: **inspirasi informasi umum saja**, jangan menjadikannya sumber UI atau konten LPK J.A.T.

**CATATAN MIGRASI DARI PRD V1:** `visual_mockup_generated.png` dan instruksi `Modern Japanese Corporate`, hero full navy, empat program cards, ornamen Jepang berlebihan, serta galeri/FAQ wajib **sudah dibatalkan**. Jangan menggunakan arsip lama sebagai instruksi.
