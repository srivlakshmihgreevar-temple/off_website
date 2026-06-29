// src/components/LandingPage/Donation.jsx
import './Donation.css'
import { useEffect, useRef } from 'react'

export default function Donation() {
  const letterRef = useRef(null)
  const wrapRef   = useRef(null)

  useEffect(() => {
  const letter = letterRef.current
  const wrap   = wrapRef.current
  if (!letter || !wrap) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return

      // Wait a beat after the card flips in, then scroll slowly
      setTimeout(() => {
        const targetY = letter.scrollHeight - letter.clientHeight
        const duration = 3000          // 3s — slow, deliberate read
        const start    = letter.scrollTop
        const startTime = performance.now()

        const step = (now) => {
          const elapsed  = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          // ease-in-out cubic
          const ease = progress < 0.5
            ? 4 * progress ** 3
            : 1 - (-2 * progress + 2) ** 3 / 2

          letter.scrollTop = start + (targetY - start) * ease
          letter.style.overflowY='auto'
          if (progress < 1) requestAnimationFrame(step)
        }

        requestAnimationFrame(step)
      }, 800)             // 800ms delay after card appears
    },
    { threshold: 0.6 }   // fires when 60% of the wrap is visible
  )

  observer.observe(wrap)
  return () => observer.disconnect()
}, [])

  return (
    <div className="donation-letter-wrap" ref={wrapRef}>

      {/* ══ LETTER BODY ══════════════════════════════════════════ */}
      <div className="donation-letter" ref={letterRef}>

        {/* Parchment header */}
        <div className="letter-header">
          <p className="letter-pre-title">A Message from the Temple</p>
          <div className="letter-header-rule" />
        </div>

        {/* Salutation */}
        <p className="letter-salutation">Dear Devotee,</p>

        {/* Opening */}
        <p className="letter-body">
          What stands before you today is not merely a temple — it is a divine
          command fulfilled. Sri Lakshmi Hayagreeva Perumal Himself appeared in
          a dream, chose this sacred land, and guided every stone laid in His
          service. This place exists because of grace, and it continues because
          of devotion — yours and ours together.
        </p>

        {/* Cause 1 */}
        <div className="letter-cause">
          <div className="letter-cause-head">
            <span className="letter-cause-icon">🐄</span>
            <div>
              <p className="letter-cause-kicker">Gho Seva</p>
              <h3 className="letter-cause-title">The Gho Shala</h3>
            </div>
          </div>
          <p className="letter-body">
            Within these temple walls, 16 cows live — fed, sheltered, and
            honoured every single day. The cow is inseparable from the Lord's
            grace. Caring for them is not charity; it is worship. Every
            mouthful they eat, every day they are healthy, is an act of
            devotion offered at His feet.
          </p>
          <div className="letter-cause-stat">
            <span>16 cows</span>
            <span className="stat-sep">·</span>
            <span>Daily nourishment</span>
            <span className="stat-sep">·</span>
            <span>Part of Nitya Pooja</span>
          </div>
        </div>

        {/* Cause divider */}
        <div className="letter-cause-divider" />

        {/* Cause 2 */}
        <div className="letter-cause">
          <div className="letter-cause-head">
            <span className="letter-cause-icon">🍱</span>
            <div>
              <p className="letter-cause-kicker">Anna Seva</p>
              <h3 className="letter-cause-title">Nithya Anna Dhanam</h3>
            </div>
          </div>
          <p className="letter-body">
            Every day — without exception — free meals are prepared and
            offered to all who arrive at this temple. To feed a hungry soul
            is to place food before the Lord Himself. This tradition must
            never stop. Your support ensures it never will.
          </p>
          <div className="letter-cause-stat">
            <span>Served every day</span>
            <span className="stat-sep">·</span>
            <span>Free for all</span>
            <span className="stat-sep">·</span>
            <span>No exceptions</span>
          </div>
        </div>

        {/* Common donate CTA */}
        <div className="letter-donate-wrap">
          <a href="#" className="letter-donate-btn">
            ✦ &nbsp; Make an Offering
            <span className="letter-donate-arrow" aria-hidden="true">→</span>
          </a>
        </div>

      </div>

      {/* ══ VERTICAL SPINE ═══════════════════════════════════════ */}
      <div className="donation-spine">
        <div className="spine-line" />
        <span className="spine-ornament">✦</span>
        <div className="spine-line" />
      </div>

      {/* ══ SUBSCRIPTION PANEL ═══════════════════════════════════ */}
      <div className="donation-subscription">
        <div className="subscription-panel">

          {/* Seal-like header */}
          <div className="sub-seal">
            <div className="sub-seal-ring">
              <p className="sub-seal-top">Monthly Patron</p>
              <p className="sub-seal-deity">Sri Vidhya Lakshmi Samedha</p>
              <p className="sub-seal-deity accent">Hayagreeva Perumal</p>
              <div className="sub-seal-divider" />
              <div className="sub-amount-row">
                <span className="sub-currency">₹</span>
                <span className="sub-amount">250</span>
                <span className="sub-per">/ mo</span>
              </div>
            </div>
          </div>

          {/* Letter to patron */}
          <p className="sub-letter">
            Join us as a monthly patron. Your presence — however distant —
            will be felt within the sanctum every single day. Each month
            we will bring the Lord's blessings to your door.
          </p>
          {/* Subscribe CTA — the most important button */}
          <a href="#" className="sub-cta kumkuma-btn">
            <span className="kumkuma-btn-dot" aria-hidden="true" />
            Begin Your Patronage
          </a>
          {/* Benefits — scripture style */}
          <ul className="sub-benefits">
            <li className="sub-benefit">
              Monthly <strong>Prasadam</strong> via Speed Post
            </li>
            <li className="sub-benefit">
              Exclusive <strong>Deity photo card</strong> each month
            </li>
            <li className="sub-benefit">
              Your name in <strong>Nitya Aaraadhanam</strong> every day
            </li>
          </ul>

          

          <p className="sub-fine-print">
            One-time UPI Autopay setup &nbsp;·&nbsp; Cancel anytime
          </p>

        </div>
      </div>

    </div>
  )
}