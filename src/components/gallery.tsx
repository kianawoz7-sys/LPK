import Link from "next/link";
import { ActivityPhoto } from "@/components/activity-photo";
import { activityPhotos } from "@/lib/gallery";

export function GalleryTeaser() {
  return (
    <section className="section gallery-teaser" aria-labelledby="gallery-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker">03 / KEGIATAN J.A.T</div>
            <h2 id="gallery-title">
              Belajar bersama.
              <br />
              <em>Cerita dari J.A.T.</em>
            </h2>
          </div>
          <Link href="/galeri/" className="text-link" prefetch={false}>
            Jelajahi Galeri <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="gallery-teaser-grid">
          <ActivityPhoto photo={activityPhotos[0]} />
          <ActivityPhoto photo={activityPhotos[2]} />
          <ActivityPhoto photo={activityPhotos[4]} />
        </div>
        <p className="source-note">
          Foto dari listing Google Maps J.A.T untuk preview lokal. Izin publikasi
          belum diverifikasi.
        </p>
      </div>
    </section>
  );
}
