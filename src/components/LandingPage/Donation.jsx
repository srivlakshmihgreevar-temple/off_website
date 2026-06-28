// src/components/LandingPage/DonationCard.jsx
import './Donation.css'

export default function Donation() {
  return (
    <>
      {/* Header — spans full width */}
      <div className="card-8-header">
        <p className="hero-eyebrow">An Offering to the Divine</p>
        <h2 className="essence-title card-8-title">Support the Temple</h2>
        <div className="hero-rule" style={{ margin: '0.8rem auto 0 auto' }} />
      </div>

      <div className="card-8-body">

        {/* ── Left — Causes ── */}
        <div className="card-8-causes">

          {/* Gho Shala */}
          <div className="cause-block">
            <div className="cause-icon" aria-hidden="true">🐄</div>
            <div className="cause-text">
              <p className="hero-eyebrow cause-eyebrow">Gho Seva</p>
              <h3 className="cause-title">Gho Shala</h3>
              <p className="cause-subtitle">16 cows under our care</p>
              <p className="cause-desc">
                The cow is sacred to the Lord. Supporting the Gho Shala ensures
                their daily nourishment, medical care, and a life of dignity in
                the temple's service.
              </p>
            </div>
            <a href="#" className="hero-cta cause-cta">
              Offer Seva
              <span className="hero-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <div className="cause-divider" />

          {/* Anna Dhanam */}
          <div className="cause-block">
            <div className="cause-icon" aria-hidden="true">🍱</div>
            <div className="cause-text">
              <p className="hero-eyebrow cause-eyebrow">Anna Seva</p>
              <h3 className="cause-title">Nithya Anna Dhanam</h3>
              <p className="cause-subtitle">Daily free meals served</p>
              <p className="cause-desc">
                Feeding the hungry is feeding the Lord Himself. Your contribution
                sustains the daily free meal offered to devotees and the needy
                at the temple.
              </p>
            </div>
            <a href="#" className="hero-cta cause-cta">
              Offer Seva
              <span className="hero-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>

        </div>

        {/* ── Vertical separator ── */}
        <div className="card-8-separator">
          <div className="card-8-sep-line" />
          <span className="card-8-sep-ornament" aria-hidden="true">✦</span>
          <div className="card-8-sep-line" />
        </div>

        {/* ── Right — Monthly Subscription ── */}
        <div className="card-8-subscription">
          <div className="subscription-inner">

            <p className="hero-eyebrow" style={{ textAlign: 'center' }}>
              Become a Monthly Patron
            </p>

            <h3 className="subscription-deity-name">
              Sri Vidhya Lakshmi Samedha<br />Hayagreeva Perumal
            </h3>

            <div className="hero-rule" style={{ margin: '0.8rem auto' }} />

            {/* Amount */}
            <div className="subscription-amount-block">
              <span className="subscription-currency">₹</span>
              <span className="subscription-amount">250</span>
              <span className="subscription-frequency">/ month</span>
            </div>

            {/* Benefits */}
            <ul className="subscription-benefits">
              <li className="subscription-benefit-item">
                <span className="benefit-dot" aria-hidden="true" />
                <span>Monthly <strong>Prasadam</strong> delivered via Speed Post</span>
              </li>
              <li className="subscription-benefit-item">
                <span className="benefit-dot" aria-hidden="true" />
                <span>Exclusive <strong>Deity photo card</strong> every month</span>
              </li>
              <li className="subscription-benefit-item">
                <span className="benefit-dot" aria-hidden="true" />
                <span>Your name offered in <strong>Nitya Aaraadhanam</strong></span>
              </li>
            </ul>

            {/* Subscribe CTA */}
            <a href="#" className="subscription-cta kumkuma-btn">
              <span className="kumkuma-btn-dot" aria-hidden="true" />
              Subscribe · UPI Autopay
            </a>

            <p className="subscription-fine-print">
              One-time setup &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Secure UPI
            </p>

          </div>
        </div>

      </div>
    </>
  )
}