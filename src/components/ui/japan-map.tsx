import Image from "next/image";
import { cn } from "@/lib/utils";

export function JapanMap({ className }: { className?: string }) {
  return (
    <figure className={cn("japan-map-card", className)}>
      <figcaption className="japan-map-heading">
        <span className="japan-map-flag" aria-hidden="true" />
        <span>Jepang</span>
      </figcaption>
      <Image
        src="/images/japan-map.svg"
        alt="Peta kepulauan Jepang"
        width={600}
        height={640}
        loading="eager"
        sizes="(max-width: 700px) 90vw, 600px"
        className="japan-map-image"
      />
    </figure>
  );
}
