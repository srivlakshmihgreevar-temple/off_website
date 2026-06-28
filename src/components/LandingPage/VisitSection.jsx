// src/components/LandingPage/VisitSection.jsx
import MapComponent from './MapComponent'
import PolaroidStack from './PolaroidStack'

export default function VisitSection() {
  return (
    <>
      {/* Left — Map + QR */}
      <div className="card-7-left">
        <p className="hero-eyebrow">Find Us</p>
        <h2 className="essence-title">Visit the Temple</h2>
        <div className="hero-rule" style={{ marginBottom: '1.2rem' }} />
        <MapComponent qrSrc={null} /* swap null for your QR import when ready */ />
      </div>

      {/* Right — Review nudge + Polaroid stack */}
      <div className="card-7-right">
        <PolaroidStack />
      </div>
    </>
  )
}
