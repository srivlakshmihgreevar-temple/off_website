// src/components/MapComponent.jsx
import { useEffect, useState } from 'react'
import './MapComponent.css'

// ── Swap these when coordinates are confirmed ──────────────
const TEMPLE_LAT = 12.9716   // placeholder — replace with actual
const TEMPLE_LNG = 80.2209   // placeholder — replace with actual
const GOOGLE_REVIEW_URL = 'https://maps.app.goo.gl/Dr2DPpiB5BqTwwJD7'
// ──────────────────────────────────────────────────────────

export default function MapComponent({ qrSrc = null }) {
  const [mapSrc, setMapSrc]       = useState(null)
  const [dirUrl, setDirUrl]       = useState(null)
  const [locState, setLocState]   = useState('pending') // 'pending' | 'granted' | 'denied'

  useEffect(() => {
    // Fallback src — just the temple pin
    const templeSrc = `https://maps.google.com/maps?q=${TEMPLE_LAT},${TEMPLE_LNG}&output=embed`
    
    if (!navigator.geolocation) {
      setMapSrc(templeSrc)
      setLocState('denied')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: uLat, longitude: uLng } = pos.coords
        // Directions URL for the button — opens routing in Google Maps
        setDirUrl(
          `https://www.google.com/maps/dir/${uLat},${uLng}/${TEMPLE_LAT},${TEMPLE_LNG}`
        )
        // iframe shows temple pin regardless — routing doesn't work in embeds
        setMapSrc(templeSrc)
        setLocState('granted')
      },
      () => {
        // Permission denied — just show temple pin
        setMapSrc(templeSrc)
        setLocState('denied')
      },
      { timeout: 6000, maximumAge: 300000 }
    )
  }, [])

  return (
    <div className="map-component">

      {/* ── Map iframe ── */}
      <div className="map-iframe-wrapper">
        {mapSrc
          ? (
            <iframe
              className="map-iframe"
              src={mapSrc}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sri Hayagreeva Perumal Temple"
            />
          )
          : (
            <div className="map-loading">
              <span>Locating the temple…</span>
            </div>
          )
        }
      </div>

      {/* ── Get Directions button — only shown when location was granted ── */}
      {locState === 'granted' && dirUrl && (
        <a
          href={dirUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="map-directions-btn"
        >
          Get Directions
          <span className="map-directions-arrow" aria-hidden="true">→</span>
        </a>
      )}

      {/* ── QR Code + review caption ── */}
      <div className="map-qr-block">
        <div>

          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="map-qr-link"
            aria-label="Click to write a Google review"
          >
            {qrSrc
              ? <img src={qrSrc} alt="Google Review QR Code" className="map-qr-image" />
              : (
                <div className="map-qr-placeholder">
                  <span>QR</span>
                </div>
              )
            }
          </a>
          <p className="map-qr-caption">Click on the QR code to write a review</p>
        </div>
        <p className="card-7-review-question">
          Have you already visited the temple?
          <em>A review from you would support our growth.</em>
        </p>

      </div>

    </div>
  )
}