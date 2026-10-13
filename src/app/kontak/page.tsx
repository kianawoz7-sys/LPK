import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { ContactCard } from "@/components/contact";
import { contacts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Admin 1 LPK J.A.T Banjarnegara melalui WhatsApp 0857 4334 7760. Lokasi umum: Prigi, Banjarnegara, Jawa Tengah.",
};

export default function ContactPage() {
  return (
    <>
      <PageIntro
        label="Kontak"
        title={
          <>
            Perjalanan besar dimulai
            <br />
            <em>dari satu pertanyaan.</em>
          </>
        }
        description="Tanyakan pilihan program, persyaratan, dan informasi terbaru langsung kepada admin LPK J.A.T Banjarnegara."
      />
      <section className="section contact-page-section">
        <div className="container contact-page-grid">
          <div>
            <div className="kicker">01 / HUBUNGI ADMIN</div>
            <h2>
              Mari mulai
              <br />
              <em>percakapannya.</em>
            </h2>
            <p className="body-copy">
              Sampaikan tujuan belajar atau rencana kariermu. Admin dapat
              membantu memberikan informasi program yang perlu kamu ketahui
              sebelum mengambil langkah berikutnya.
            </p>
            <div className="contact-checklist">
              <h3>Siapkan pertanyaanmu</h3>
              <ul>
                <li>Program yang ingin kamu kenali</li>
                <li>Persyaratan dan dokumen yang diperlukan</li>
                <li>Jadwal, durasi, dan biaya terbaru</li>
              </ul>
            </div>
            <Link href="/program/" prefetch={false} className="text-link">
              Lihat pilihan program <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <ContactCard />
        </div>
      </section>
      <section className="section location-section">
        <div className="container location-grid">
          <div>
            <div className="kicker">02 / LOKASI LEMBAGA</div>
            <h2>
              Temukan J.A.T
              <br />
              <em>di Banjarnegara.</em>
            </h2>
            <p className="body-copy">{contacts.location}</p>
            <p className="inline-note">
              Alamat lengkap dan jam layanan belum dikonfirmasi. Hubungi admin
              untuk memastikan lokasi dan waktu kunjungan.
            </p>
          </div>
          <div className="location-placeholder">
            <span className="placeholder-label">LOKASI UMUM</span>
            <span className="location-word">
              Prigi<span>.</span>
            </span>
            <p>Banjarnegara, Jawa Tengah</p>
            <div className="location-pending">
              Alamat lengkap &amp; peta: menunggu konfirmasi LPK
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
