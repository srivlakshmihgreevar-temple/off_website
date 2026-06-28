// src/pages/Darshan.jsx
import { usePageTitle } from '../hooks/usePageTitle'
import Navbar from '../components/NavBar'
import '../pages/LandingPage/LandingPage.css'

export default function Darshan() {
  usePageTitle('Darshan — Sri Hayagreeva Perumal Temple')
  return (
    <main className="landing-master-container hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <Navbar />
      <p className="hero-eyebrow" style={{ marginTop: 'var(--navbar-h)' }}>Daily Timings</p>
      <h1 className="essence-title">Darshan Schedule</h1>
      <div className="hero-rule" />
      <p style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--white-dim)', fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', maxWidth: '540px', textAlign: 'center', lineHeight: 1.8 }}>
        Full darshan timings, special seva schedules, and puja registration will be available here.
      </p>
    </main>
  )
}
