import  { useState } from 'react'

const TEMPLE_PHOTOS = [
  { event: 'Maha Samprokshanam',       date: '13 May 2022',  src: null },
  { event: 'Brahmotsavam',             date: 'Panguni 2023', src: null },
  { event: 'Vaikunta Ekadasi',         date: 'Dec 2023',     src: null },
  { event: 'Hayagreeva Jayanthi',      date: 'Shravan 2023', src: null },
  { event: 'Thiruvadhyayana Uthsavam', date: 'Jan 2024',     src: null },
]

// Tilt offsets per stack position — top card is always index 0
const TILTS = [-2, 3, -4, 2, -1]

export default function PolaroidStack() {
  const [queue, setQueue]         = useState(TEMPLE_PHOTOS.map((_, i) => i))
  const [exiting, setExiting]     = useState(false)
  const [exitDir, setExitDir]     = useState('next') // 'next' | 'prev'

  const shift = (dir) => {
    if (exiting) return
    setExitDir(dir)
    setExiting(true)
    setTimeout(() => {
      setQueue(prev => {
        if (dir === 'next') {
          // top card goes to the bottom
          const [first, ...rest] = prev
          return [...rest, first]
        } else {
          // bottom card comes to the top
          const last = prev[prev.length - 1]
          return [last, ...prev.slice(0, -1)]
        }
      })
      setExiting(false)
    }, 350)
  }

  return (
    <div className="polaroid-stack-wrapper">

      {/* Stack */}
      <div className="polaroid-stack">
        {[...queue].reverse().map((photoIdx, stackPos) => {
          const photo     = TEMPLE_PHOTOS[photoIdx]
          const isTop     = stackPos === queue.length - 1
          const tilt      = TILTS[stackPos % TILTS.length]
          const depthOffset = (queue.length - 1 - stackPos) * 4 // px nudge per layer

          return (
            <div
              key={photoIdx}
              className={`polaroid stack-card ${isTop && exiting ? `stack-exit-${exitDir}` : ''}`}
              style={{
                '--tilt': `${tilt}deg`,
                zIndex: stackPos + 1,
                transform: `rotate(${tilt}deg) translateY(${depthOffset}px)`,
                position: 'absolute',
                transition: isTop && !exiting ? 'none' : undefined,
              }}
            >
              {photo.src
                ? <img src={photo.src} alt={photo.event} className="polaroid-image" />
                : <div className="polaroid-image-placeholder"><span>Image</span></div>
              }
              <div className="polaroid-caption">
                <p className="polaroid-caption-event">{photo.event}</p>
                <p className="polaroid-caption-date">{photo.date}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Prev / Next */}
      <div className="stack-nav">
        <button
          className="carousel-arrow"
          onClick={() => shift('prev')}
          aria-label="Previous photo"
        >←</button>
        <button
          className="carousel-arrow"
          onClick={() => shift('next')}
          aria-label="Next photo"
        >→</button>
      </div>

    </div>
  )
}