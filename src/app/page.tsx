import { Hero } from "@/components/hero";
import { Programs, ProgramStrip } from "@/components/programs";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { GalleryTeaser } from "@/components/gallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda — Langkah Baru Menuju Jepang",
};

export default function Home() {
  return (
    <>
      <Hero />
      <ProgramStrip />
      <Programs />
      <About />
      <GalleryTeaser />
      <Contact />
    </>
  );
}
