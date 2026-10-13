import Image from "next/image";
import { media, type MediaKey } from "@/lib/content";

export function Photo({
  image,
  className = "",
  priority = false,
}: {
  image: MediaKey;
  className?: string;
  priority?: boolean;
}) {
  const asset = media[image];
  return (
    <figure className={`editorial-photo ${className}`}>
      <div className="photo-frame">
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          preload={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 700px) 90vw, (max-width: 1000px) 48vw, 600px"
        />
      </div>
      <figcaption>
        <span>{asset.caption}</span>
        <span className="photo-credit">{asset.credit}</span>
      </figcaption>
    </figure>
  );
}
