// src/components/HeroSection.jsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './HeroSection.css'

export default function HeroSection() {
  const leftRef  = useRef(null)
  const lineRef  = useRef(null)
  const ctaRef   = useRef(null)
  const eyebrowRef   = useRef(null)
  const titleLinesRef = useRef([])   
  const taglineRef   = useRef(null)
  const taglineEnRef = useRef(null)

  useEffect(() => {
    if (
      !leftRef.current || !lineRef.current || !ctaRef.current || 
      !eyebrowRef.current || !taglineRef.current
    ) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      tl.from(eyebrowRef.current, {
        opacity: 0, y: 16, duration: 0.7, ease: 'power2.out',
      })
      .from(titleLinesRef.current.filter(Boolean), {
        opacity: 0, y: 40, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      }, '-=0.4')
      .from(lineRef.current, {
        scaleX: 0, transformOrigin: 'left center', // Animates from left out
        duration: 0.7, ease: 'power2.inOut',
      }, '-=0.4')
      .from(taglineRef.current, {
        opacity: 0, y: 12, duration: 0.6, ease: 'power2.out',
      }, '-=0.3')
      .from(taglineEnRef.current, {
        opacity: 0, y: 8, duration: 0.5, ease: 'power2.out',
      }, '-=0.4')
      .from(ctaRef.current, {
        opacity: 0, y: 16, duration: 0.6, ease: 'power2.out',
      }, '-=0.3')
    })

    return () => ctx.revert()
  }, [])

  const setTitleRef = (el, i) => { titleLinesRef.current[i] = el }

  return (
    <div className="hero-left" ref={leftRef}>
      

      <h1 className="hero-title">
        <span className="hero-title-tamil"  ref={el => setTitleRef(el, 0)}>ஸ்ரீவித்யாலக்ஷ்மி</span>
        <span className="hero-title-tamil"  ref={el => setTitleRef(el, 1)}>ஹயக்ரீவர்</span>
        <span className="hero-title-english" ref={el => setTitleRef(el, 2)}>Hayagriva Perumal</span>
        <span className="hero-title-location" ref={el => setTitleRef(el, 3)}>Chivada, Tamil Nadu</span>
      </h1>

      <div className="hero-rule" ref={lineRef} />

      <p className="hero-tagline"    ref={taglineRef}>ஞானம் பரமம் பலம்</p>
      <p className="hero-tagline-en" ref={taglineEnRef}>"Knowledge is the highest power"</p>

      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="#C9A227" strokeWidth="1.2"/>
          <rect x="6.5" y="5" width="3" height="6" rx="1.5" fill="#C9A227">
            <animate attributeName="y" values="5;11;5" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite"/>
          </rect>
        </svg>
      </div>
      <a href="/login" className="hero-cta" ref={ctaRef}>
        Enter the Sanctum
        <span className="hero-cta-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  )
}