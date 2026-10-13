import { steps } from "@/lib/content";

export function Steps() {
  return (
    <section className="section steps" id="alur" aria-labelledby="steps-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker">03 / MULAI DARI SINI</div>
            <h2 id="steps-title">
              Mudah memulai.
              <br />
              Jelas langkahnya.
            </h2>
          </div>
          <p>
            Tertarik ikut program? Awali dengan menghubungi admin dan cari tahu
            informasi yang relevan dengan tujuanmu.
          </p>
        </div>
        <ol className="step-grid">
          {steps.map((step) => (
            <li className="step" key={step.number}>
              <span className="step-num">STEP / {step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
        <p className="step-disclaimer">
          * Ini adalah gambaran alur konsultasi, bukan prosedur resmi yang sudah
          diverifikasi.
        </p>
      </div>
    </section>
  );
}
