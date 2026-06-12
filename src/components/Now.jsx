const NOW = [
  {
    title: 'Second Brain',
    desc: 'The memory. Every decision, document, and learning a company produces — structured, versioned, queryable by agents.',
  },
  {
    title: 'Mission Control',
    desc: 'The hands. A control plane where agents with full business context execute real work — not chat, operations.',
  },
  {
    title: 'Built in public',
    desc: 'Every system documented as it gets built. Not a polished tutorial — the real thing, mistakes included.',
  },
]

export default function Now() {
  return (
    <section className="section" id="now">
      <div className="sec-head" data-reveal>
        <span className="sec-label"><b>01</b>The Agent OS</span>
        <span className="sec-note">what I'm building</span>
      </div>

      <div className="now-grid" data-reveal>
        {NOW.map((item, i) => (
          <div className="now-cell" key={item.title}>
            <span className="now-cell-index">{String(i + 1).padStart(2, '0')} /</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
