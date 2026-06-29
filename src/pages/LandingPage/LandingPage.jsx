// src/pages/LandingPage.jsx
import { useEffect, useRef } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import HeroSection from '../../components/LandingPage/HeroSection'
import ParticleCanvas from '../../components/LandingPage/ParticleCanvas'
import TempleEssence from '../../components/LandingPage/TempleEssence'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import './LandingPage.css'
import Navbar from '../../components/NavBar'
import EventCarousel from '../../components/LandingPage/EventCarousel'
import Donation from "../../components/LandingPage/Donation"
import ContactCard from '../../components/LandingPage/ContactCard'
import FoundationCard from '../../components/LandingPage/FoundationCard'
import DarshanSchedule from '../../components/LandingPage/DarshanSchedule'
import TempleGallery from '../../components/LandingPage/TempleGallery'
import VisitSection from '../../components/LandingPage/VisitSection'

gsap.registerPlugin(ScrollTrigger, TextPlugin)
function splitIntoCharSpans(element) {
    // Only split direct text nodes, leave child elements untouched
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    const textNodes = []
    let node
    while ((node = walker.nextNode())) {
      // Skip whitespace-only nodes
      if (node.textContent.trim().length === 0) continue
      textNodes.push(node)
    }

    textNodes.forEach(textNode => {
      const chars = textNode.textContent.split('')
      const fragment = document.createDocumentFragment()
      chars.forEach(char => {
        const span = document.createElement('span')
        span.textContent = char
        span.style.opacity = '0'
        span.style.display = 'inline'
        fragment.appendChild(span)
      })
      textNode.parentNode.replaceChild(fragment, textNode)
    })

    return element.querySelectorAll('span')
  }
export default function LandingPage() {
  usePageTitle('Sri Hayagreeva Perumal Temple, Chivada')
  
  const stageRef = useRef(null)
  const leftTrackRef = useRef(null)
  const deityRef = useRef(null)
  const card3Ref = useRef(null)
  const card3TextRef = useRef(null)
  const foundationRef = useRef(null)
  const card4Ref  = useRef(null)
  const card5Ref  = useRef(null)
  const card4EntriesRef = useRef([])  // for staggered schedule entry animation
  const card6Ref  = useRef(null)
  const card7Ref  = useRef(null)
  const card6ActiveRef = useRef(0)  
  const card8Ref = useRef(null);
  const card9Ref = useRef(null)
  
  useEffect(() => {

    
    const stage = stageRef.current
    if (!stage) return

    // 1. SMOOTH OUT WHEEL INTERACTION JITTER NATIVELY
    // This bypasses the erratic "notches" of standard mousewheels and tracks beautifully.
    ScrollTrigger.normalizeScroll({ 
      allowNestedScroll: true,
      momentum: self => Math.min(2, self) // cap momentum so triggers fire reliably
    })


    // 2. FORCE GSAP TO CACHE ALL PROP CONFIGURATIONS AHEAD OF TIME
    ScrollTrigger.config({ 
      limitCallbacks: true,
      ignoreMobileResize: true,
      syncInterval: 100, // Reduces the time between scroll trigger updates for smoother syncing 
    });
    const el = foundationRef.current
    if (!el) return

    // Split chars — happens once after mount
    const charSpans = splitIntoCharSpans(el)
    

    // Create a clean contextual scope for safe React garbage collection cleanup
    const ctx = gsap.context(() => {
      gsap.to(charSpans, {
        opacity: 1,
        duration: 0.01,        // near-instant per char — adjust for speed
        stagger: 0.006,        // 12ms between each character
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',    // fires when section is 80% into viewport
          once: true,          // only plays once, not on every scroll
        }
      })
      
      ScrollTrigger.create({
        trigger: stageRef.current,
        start: '60% top',       // roughly when Phase 3 completes
        once: true,
        onEnter: () => {
          gsap.to(card4EntriesRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
          })
        }
      })
      gsap.set(card4Ref.current, { rotateX: 90, opacity: 0 })
      gsap.set(card5Ref.current, { rotateX: 90, opacity: 0 })
      gsap.set(card6Ref.current, { rotateX: 90, opacity: 0 })
      gsap.set(card7Ref.current, { rotateY: 90, opacity: 0 })
      gsap.set(card8Ref.current, { rotateY: 90, opacity: 0 })
      gsap.set(card9Ref.current, { rotateY: 90, opacity: 0 })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=1000%',    // Creates a scroll track precisely 2 viewports long
          pin: true,        // Locks the viewport cinema stage in place
          scrub: 2,       // Matches text and canvas shifts smoothly to your scroll speed
          invalidateOnRefresh: true,
        }
      })

      // ── PHASE 1: Move the text column up by 100vh to center Card 2 ──
      tl.to(leftTrackRef.current, {
        y: '-100vh',
        ease: 'none'
      })

      // ── PHASE 2: Lockstep exit of Card 2 & Deity to reveal the background Card 3 ──
      // Both animations run simultaneously using the timeline position parameter ('<=')
      tl.to(leftTrackRef.current, {
        y: '-200vh',
        ease: 'none'
      })
      .to(deityRef.current, {
        y: '-100vh',
        ease: 'none'
      }, '<')
      .to(card3Ref.current, {
        opacity: 1,
        scale: 0.95,
        ease: 'none'
      }, '<')
      .to(card3TextRef.current, {
        y: 0,
        ease: 'power1.out'
      }, '<')
      .to(card3Ref.current, {
        rotateX: -90,
        opacity: 0.6,
        ease: 'power1.in',
      }, '+=0.1')                          // slight pause after Card 3 fully revealed
      .to(card4Ref.current, {
        rotateX: 0,
        opacity: 1,
        ease: 'power1.out',
      }, '<')  
      .to(card4Ref.current, {
        rotateX: -110,
        opacity: 0.6,
        ease: 'power1.in',
      }, '+=0.1')
      .to(card5Ref.current, {
        rotateX: 0,
        opacity: 1,
        ease: 'power1.out',
      }, '<')
      // ── PHASE 5: Card 5 calendar-flips back, Card 6 rises (calendar flip) ──
        .to(card5Ref.current, {
          rotateX: -110,
          opacity: 0.6,
          ease: 'power1.in',
        }, '+=0.1')
        .to(card6Ref.current, {
          rotateX: 0,
          opacity: 1,
          ease: 'power1.out',
        }, '<')

        // ── PHASE 6: Card 6 book-flips away (right center), Card 7 opens in ──
        .to(card6Ref.current, {
          rotateY: -180,
          opacity: 0.6,
          ease: 'power1.in',
          transformOrigin: 'right center',
        }, '+=0.1')
        .to(card7Ref.current, {
          rotateY: 0,
          opacity: 1,
          ease: 'power1.out',
          transformOrigin: 'right center',
        }, '<')
        .to(card7Ref.current, {
          rotateY: -90,
          opacity: 0.6,
          ease: 'power1.in',
          transformOrigin: 'right center',
        }, '+=0.1')
        .to(card8Ref.current, {
          rotateY: 0,
          opacity: 1,
          ease: 'power1.out',
          transformOrigin: 'right center',
        }, '<')
        // ── PHASE 8: Card 8 book-flips away, Card 9 (Contact — back cover) opens ──
        .to(card8Ref.current, {
          rotateY: -90,
          opacity: 0.6,
          ease: 'power1.in',
          transformOrigin: 'right center',
        }, '+=0.1')
        .to(card9Ref.current, {
          rotateY: 0,
          opacity: 1,
          ease: 'power1.out',
          transformOrigin: 'right center',
        }, '<')

    }, stageRef)
    return () => {
      ctx.revert()
      ScrollTrigger.normalizeScroll(false) 
      ScrollTrigger.getAll().forEach(t => t.kill())
    }

  }, [])

  return (
    <main className="landing-master-container hero">
      <Navbar />
      <div ref={stageRef} className="scrolling-cinema-stage">
        
        {/* PANEL A: Left Content Track */}
        <div ref={leftTrackRef} className="left-content-track">
          <section className="deck-card">
            <HeroSection />
          </section>
          <TempleEssence /> {/* Card 2: Now matches deck-card layout metrics */}
        </div>

        {/* PANEL B: Moving Deity Canvas Stage */}
        <div ref={deityRef} className="moving-deity-stage">
          {/* We pass a null or simple reference here; the movement is driven directly above */}
          <ParticleCanvas heroRef={null} />
        </div>

        {/* PANEL C: Perspective Background Card */}
        <section
          ref={card3Ref}
          className="perspective-background-card"
          style={{ transform: 'scale(0.85)' }} /* Keeps the deep 3D layer perspective spacing */
        >
          <FoundationCard card3TextRef={card3TextRef} foundationRef={foundationRef} />
        </section>

        {/* PANEL D: Card 4 — Temple Schedule */}
        <section ref={card4Ref} className="card-4">
          <DarshanSchedule card4EntriesRef={card4EntriesRef} />
        </section>

        {/* PANEL E: Card 5 — Temple Visuals Teaser */}
        <section ref={card5Ref} className="card-5">
          <TempleGallery />
        </section>
        {/* PANEL F: Card 6 — Events Carousel */}
        <section ref={card6Ref} className="card-6">
          <EventCarousel />
        </section>
        {/* PANEL G: Card 7 — Location + Review */}
        <section ref={card7Ref} className="card-7">
          <VisitSection />
        </section>
        <section ref={card8Ref} className="card-8">
          <Donation />
        </section>
        {/* PANEL I: Card 9 — Contact (Back Cover) */}
        <section ref={card9Ref} className="card-9">
          <ContactCard />
        </section>
        



        

      </div>
    </main>
  )
}