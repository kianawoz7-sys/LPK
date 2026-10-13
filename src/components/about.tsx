import Link from "next/link";
import { Photo } from "@/components/photo";

export function About() {
  return (
    <section
      className="section about"
      id="tentang"
      aria-labelledby="about-title"
    >
      <div className="container about-grid">
        <div>
          <div className="kicker">Tentang Kami</div>
          <h2 id="about-title">
            LPK J.A.T
            <br />
            Banjarnegara.
          </h2>
          <p>
            Pelatihan bahasa Jepang dan pendampingan karier menuju Jepang.
          </p>
          <Link className="text-link" href="/tentang/" prefetch={false}>
            Kenali LPK J.A.T <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="about-media">
          <Photo image="classroom" />
        </div>
      </div>
    </section>
  );
}
