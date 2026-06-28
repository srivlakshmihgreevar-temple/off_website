// src/components/LandingPage/ContactCard.jsx
import './ContactCard.css'

export default function ContactCard() {
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = {
      name:    e.target.name.value,
      email:   e.target.email.value,
      phone:   e.target.phone.value,
      message: e.target.message.value,
    }
    console.log('Contact form submission:', formData)
  }

  return (
    <div className="contact-inner">

      {/* ── Left — Temple details ── */}
      <div className="contact-left">

        <div className="contact-identity">
          <p className="contact-tamil-name">ஸ்ரீவித்யாலக்ஷ்மி ஹயக்ரீவர்</p>
          <h2 className="contact-english-name">
            Sri Vidhya Lakshmi Samedha<br />Hayagreeva Perumal Temple
          </h2>
          <div className="contact-rule" />
          <p className="contact-location-tag">Chivada, Tamil Nadu</p>
        </div>

        <ul className="contact-details">
          <li className="contact-detail-item">
            <span className="contact-detail-icon">📍</span>
            <span>
              Chivada Village, [Taluk],<br />
              Tamil Nadu – [PIN CODE]
            </span>
          </li>
          <li className="contact-detail-item">
            <span className="contact-detail-icon">📞</span>
            <a href="tel:+910000000000" className="contact-detail-link">
              +91 00000 00000
            </a>
          </li>
          <li className="contact-detail-item">
            <span className="contact-detail-icon">✉</span>
            <a href="mailto:info@hayagreevatemple.org" className="contact-detail-link">
              info@hayagreevatemple.org
            </a>
          </li>
        </ul>

        <div className="contact-hours">
          <p className="contact-hours-label">Temple Hours</p>
          <div className="contact-hours-row">
            <span>Morning</span>
            <span>8:00 AM – 12:00 PM</span>
          </div>
          <div className="contact-hours-row">
            <span>Evening</span>
            <span>4:00 PM – 7:00 PM</span>
          </div>
        </div>

        {/* Colophon — like a book's last page */}
        <div className="contact-colophon">
          <div className="contact-colophon-rule" />
          <p>Est. 2022 · Subhakrutu Year</p>
          <p>Built with devotion 🙏</p>
        </div>

      </div>

      {/* ── Vertical separator ── */}
      <div className="contact-separator">
        <div className="contact-sep-line" />
        <span className="contact-sep-ornament">✦</span>
        <div className="contact-sep-line" />
      </div>

      {/* ── Right — Contact form ── */}
      <div className="contact-right">
        <p className="contact-form-eyebrow">Get in Touch</p>
        <h3 className="contact-form-heading">Write to Us</h3>
        <div className="contact-rule" />

        <form className="contact-form" onSubmit={handleSubmit} noValidate>

          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-name">
              Your Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              className="contact-input"
              placeholder="As it should appear in our records"
              required
            />
          </div>

          <div className="contact-field-row">
            <div className="contact-field">
              <label className="contact-label" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className="contact-input"
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="contact-phone">
                Phone <span className="contact-optional">(optional)</span>
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                className="contact-input"
                placeholder="+91 00000 00000"
              />
            </div>
          </div>

          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              className="contact-input contact-textarea"
              placeholder="Your words to the temple..."
              rows={4}
              required
            />
          </div>

          <button type="submit" className="contact-submit">
            Send Message
            <span className="contact-submit-arrow" aria-hidden="true">→</span>
          </button>

        </form>
      </div>

    </div>
  )
}