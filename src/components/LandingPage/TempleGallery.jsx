// src/components/LandingPage/TempleGallery.jsx

const photos = [
  { event: 'Maha Samprokshanam',      date: '13 May 2022',  src: null },
  { event: 'Brahmotsavam',            date: 'Panguni 2023',  src: null },
  { event: 'Vaikunta Ekadasi',        date: 'Dec 2023',      src: null },
  { event: 'Hayagreeva Jayanthi',     date: 'Shravan 2023',  src: null },
  { event: 'Thiruvadhyayana Uthsavam', date: 'Jan 2024',    src: null },
]

export default function TempleGallery() {
  return (
    <>
      <div className="card-5-header">
        <p className="hero-eyebrow">Glimpses of the Divine</p>
        <h2 className="essence-title">Temple in Moments</h2>
        <div className="hero-rule" style={{ margin: '1rem auto' }} />
      </div>

      {/* Horizontal polaroid strip — drag to scroll */}
      <div
        className="polaroid-strip"
        onMouseDown={e => {
          const el = e.currentTarget
          el.dataset.dragging = 'true'
          el.dataset.startX = e.pageX - el.offsetLeft
          el.dataset.scrollLeft = el.scrollLeft
        }}
        onMouseMove={e => {
          const el = e.currentTarget
          if (el.dataset.dragging !== 'true') return
          e.preventDefault()
          const x = e.pageX - el.offsetLeft
          const walk = (x - el.dataset.startX) * 1.4
          el.scrollLeft = el.dataset.scrollLeft - walk
        }}
        onMouseUp={e    => { e.currentTarget.dataset.dragging = 'false' }}
        onMouseLeave={e => { e.currentTarget.dataset.dragging = 'false' }}
      >
        {photos.map((photo, i) => (
          <div className="polaroid" key={i}>
            {photo.src
              ? <img src={photo.src} alt={photo.event} className="polaroid-image" />
              : (
                <div className="polaroid-image-placeholder">
                  <span>Image</span>
                </div>
              )
            }
            <div className="polaroid-caption">
              <p className="polaroid-caption-event">{photo.event}</p>
              <p className="polaroid-caption-date">{photo.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card-5-footer">
        <a href="/gallery" className="hero-cta">
          View the Gallery
          <span className="hero-cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </>
  )
}
