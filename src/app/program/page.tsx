import type { Metadata } from "next";
import { Programs } from "@/components/programs";

export const metadata: Metadata = {
  title: "Program Pelatihan",
  description:
    "Pilihan program pada poster LPK J.A.T Banjarnegara. Rincian program menunggu konfirmasi dari lembaga.",
};

export default function ProgramsPage() {
  return (
    <div className="program-index bg-white">
      <div className="container program-heading">
        <h1 id="program-title" className="text-[38px] leading-tight font-bold tracking-tight text-neutral-800 sm:text-5xl">
          Program Pelatihan
        </h1>
      </div>
      <Programs showHeading={false} />
    </div>
  );
}
