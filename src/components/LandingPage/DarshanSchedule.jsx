// src/components/LandingPage/DarshanSchedule.jsx

const morningSlots = [
  { time: '8:00 AM',  tamil: 'விஸ்வரூப தர்சனம்', english: 'Vishwaroopa Dharshan' },
  { time: '8:15 AM',  tamil: 'கோ பூஜை',           english: 'Gho Pooja' },
  { time: '9:30 AM',  tamil: 'திரு ஆராதனம்',      english: 'Thiru Aaraadhanam' },
  { time: '10:00 AM', tamil: 'அர்ச்சனை',           english: 'Archanai' },
  { time: '12:00 PM', tamil: 'மத்யம பூஜை',         english: 'Madhyama Pooja' },
]

const eveningSlots = [
  { time: '4:00 PM', tamil: 'நடை திறப்பு',  english: 'Nadai Thirappu' },
  { time: '5:00 PM', tamil: 'திரு ஆராதனம்', english: 'Thiru Aaraadhanam' },
  { time: '6:00 PM', tamil: 'மங்கல ஆரத்தி', english: 'Mangala Aarathi' },
  { time: '6:30 PM', tamil: 'அர்ச்சனை',     english: 'Archanai' },
  { time: '7:00 PM', tamil: 'சயனம்',         english: 'Shayanam' },
]

export default function DarshanSchedule({ card4EntriesRef }) {
  return (
    <div className="centered-card-content">
      <h2 className="essence-title">Daily Darshan Schedule</h2>
      <div className="hero-rule" style={{ margin: '1rem auto 0 auto' }} />

      <div className="schedule-grid">

        {/* Morning */}
        <div className="schedule-column">
          <p className="schedule-col-label">☀ Morning</p>
          {morningSlots.map((item, i) => (
            <div
              key={i}
              className="schedule-entry"
              ref={el => { card4EntriesRef.current[i] = el }}
              style={{ transform: 'translateY(8px)' }}
            >
              <span className="schedule-time">{item.time}</span>
              <div className="schedule-event">
                <span className="schedule-event-tamil">{item.tamil}</span>
                <span className="schedule-event-english">{item.english}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Evening */}
        <div className="schedule-column">
          <p className="schedule-col-label">🌙 Evening</p>
          {eveningSlots.map((item, i) => (
            <div
              key={i}
              className="schedule-entry"
              ref={el => { card4EntriesRef.current[i + 5] = el }}
              style={{ transform: 'translateY(8px)' }}
            >
              <span className="schedule-time">{item.time}</span>
              <div className="schedule-event">
                <span className="schedule-event-tamil">{item.tamil}</span>
                <span className="schedule-event-english">{item.english}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Kumkuma Archana CTA */}
      <div className="kumkuma-btn-wrapper">
        <a href="/archana" className="kumkuma-btn">
          <span className="kumkuma-btn-dot" aria-hidden="true" />
          Register for Online Kumkuma Archana
        </a>
        <span className="kumkuma-tooltip">
          Kumkuma Prasadam will be sent to your doorstep
        </span>
      </div>

    </div>
  )
}
