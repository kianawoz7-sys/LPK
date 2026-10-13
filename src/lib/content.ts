export const programs = [
  {
    number: "01",
    slug: "bahasa-jepang",
    name: "Bahasa Jepang (Gakkou)",
    shortName: "Bahasa Jepang",
    stripName: "Bahasa Jepang (Gakkou)",
    image: "classroom",
  },
  {
    number: "02",
    slug: "tokutei-ginou",
    name: "Tokutei Ginou (TG)",
    shortName: "Tokutei Ginou",
    stripName: "Tokutei Ginou (TG)",
    image: "city",
  },
  {
    number: "03",
    slug: "magang-jepang",
    name: "Magang Jepang (Ginou Jisshusei)",
    shortName: "Magang Jepang",
    stripName: "Magang Jepang",
    image: "station",
  },
  {
    number: "04",
    slug: "engineering",
    name: "Engineering",
    shortName: "Engineering",
    stripName: "Engineering",
    image: "city",
  },
] as const;

export const navigation = [
  { href: "/", label: "Beranda" },
  { href: "/tentang/", label: "Tentang Kami" },
  { href: "/program/", label: "Program Pelatihan" },
  { href: "/galeri/", label: "Galeri" },
  { href: "/kontak/", label: "Kontak" },
] as const;

export const contacts = {
  admin1: { number: "0857 4334 7760", url: "https://wa.me/6285743347760" },
  // Poster number is not verified. Deliberately has no URL.
  admin2: { number: "0821 4394 492", status: "Konfirmasi nomor ke LPK" },
  location: "Prigi, Banjarnegara, Jawa Tengah",
} as const;

export const steps = [
  {
    number: "01",
    title: "Konsultasi program",
    description:
      "Hubungi admin untuk mendiskusikan tujuan belajar atau rencana berkarier di Jepang.",
  },
  {
    number: "02",
    title: "Tanyakan persyaratan",
    description:
      "Pastikan dokumen, jadwal, dan detail program yang terbaru dengan admin.",
  },
  {
    number: "03",
    title: "Siapkan langkahmu",
    description:
      "Pilih langkah berikut sesuai informasi resmi dan arahan dari pihak LPK.",
  },
] as const;

export const media = {
  classroom: {
    src: "/images/jat-kelas-belajar.jpg",
    width: 1024,
    height: 576,
    alt: "Suasana kelas dari listing publik J.A.T di Google Maps; referensi internal dengan izin belum diverifikasi.",
    caption: "Preview J.A.T · Google Maps · izin belum diverifikasi",
    credit: "Lpk Jat / Google Maps",
  },
  city: {
    src: "/images/tokyo-city.jpg",
    width: 1440,
    height: 960,
    alt: "Suasana jalan di Tokyo. Foto ilustrasi Jepang, bukan dokumentasi kegiatan LPK J.A.T.",
    caption: "Ilustrasi Jepang · bukan dokumentasi J.A.T",
    credit: "Tunafish / Unsplash",
  },
  station: {
    src: "/images/tokyo-station.jpg",
    width: 1440,
    height: 960,
    alt: "Peron stasiun di Tokyo. Foto ilustrasi Jepang, bukan dokumentasi kegiatan LPK J.A.T.",
    caption: "Ilustrasi Jepang · bukan dokumentasi J.A.T",
    credit: "Rafael Hoyos Weht / Unsplash",
  },
} as const;

export type MediaKey = keyof typeof media;

export const programDetailsPending = [
  {
    label: "Materi & cakupan program",
    value: "Belum tersedia",
  },
  {
    label: "Persyaratan peserta",
    value: "Belum tersedia",
  },
  { label: "Jadwal & durasi", value: "Belum tersedia" },
  { label: "Biaya program", value: "Belum tersedia" },
] as const;
