export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg" aria-hidden="true" />

      <div className="hero-eyebrow" data-reveal>
        <span>Michael Angeles</span>
        <span className="sep">/</span>
        <span>Founder & Engineer</span>
        <span className="sep">/</span>
        <span>Athens, Greece</span>
      </div>

      <h1 data-reveal>
        Building the <em>agent OS</em><br />
        for business.
      </h1>

      <p className="hero-sub" data-reveal>
        A second brain and mission control for companies —{' '}
        <strong>agents with full memory of your business, executing real work</strong>.
        Not a thesis: I ran an AI lab where my multi-agent systems processed
        2,000+ real insurance claims in production.
      </p>

      <div data-reveal>
        <div className="hero-status">
          <span className="dot" />
          building independently — open to the right people
        </div>
      </div>

      <div className="hero-ctas" data-reveal>
        <a href="mailto:angeles.michalis@gmail.com" className="btn btn--solid">
          get in touch →
        </a>
        <a href="https://github.com/michangelis" target="_blank" rel="noopener noreferrer" className="btn">
          github ↗
        </a>
        <a href="#work" className="btn">
          track record ↓
        </a>
      </div>
    </section>
  )
}
