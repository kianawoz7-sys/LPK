import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/contact";
import { ParticleWave } from "@/components/ui/particle-wave";

export const metadata: Metadata = {
  title: {
    default: "LPK J.A.T Banjarnegara — Company Profile Demo",
    template: "%s | LPK J.A.T Banjarnegara",
  },
  description:
    "Company profile demo LPK J.A.T Banjarnegara: profil, empat pilihan program, galeri preview, dan kontak admin. Konsep tidak resmi.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#f8f9f7" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <ParticleWave className="site-particle-background" />
        <a className="skip-link" href="#konten">
          Lewati ke konten utama
        </a>
        <Header />
        <main id="konten" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
