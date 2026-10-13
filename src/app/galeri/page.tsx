import type { Metadata } from "next";
import {
  Gallery,
  GalleryGrid,
  GalleryImage,
} from "@/components/ui/shared-element-gallery";
import { activityPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Foto kegiatan LPK J.A.T Banjarnegara dalam galeri interaktif. Dokumentasi dari listing Google Maps untuk preview lokal.",
};

export default function GalleryPage() {
  return (
    <section
      className="photo-only-gallery min-h-[calc(100svh-123px)] bg-paper"
      aria-label="Foto kegiatan LPK J.A.T"
    >
      <h1 className="sr-only">Galeri kegiatan LPK J.A.T</h1>
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-14 lg:py-16">
        <Gallery>
          <GalleryGrid>
            {activityPhotos.map((photo) => (
              <GalleryImage
                key={photo.id}
                id={photo.id}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
              />
            ))}
          </GalleryGrid>
        </Gallery>
      </div>
    </section>
  );
}
