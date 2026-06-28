// src/pages/Visit.jsx
import { usePageTitle } from '../hooks/usePageTitle'
import Navbar from '../components/NavBar'
import MapComponent from '../components/LandingPage/MapComponent'
import '../pages/LandingPage/LandingPage.css'

export default function Visit() {
  usePageTitle('Visit Us — Sri Hayagreeva Perumal Temple')
  return (
    <main className="landing-master-container hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '0 2rem 3rem' }}>
      <Navbar />
      <p className="hero-eyebrow" style={{ marginTop: 'var(--navbar-h)' }}>Find Us</p>
      <h1 className="essence-title">Visit the Temple</h1>
      <div className="hero-rule" />
      <div style={{ width: '100%', maxWidth: '760px' }}>
        <MapComponent qrSrc={null} />
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--white-dim)', fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', maxWidth: '540px', textAlign: 'center', lineHeight: 1.8 }}>
        Sri Hayagreeva Perumal Temple, Chivada. Directions, transport options, and nearby landmarks will be available here.
      </p>
    </main>
  )
}
