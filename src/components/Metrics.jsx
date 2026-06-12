const METRICS = [
  { value: '2,000+', label: 'production claims processed' },
  { value: '25→5', unit: 'min', label: 'per claim, automated' },
  { value: '99', unit: '%', label: 'F1 score in production' },
  { value: '2×', label: 'national hackathon wins' },
  { value: '1', unit: ' patent', label: 'filed — medical device' },
]

export default function Metrics() {
  return (
    <div className="metrics">
      {METRICS.map((m) => (
        <div className="metric" key={m.label} data-reveal>
          <div className="metric-value">
            {m.value}
            {m.unit && <span className="unit">{m.unit}</span>}
          </div>
          <div className="metric-label">{m.label}</div>
        </div>
      ))}
    </div>
  )
}
