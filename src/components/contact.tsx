import { contacts, navigation } from "@/lib/content";
import Link from "next/link";

export function Contact({ number = "04" }: { number?: string } = {}) {
  return (
    <section className="cta" id="kontak" aria-labelledby="contact-title">
      <div className="container cta-grid">
        <div>
          <div className="kicker">{number} / HUBUNGI KAMI</div>
          <h2 id="contact-title">
            Perjalanan besar
            <br />
            dimulai dari
            <br />
            <span>satu pertanyaan.</span>
          </h2>
          <p>
            Tertarik belajar bahasa Jepang atau mengenal jalur karier ke Jepang?
            Hubungi admin LPK J.A.T Banjarnegara untuk informasi pendaftaran.
          </p>
        </div>
        <ContactCard />
      </div>
    </section>
  );
}

export function ContactCard({ program }: { program?: string }) {
  const url = program
    ? `${contacts.admin1.url}?text=${encodeURIComponent(`Halo Admin LPK J.A.T, saya ingin bertanya tentang program ${program}.`)}`
    : contacts.admin1.url;
  return (
    <div className="contact-card">
      <div className="contact-heading">INFORMASI PENDAFTARAN / WHATSAPP</div>
      <a
        className="admin"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Hubungi Admin 1 melalui WhatsApp: ${contacts.admin1.number} (tab baru)`}
      >
        <span>
          <span className="admin-label">Admin 01</span>
          <span className="admin-number">{contacts.admin1.number}</span>
        </span>
        <span className="wa-circle" aria-hidden="true">
          ↗
        </span>
      </a>
      <div className="admin admin-unverified">
        <span>
          <span className="admin-label">Admin 02 · perlu konfirmasi</span>
          <span className="admin-number">{contacts.admin2.number}</span>
        </span>
        <span className="admin-status">{contacts.admin2.status}</span>
      </div>
      <div className="contact-location">
        <span className="admin-label">Lokasi</span>
        <span>{contacts.location}</span>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="footer-wordmark" prefetch={false}>
            JAT<span>.</span>
          </Link>
          <p>LPK J.A.T Banjarnegara</p>
          <p className="footer-description">
            Pelatihan bahasa Jepang &amp;
            <br />
            pendampingan karier menuju Jepang.
          </p>
        </div>
        <nav aria-label="Navigasi footer">
          <span className="footer-label">JELAJAHI</span>
          {navigation.map(({ href, label }) => (
            <Link href={href} prefetch={false} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div>
          <span className="footer-label">TEMUKAN KAMI</span>
          <p>{contacts.location}</p>
          <Link className="footer-contact" href="/kontak/" prefetch={false}>
            Lihat informasi kontak <span aria-hidden="true">↗</span>
          </Link>
          <span className="footer-demo"></span>
        </div>
      </div>
      <div className="container footer-in">
        <span>LPK J.A.T BANJARNEGARA</span>
        <p className="footer-note">

        </p>
      </div>
    </footer>
  );
}
