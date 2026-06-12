export default function Footer() {
  return (
    <footer className="section footer" id="contact">
      <h2 className="footer-headline" data-reveal>
        Want agents that actually <em>know your business</em>?
      </h2>

      <div data-reveal>
        <a href="mailto:angeles.michalis@gmail.com" className="footer-email">
          angeles.michalis@gmail.com
        </a>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Michael Angeles</span>
        <div className="footer-bottom-links">
          <a href="https://github.com/michangelis" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/michael-angeles-a6327923a" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <span>Athens → London</span>
      </div>
    </footer>
  )
}
