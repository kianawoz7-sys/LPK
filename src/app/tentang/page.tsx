import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { JapanMap } from "@/components/ui/japan-map";
import { contacts } from "@/lib/content";
import { activityPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "LPK J.A.T Banjarnegara — pelatihan bahasa Jepang dan pendampingan karier menuju Jepang. Berlokasi di Prigi, Banjarnegara, Jawa Tengah.",
};

export default function AboutPage() {
  const classroom = activityPhotos[0];

  return (
    <section className="about-profile" aria-labelledby="profile-title">
      <div className="container">
        <div className="about-profile-grid">
          <div className="about-profile-copy">
            <div className="kicker">Tentang Kami</div>
            <h1 id="profile-title">
              LPK J.A.T
              <br />
              Banjarnegara.
            </h1>
            <p>
              Pelatihan bahasa Jepang dan pendampingan karier menuju Jepang.
            </p>
            <Link href="/program/" prefetch={false} className="text-link">
              Program Pelatihan <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <JapanMap className="about-profile-map" />

          <figure className="about-profile-photo">
            <Image
              src={classroom.src}
              alt={classroom.alt}
              width={classroom.width}
              height={classroom.height}
              preload
              sizes="(max-width: 700px) 90vw, 500px"
            />
            <figcaption>
              <span>Kegiatan di LPK J.A.T</span>
              <span className="about-profile-location">
                <MapPin size={15} strokeWidth={1.6} aria-hidden="true" />
                {contacts.location}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
