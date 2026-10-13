export const gallerySource =
  "https://www.google.com/maps/place/LPK+J.A.T+BANJARNEGARA/@-7.4010443,109.7727278,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7aa700365961ef:0x9ece348ace5cb158!8m2!3d-7.4010496!4d109.7753027!16s%2Fg%2F11zd6209ly?entry=ttu";

// Captions describe only what is visible. Dates are Maps upload dates,
// not verified dates of the activities or evidence of a particular program.
export const activityPhotos = [
  {
    id: "kelas-belajar",
    src: "/images/jat-kelas-belajar.jpg",
    width: 1024,
    height: 576,
    title: "Suasana belajar di kelas",
    category: "Kegiatan kelas",
    alt: "Suasana belajar dengan peserta duduk di meja dan seseorang di depan papan tulis pada foto listing J.A.T.",
    author: "Lpk Jat",
    uploaded: "Agustus 2026",
    photoId: "CIABIhCwffrq-I9T9jggN-fR7BT3",
  },
  {
    id: "papan-tulis",
    src: "/images/jat-papan-tulis.jpg",
    width: 576,
    height: 1024,
    title: "Latihan di papan tulis",
    category: "Aktivitas belajar",
    alt: "Seseorang menulis di papan tulis dalam ruang kelas pada foto listing J.A.T.",
    author: "Helmy Yt (HU)",
    uploaded: "Agustus 2026",
    photoId: "CIABIhDIud-JAshqj7wiaMG-EduJ",
  },
  {
    id: "percakapan",
    src: "/images/jat-percakapan.jpg",
    width: 1024,
    height: 768,
    title: "Percakapan di ruang LPK",
    category: "Suasana LPK",
    alt: "Dua orang duduk berhadapan di meja dalam ruang LPK pada foto listing J.A.T.",
    author: "LPK J.A.T BANJARNEGARA",
    uploaded: "Oktober 2026",
    photoId: "CIABIhBeUCKhKnsKKG63czdPV8CS",
  },
  {
    id: "kegiatan-bersama",
    src: "/images/jat-kegiatan-bersama.jpg",
    width: 1024,
    height: 576,
    title: "Momen kegiatan bersama",
    category: "Kebersamaan",
    alt: "Foto bersama sekelompok orang di sebuah ruangan dari listing publik J.A.T.",
    author: "LPK J.A.T BANJARNEGARA",
    uploaded: "Oktober 2026",
    photoId: "CIABIhByJsxCyfzHyIvgL6P5aHzE",
  },
  {
    id: "foto-bersama",
    src: "/images/jat-foto-bersama.jpg",
    width: 1024,
    height: 576,
    title: "Foto bersama di depan LPK",
    category: "Kebersamaan",
    alt: "Sekelompok orang berfoto bersama di depan bangunan LPK pada listing J.A.T.",
    author: "LPK J.A.T BANJARNEGARA",
    uploaded: "Oktober 2026",
    photoId: "CIABIhC69kuDEKA077J6sdioLqSs",
  },
] as const;

export type ActivityPhotoData = (typeof activityPhotos)[number];
