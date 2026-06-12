const STACK = [
  ['Languages', 'Python · TypeScript · Java · JavaScript · SQL'],
  ['Agentic', 'Pydantic AI · LangChain · Google ADK · MCP — all in production'],
  ['Infra', 'AWS · GCP · Azure · Docker · Kubernetes · Terraform'],
  ['Data', 'PostgreSQL · Redis · Neo4j · Apache Spark'],
  ['AI / ML', 'RAG pipelines · fine-tuned Document AI · TensorFlow · OpenCV'],
]

export default function Stack() {
  return (
    <section className="section" id="stack">
      <div className="sec-head" data-reveal>
        <span className="sec-label"><b>03</b>Stack</span>
      </div>

      <div className="stack-rows" data-reveal>
        {STACK.map(([key, val]) => (
          <div className="stack-row" key={key}>
            <span className="stack-key">{key}</span>
            <span className="stack-val">{val}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
