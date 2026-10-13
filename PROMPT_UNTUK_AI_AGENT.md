# Prompt untuk Sol 6.1 — Website LPK J.A.T (PRD V2)

Kamu adalah senior frontend engineer dengan perhatian tinggi terhadap detail desain. **Pertama baca** `PRD_LPK_JAT_BANJARNEGARA.md`, `README.md`, screenshot di `references/editorial_desktop.png` + `references/editorial_mobile.png`, dan `preview/index.html`. Poster `references/poster_lpk_jat.png` adalah sumber fakta, bukan screenshot desain.

Bangun SATU homepage demo LPK J.A.T Banjarnegara. **Visual yang diwajibkan adalah EDITORIAL MINIMALIST**, bukan mockup AI lama. Ikuti susunan, hierarki, skala heading, spacing, warna, dan struktur daftar program seperti preview desktop/mobile yang disertakan. Hero berlatar putih tulang, teks besar, foto/placeholder di kanan; program berupa empat BARIS bernomor (bukan cards); Tentang tipografis; 3 langkah awal; kontak navy + footer. Tidak usah menambahkan section generik, ornamen Fuji/sakura, fake stats, pengakuan mitra, atau backend.

Dilarang mengarang informasi. Poster mencantumkan empat program: Bahasa Jepang (Gakkou), Tokutei Ginou (TG), Magang Jepang (Ginou Jisshusei), Engineering. Admin 1 0857 4334 7760 boleh dipakai sebagai WhatsApp CTA. Nomor Admin 2 pada poster belum terkonfirmasi, tampilkan teks saja, JANGAN buat link WA. Foto preview bukan aset resmi dengan izin publikasi, jangan menyebutnya dokumentasi resmi yang sudah disetujui.

Jika repo kosong gunakan Next.js App Router + TypeScript + Tailwind; jika sudah ada ikuti stack existing tanpa mereset. Implementasikan frontend saja. Pastikan semua anchor/tombol/menu mobile bekerja. Tandai situs sebagai **demo tidak resmi** dan gunakan `noindex,nofollow` untuk preview publik.

Urutan kerja: audit repo → rencana implementasi singkat → coding → jalankan build → render screenshot 1440×900 dan 390×844 → bandingkan dengan screenshot referensi, perbaiki mismatch → laporkan hasil, file berubah, screenshot, dan daftar data/aset klien yang masih pending. **Jangan klaim selesai tanpa tes dan screenshot nyata.**

**Keputusan desain:** PRD V2 + preview editorial terbaru mengalahkan semua instruksi/mockup visual versi lama. Tidak perlu meminta izin tambahan untuk perbaikan visual yang tetap sesuai PRD, tetapi tanyakan dulu sebelum memperluas scope.
