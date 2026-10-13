import Link from "next/link";
import type { ReactNode } from "react";
import { Photo } from "@/components/photo";
import type { MediaKey } from "@/lib/content";

export function PageIntro({
  label,
  title,
  description,
  image,
  parent,
}: {
  label: string;
  title: ReactNode;
  description: string;
  image?: MediaKey;
  parent?: { label: string; href: string };
}) {
  return (
    <section className={`page-intro ${image ? "with-photo" : ""}`}>
      <div className="container">
        <nav className="breadcrumbs" aria-label="Jejak navigasi">
          <Link href="/" prefetch={false}>
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          {parent && (
            <>
              <Link href={parent.href} prefetch={false}>
                {parent.label}
              </Link>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span aria-current="page">{label}</span>
        </nav>
        <div className="page-intro-grid">
          <div>
            <div className="eyebrow micro">LPK J.A.T · BANJARNEGARA</div>
            <h1>{title}</h1>
            <p className="intro-description">{description}</p>
          </div>
          {image && <Photo image={image} className="intro-photo" priority />}
        </div>
      </div>
    </section>
  );
}
