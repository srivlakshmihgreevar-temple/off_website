// src/components/LandingPage/FoundationCard.jsx
export default function FoundationCard({ card3TextRef, foundationRef }) {
  return (
    <div ref={card3TextRef} className="centered-card-content" style={{ transform: 'translateY(40px)' }}>
      <p className="hero-eyebrow">The Dream Come True</p>
      <h2 className="essence-title">Foundation of the Temple</h2>
      <div className="hero-rule" />
      <p className="essence-body" ref={foundationRef}>
        Sri Lakshmi Hayagreeva Perumal, the Supreme Deity of wisdom and education, had appeared in a divine dream and commanded the construction of a temple for Himself, for the welfare of the entire world (Loka Kshemam). Performing several divine plays (leelas), He Himself showed the way and means to accomplish it. From selecting the sacred land to marking the exact spot where the sanctum sanctorum (sannidhi) was to stand, He guided every single step. Furthermore, He manifested in human form (Manushya Roopena) to provide financial assistance, offering continuous guidance and encouragement.

        Following the divine path shown by Him, the temple construction works were successfully executed and completed.
        <p className="hero-eyebrow bright"><b>The Grand Consecration (Maha Samprokshanam):</b></p>
        By the boundless grace of the Almighty (Bhagavath Anugraham) and the compassion of the Guru (Acharyan Krupai), the temple construction culminated in the grand performance of the Nootana Maha Samprokshanam (Kumbhabhishekam).

        This historic and sacred event took place on:<br></br>
        <ul>
        <li className="hero-eyebrow bright normal">Date: <b>Subhakrutu Year, 30th day of Chittirai Month (13th May 2022), Friday</b></li>
        <li className="hero-eyebrow bright normal">Auspicious Time: <b>Between 6:00 AM and 7:00 AM (in the auspicious Rishabha Lagnam, under Hastha Nakshatram and Amrita Yogam)</b></li>
        </ul>

        The sacred ceremony was beautifully solemnized under the holy leadership, presence, and blessings (Adhyaksham) of:<br></br>
        <p className="parakala_jeeyar hero-eyebrow bright normal">

        Srimad Vedha Maarga Prathishtaapanaacharya Paramahamsa Parivraajakaacharya Sarvathanthra Swathanthrobhaya Vedhaanthaachaarya Sri Bhagavath Ramanuja Siddhaantha Nirdhaarana Saarvabhauma Srimad Abhinava Vaageesha Brahma Thanthra Swathanthra Parakala Mahadesikan


        </p>
        Multitudes of devotees (Bhakta Kodigal) gathered to witness this grand, auspicious occasion, immersing themselves in the divine atmosphere and receiving the bountiful blessings of Emperumaan Sri Vidya Lakshmi Hayagreevar and the venerable Acharyas.
      </p>
    </div>
  )
}
