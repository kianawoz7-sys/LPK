import { Photo } from "@/components/photo";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-in">
        <div className="hero-copy">
          <div className="eyebrow micro">LPK J.A.T · BANJARNEGARA</div>
          <h1 id="hero-title">
            LANGKAH
            <br />
            BARU MENUJU
            <br />
            <em>JEPANG.</em>
          </h1>
          <p className="hero-desc">
            Pelatihan bahasa Jepang dan pendampingan karier untuk kamu yang
            ingin mempersiapkan masa depan di Jepang.
          </p>
          <div className="hero-note">
            BAHASA · KETERAMPILAN · PERSIAPAN KARIER
          </div>
        </div>
        <div className="hero-art">
          <Photo image="city" className="hero-city" priority />
          <Photo image="classroom" className="hero-classroom" />
          <div className="hero-stamp">BELAJAR. SIAPKAN. MELANGKAH.</div>
        </div>
      </div>
    </section>
  );
}
