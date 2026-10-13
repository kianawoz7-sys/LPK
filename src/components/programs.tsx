import { programs, media } from "@/lib/content";
import Link from "next/link";
import HowItWorks from "@/components/ui/how-it-works";

export function ProgramStrip() {
  return (
    <div className="strip">
      <ul className="container strip-in" aria-label="Pilihan program">
        {programs.map((program) => (
          <li className="strip-item" key={program.slug}>
            <Link href={`/program/${program.slug}/`} prefetch={false}>
              {program.stripName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Programs({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section className="programs bg-white" id="program" aria-labelledby="program-title">
      {showHeading && (
        <div className="container program-heading">
          <h2 id="program-title" className="text-neutral-800">Program Pelatihan</h2>
        </div>
      )}
      <HowItWorks
        features={programs.map((program) => ({
          title: program.name,
          href: `/program/${program.slug}/`,
          image: {
            src: media[program.image].src,
            alt: media[program.image].alt,
            width: media[program.image].width,
            height: media[program.image].height,
          },
        }))}
      />
    </section>
  );
}
