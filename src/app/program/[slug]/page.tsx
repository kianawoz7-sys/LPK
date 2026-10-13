import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "@/components/photo";
import { contacts, programDetailsPending, programs } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return programs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);
  return {
    title: program?.name ?? "Program",
    description: program ? `${program.name} pada poster LPK J.A.T. Rincian program belum tersedia.` : undefined,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);
  if (!program) notFound();
  const whatsappUrl = `${contacts.admin1.url}?text=${encodeURIComponent(`Halo Admin LPK J.A.T, saya ingin menanyakan informasi program ${program.name}.`)}`;

  return (
    <article className="program-detail bg-white">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Jejak navigasi">
          <Link href="/" prefetch={false}>Beranda</Link>
          <span aria-hidden="true">/</span>
          <Link href="/program/" prefetch={false}>Program Pelatihan</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{program.shortName}</span>
        </nav>
        <div className="grid items-center gap-8 pt-4 pb-12 md:grid-cols-2 md:gap-14 md:pb-16">
          <div className="program-detail-summary">
            <h1 className="text-[38px] leading-tight font-bold tracking-tight text-neutral-800 sm:text-5xl">
              {program.name}
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-neutral-500">Rincian program belum tersedia.</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-11 items-center gap-4 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-neutral-700"
              aria-label={`Tanyakan program ${program.name} kepada Admin 1 melalui WhatsApp`}
            >
              Tanyakan ke admin <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <Photo image={program.image} className="program-detail-photo" priority />
        </div>
        <section className="border-t border-neutral-200 pt-8 pb-12 md:pb-16" aria-labelledby="detail-title">
          <h2 id="detail-title" className="text-2xl font-semibold tracking-tight text-neutral-800">Informasi program</h2>
          <dl className="detail-facts">
            {programDetailsPending.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="border-t border-neutral-200 pt-8 pb-12 md:pb-16" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-8 text-2xl font-semibold tracking-tight text-neutral-800">Program lainnya</h2>
          <div className="related-programs">
            {programs.filter((item) => item.slug !== slug).map((item) => (
              <Link href={`/program/${item.slug}/`} prefetch={false} key={item.slug}>
                <h3>{item.name}</h3>
                <span className="related-arrow" aria-hidden="true"><ArrowUpRight className="h-5 w-5" /></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
