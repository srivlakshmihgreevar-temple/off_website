// src/pages/Donate.jsx
import { usePageTitle } from '../hooks/usePageTitle'
import Navbar from '../components/NavBar'
import Donation from '../components/LandingPage/Donation'
import '../pages/LandingPage/LandingPage.css'

export default function Donate() {
  usePageTitle('Donate — Sri Hayagreeva Perumal Temple')
  return (
    <main className="landing-master-container hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--navbar-h) 2rem 3rem' }}>
      <Navbar />
      <Donation />
    </main>
  )
}
