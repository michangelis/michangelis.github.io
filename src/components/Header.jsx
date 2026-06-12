import { useEffect, useState } from 'react'

function AthensClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Athens',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return <span className="header-clock">ATH {time}</span>
}

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="#top" className="header-name">
          michael.angeles<span>_</span>
        </a>
        <div className="header-meta">
          <AthensClock />
          <nav className="header-links">
            <a href="https://github.com/michangelis" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/michael-angeles-a6327923a" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:angeles.michalis@gmail.com">Email</a>
          </nav>
        </div>
      </div>
    </header>
  )
}
