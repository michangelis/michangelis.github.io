import Header from './components/Header'
import Hero from './components/Hero'
import Metrics from './components/Metrics'
import Now from './components/Now'
import Orgs from './components/Orgs'
import Stack from './components/Stack'
import Footer from './components/Footer'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <Header />
      <div className="frame">
        <main>
          <Hero />
          <Metrics />
          <Now />
          <Orgs />
          <Stack />
        </main>
        <Footer />
      </div>
    </>
  )
}
