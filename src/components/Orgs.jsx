import { useState } from 'react'

const PIPELINE = ['intake', 'security', 'translation', 'intent', 'extraction', 'notes', 'audit']

function Journey({ steps }) {
  return (
    <div className="journey">
      {steps.map((s, i) => (
        <div
          className={`j-step${s.kind ? ` j-step--${s.kind}` : ''}`}
          style={{ '--i': i }}
          key={s.title}
        >
          <div className="j-date">{s.date}</div>
          <div className="j-title">{s.title}</div>
          <p className="j-desc">{s.desc}</p>
        </div>
      ))}
    </div>
  )
}

function AiLabPanel() {
  return (
    <div className="org-panel" key="ailab">
      <div className="org-head">
        <h3 className="org-title">
          The founders scouted me to <em>build their AI lab</em>.
        </h3>
        <div className="org-meta">
          2025–26<br />
          <span className="role">Architect / Owner</span>
        </div>
      </div>
      <p className="org-intro">
        After the IBM win, Hellas Direct's founders asked me to run AI at an
        insurer with <strong>500k+ customers</strong>. I owned the whole loop —
        architecture, code, deployment, then product ownership of what I
        shipped.
      </p>
      <div className="org-badges">
        <span className="badge">★ Digital Finance Awards 2026 — Winner</span>
        <span className="badge--ok badge">in production today</span>
      </div>

      <div className="pipeline-block">
        <div className="pipeline-label">
          <span>claims automation — 7-agent pipeline</span>
          <span className="live">live</span>
        </div>
        <div className="pipe" aria-label="Pipeline stages">
          {PIPELINE.map((step, i) => (
            <span key={step} style={{ display: 'contents' }}>
              <span className="pipe-node" style={{ '--i': i }}>{step}</span>
              {i < PIPELINE.length - 1 && <span className="pipe-arrow">→</span>}
            </span>
          ))}
        </div>
        <div className="pipe-stats">
          <span><b>2,000+</b> real claims processed</span>
          <span><b>25 min → 5 min</b> per claim</span>
          <span><b>99%</b> F1 score</span>
        </div>
      </div>

      <div className="proj-grid">
        <div className="proj-cell">
          <h4>MCP Server</h4>
          <p>
            The claims product, exposed as a tool layer for any LLM.{' '}
            <strong>Their single biggest competitive advantage</strong> — made
            callable.
          </p>
          <div className="proj-tags">MCP / FastAPI / Python</div>
        </div>
        <div className="proj-cell">
          <h4>Custom OCR Engine</h4>
          <p>
            Classifier identifies the document, a fine-tuned extractor per type
            pulls structured data. <strong>Any document the business receives.</strong>
          </p>
          <div className="proj-tags">GCP Document AI / fine-tuning</div>
        </div>
        <div className="proj-cell">
          <h4>WhatsApp RAG Assistant</h4>
          <p>
            Customer-facing assistant answering on the channel Greeks actually
            use. <strong>Separate system, also in production.</strong>
          </p>
          <div className="proj-tags">AWS Bedrock / Lambda / DynamoDB</div>
        </div>
      </div>

      <div className="org-foot">
        <span>Python / Pydantic AI / GPT-4o / GCP / Kubernetes</span>
        <span>ran in parallel with a full-time consulting role — both delivered</span>
      </div>
    </div>
  )
}

function MedivaPanel() {
  return (
    <div className="org-panel" key="mediva">
      <div className="org-head">
        <h3 className="org-title">
          From a basement to <em>Columbia University</em>.
        </h3>
        <div className="org-meta">
          2023–26<br />
          <span className="role">Co-founder</span>
        </div>
      </div>
      <p className="org-intro">
        Mediva-RX started as a hackathon hack and got pushed as far as a
        student venture can go: <strong>national win, a filed patent, a real
        market pivot, and a finalist seat at Columbia</strong>.
      </p>
      <div className="org-badges">
        <span className="badge">national winner</span>
        <span className="badge">patent filed</span>
        <span className="badge">Columbia finalist 2026</span>
      </div>

      <Journey
        steps={[
          {
            date: '2023 — the build',
            title: 'Built in a basement, in a month',
            desc: 'Smart pill dispenser with Face ID — TensorFlow and OpenCV on real hardware, made for a hackathon deadline.',
          },
          {
            date: '2023 — the win',
            kind: 'win',
            title: '1st place, PreSfhmmy national competition',
            desc: 'The hack became a venture. We stopped treating it as a project.',
          },
          {
            date: '2024',
            kind: 'hit',
            title: 'Patent filed',
            desc: 'Protected the core mechanism before talking to the market.',
          },
          {
            date: '2024–25 — the discovery',
            title: '70+ customer interviews',
            desc: 'Pharma and elder care. The consumer product everyone liked wasn’t the business.',
          },
          {
            date: '2025 — the pivot',
            kind: 'hit',
            title: 'Consumer gadget → Type 2a medical device',
            desc: 'Repositioned for decentralized clinical trials — running stages I and II at home. A market that pays.',
          },
          {
            date: '2026',
            kind: 'win',
            title: 'Columbia University finalist',
            desc: 'Lab 2 Market, NTUA × Columbia. Presented in New York, June 2026.',
          },
        ]}
      />

      <div className="org-foot">
        <span>TensorFlow / OpenCV / React / Django</span>
        <span>the tech served the business — never the other way around</span>
      </div>
    </div>
  )
}

function UniaiPanel() {
  return (
    <div className="org-panel" key="uniai">
      <div className="org-head">
        <h3 className="org-title">
          A weekend hack that became <em>a job offer from founders</em>.
        </h3>
        <div className="org-meta">
          2024<br />
          <span className="role">ML / Lead</span>
        </div>
      </div>
      <p className="org-intro">
        The UNIAI × IBM challenge is the clearest version of how I operate:{' '}
        <strong>ship something real fast, then let the room escalate it</strong>.
      </p>
      <div className="org-badges">
        <span className="badge">1st place — IBM challenge</span>
        <span className="badge">IBM summit stage</span>
      </div>

      <Journey
        steps={[
          {
            date: 'may 2024 — 48 hours',
            title: 'ML taxi allocation for Chicago O’Hare',
            desc: 'Model predicting aircraft delays by type, airline, time, and destination — driving dynamic taxi dispatch.',
          },
          {
            date: 'the win',
            kind: 'win',
            title: '1st place',
            desc: 'IBM’s Chief AI Officer invited the team to present the work.',
          },
          {
            date: 'the stage',
            kind: 'hit',
            title: 'IBM Greece & Cyprus quarterly summit',
            desc: 'CEO Marios Maniatis handed me the mic in front of the whole company.',
          },
          {
            date: 'the consequence',
            kind: 'win',
            title: 'Scouted to run an AI lab',
            desc: 'Hellas Direct’s founders saw it and asked me to build their AI lab. The demo was the pitch; the pitch became the job.',
          },
        ]}
      />

      <div className="org-foot">
        <span>Python / logistic regression / IBM Cloud</span>
        <span>won as a student, hired as an architect</span>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'ailab', kind: 'AI Lab', label: 'Hellas Direct', Panel: AiLabPanel },
  { id: 'mediva', kind: 'Venture', label: 'Mediva-RX', Panel: MedivaPanel },
  { id: 'uniai', kind: 'Hackathon', label: 'UNIAI × IBM', Panel: UniaiPanel },
]

export default function Orgs() {
  const [active, setActive] = useState('ailab')
  const { Panel } = TABS.find((t) => t.id === active)

  return (
    <section className="section" id="work">
      <div className="sec-head" data-reveal>
        <span className="sec-label"><b>02</b>Track Record</span>
        <span className="sec-note">every project was a business</span>
      </div>

      <div data-reveal>
        <div className="org-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              className="org-tab"
              onClick={() => setActive(t.id)}
            >
              <span className="org-tab-kind">{t.kind}</span>
              {t.label}
            </button>
          ))}
        </div>
        <Panel key={active} />
      </div>
    </section>
  )
}
