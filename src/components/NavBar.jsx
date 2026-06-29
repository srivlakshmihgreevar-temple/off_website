// src/components/Navbar.jsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocation } from 'react-router-dom'
import './NavBar.css'

export default function Navbar() {
  const navRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    // Start hidden above viewport
    gsap.set(nav, { yPercent: -100, opacity: 0 })

    const isLandingPage = location.pathname === '/'

    if (isLandingPage) {
      // Landing page: reveal navbar only after the cinematic scroll intro (Card 2 visible).
      const trigger = ScrollTrigger.create({
        trigger: '.scrolling-cinema-stage',
        start: 'top top',
        end: '+=200%',
        onUpdate: (self) => {
          console.log(self.progress)
          if (self.progress >= 0.48) {
            gsap.to(nav, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
          } else {
            gsap.to(nav, { yPercent: -100, opacity: 0, duration: 0.4, ease: 'power2.in' })
          }
        }
      })
      return () => trigger.kill()
    } else {
      // All other pages: slide in immediately on mount.
      gsap.to(nav, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'power2.out', delay: 0.1 })
    }
  }, [location.pathname])

  return (
    <nav ref={navRef} className="site-navbar" aria-label="Site navigation">
      <div className="navbar-brand">
        <span className="navbar-brand-tamil">ஸ்ரீ ஹயக்ரீவர்</span>
        <span className="navbar-brand-divider" aria-hidden="true" />
        <span className="navbar-brand-english">Hayagriva Perumal</span>
      </div>
      <ul className="navbar-links" role="list">
        <li><a href="/darshan" className={`navbar-link${location.pathname === '/darshan' ? ' navbar-link--active' : ''}`}>Darshan</a></li>
        <li><a href="/events"  className={`navbar-link${location.pathname === '/events'  ? ' navbar-link--active' : ''}`}>Events</a></li>
        <li><a href="/gallery" className={`navbar-link${location.pathname === '/gallery' ? ' navbar-link--active' : ''}`}>Gallery</a></li>
        <li><a href="/visit"   className={`navbar-link${location.pathname === '/visit'   ? ' navbar-link--active' : ''}`}>Visit Us</a></li>
        <li><a href="/archana" className={`navbar-link${location.pathname === '/archana' ? ' navbar-link--active' : ''}`}>Archana</a></li>
      </ul>
      <a href="/donate" className={`navbar-cta${location.pathname === '/donate' ? ' navbar-cta--active' : ''}`}>
        Donate
        <span className="navbar-cta-arrow" aria-hidden="true">→</span>
      </a>
    </nav>
  )
}