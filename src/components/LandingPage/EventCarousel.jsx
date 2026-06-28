import { useState } from "react"

const EVENTS = [
  {
    title: 'Maha Samprokshanam',
    date: '13 May 2022',
    description: 'The grand consecration ceremony marking the divine inauguration of the temple, conducted under the blessings of Parakala Mahadesikan.',
    src: null,
  },
  {
    title: 'Brahmotsavam',
    date: 'Panguni 2023',
    description: 'The annual festival of the Lord celebrated with processions, devotional music and thousands of devotees over several days.',
    src: null,
  },
  {
    title: 'Vaikunta Ekadasi',
    date: 'December 2023',
    description: 'The most auspicious day for Vaishnavas — devotees gathered to witness the opening of the Paramapada Vasal and receive the Lord\'s grace.',
    src: null,
  },
  {
    title: 'Hayagreeva Jayanthi',
    date: 'Shravan 2023',
    description: 'Celebration of the birth star of Lord Hayagreeva, marked with special abhishekam, alankaram and recitation of Hayagreeva Stotram.',
    src: null,
  },
  {
    title: 'Thiruvadhyayana Uthsavam',
    date: 'January 2024',
    description: 'A ten-day festival of sacred recitation honouring the Divya Prabandham, the Tamil Vedas sung by the Alvars.',
    src: null,
  },
]

export default function EventCarousel() {
  const [active, setActive] = useState(0)
  const [dir, setDir]       = useState('next') // 'next' | 'prev'
  const [animating, setAnimating] = useState(false)

  const go = (index) => {
    if (animating || index === active) return
    setDir(index > active ? 'next' : 'prev')
    setAnimating(true)
    setTimeout(() => {
      setActive(index)
      setAnimating(false)
    }, 320)
  }

  const prev = () => go((active - 1 + EVENTS.length) % EVENTS.length)
  const next = () => go((active + 1) % EVENTS.length)

  const event = EVENTS[active]

  return (
    <div className="carousel-inner">

      {/* Left — Event info */}
      <div className={`carousel-content ${animating ? `carousel-exit-${dir}` : 'carousel-enter'}`}>
        <p className="hero-eyebrow">Temple Events</p>
        <h2 className="essence-title carousel-event-title">{event.title}</h2>
        <div className="hero-rule" />
        <p className="carousel-event-date">{event.date}</p>
        <p className="carousel-event-desc">{event.description}</p>
      </div>

      {/* Right — Polaroid */}
      <div className={`carousel-polaroid-wrap ${animating ? 'carousel-polaroid-exit' : 'carousel-polaroid-enter'}`}>
        <div className="polaroid carousel-polaroid">
          {event.src
            ? <img src={event.src} alt={event.title} className="polaroid-image" />
            : <div className="polaroid-image-placeholder"><span>Image</span></div>
          }
          <div className="polaroid-caption">
            <p className="polaroid-caption-event">{event.title}</p>
            <p className="polaroid-caption-date">{event.date}</p>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button className="carousel-arrow carousel-arrow-prev" onClick={prev} aria-label="Previous event">←</button>
      <button className="carousel-arrow carousel-arrow-next" onClick={next} aria-label="Next event">→</button>

      {/* Radio dots */}
      <div className="carousel-dots">
        {EVENTS.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === active ? 'carousel-dot-active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to event ${i + 1}`}
          />
        ))}
      </div>

    </div>
  )
}