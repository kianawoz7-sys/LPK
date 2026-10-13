import Image from "next/image";
import type { ActivityPhotoData } from "@/lib/gallery";

export function ActivityPhoto({
  photo,
  priority = false,
}: {
  photo: ActivityPhotoData;
  priority?: boolean;
}) {
  return (
    <figure className="activity-photo">
      <div className="activity-photo-frame">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          preload={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 700px) 90vw, (max-width: 1000px) 48vw, 680px"
        />
      </div>
      <figcaption>
        <span className="activity-category">{photo.category}</span>
        <h3>{photo.title}</h3>
        <div className="activity-photo-source">
          <span>Unggahan: {photo.author}</span>
        </div>
      </figcaption>
    </figure>
  );
}
