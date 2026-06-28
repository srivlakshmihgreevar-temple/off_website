import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Alert from "../../components/Alert";
import {usePageTitle} from "../../hooks/usePageTitle"
import "./Archana.css";
const RASI_OPTIONS = [
  "மேஷம் (Aries)", "ரிஷபம் (Taurus)", "மிதுனம் (Gemini)",
  "கர்கடகம் (Cancer)", "சிம்மம் (Leo)", "கன்னி (Virgo)",
  "துலாம் (Libra)", "விருச்சிகம் (Scorpio)", "தனுசு (Sagittarius)",
  "மகரம் (Capricorn)", "கும்பம் (Aquarius)", "மீனம் (Pisces)",
];

const NATCHATHIRAM_OPTIONS = [
  "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிடம்",
  "திருவாதிரை", "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்",
  "பூரம்", "உத்திரம்", "அஸ்தம்", "சித்திரை", "சுவாதி",
  "விசாகம்", "அனுஷம்", "கேட்டை", "மூலம்", "பூராடம்",
  "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
  "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி",
];
const API_SERVER="http://localhost:3000"

const emptyMember = () => ({ name: "", rasi: "", natchathiram: "", gothram: "" });

export default function Archana() {
  const [members, setMembers] = useState([emptyMember()]);
  const [alertData, setAlertData] = useState({ show: false, message: '', type: 'message' });

  const showAlert = (message, type = 'message') => {
    setAlertData({ show: true, message, type });
  };

  usePageTitle("Kumkuma Archana | Sri Lakshmi Hayagriva Perumal Temple")
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  
  // Payment Mock State
  const [paymentStatus, setPaymentStatus] = useState(false);

 
  

  useEffect(() => {
    if (paymentStatus) {
      console.log("=== PAYMENT STATUS: TRUE ===");
      console.log("Devotee Details:", members);
      fetch(`${API_SERVER}/archanaregister`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({"members":members,"phn":phoneNumber,"addr":address})
      }).then((res)=>res.text()).then((data)=>showAlert(data, 'message'))
      setPaymentStatus(false);
      setPhoneNumber('');
      setAddress('');
      setMembers([emptyMember()]);
      setIsModalOpen(false);
    }
  }, [paymentStatus, members, phoneNumber, address]);

  const updateMember = (idx, field, value) => {
    setMembers(prev =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const addMember = () => {
    if (members.length >= 4) return;
    setMembers(prev => [...prev, emptyMember()]);
    // Smooth scroll to the bottom after next render
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 80);
  };

  const removeMember = (idx) => {
    if (members.length === 1) return; // always keep at least one
    setMembers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRegisterClick = () => {
    // Basic validation
    const incomplete = members.some(
      m => !m.name.trim() || !m.rasi || !m.natchathiram || !m.gothram.trim()
    );
    if (incomplete) {
      showAlert("Please fill in all fields for every devotee before registering.", "warning");
      return;
    }
    setIsModalOpen(true);
  };

  const handleProceedToPayment = () => {
    if (phoneNumber.length < 10) {
      showAlert("Please enter a valid 10-digit phone number.", "warning");
      return;
    }
    if (!address.trim()) {
      showAlert("Please enter your address for prasadam delivery.", "warning");
      return;
    }
    setPaymentStatus(true);
    setIsModalOpen(false);
    // TODO: Navigate to actual payment gateway
  };

  function Testing() { //Remove before production
    updateMember(0, "name", "Vishwaa");
    updateMember(0, "gothram", "Shrivatsam");
    updateMember(0, "rasi", "துலாம் (Libra)");
    updateMember(0, "natchathiram", "சுவாதி");
    setPhoneNumber("9500013229")
    setAddress("G-4, Jain Aakansha, Rathinammal Street, Kodambakkam, Chennai - 600024")
  }
  useEffect(()=>{
    Testing()
  },[])

  return (
    <>
      <NavBar />

      <div className="archana-page">
        {/* Vertical accent line — brand consistency with landing page */}
        <div className="archana-left-accent" aria-hidden="true" />

        <main className="archana-content">

          {/* ── Page Header ─────────────────────────────────── */}
          <header className="archana-header">
            <p className="archana-eyebrow">Sri Hayagriva Perumal Temple</p>
            <h1 className="archana-title">குங்குமார்ச்சனை</h1>
            <p className="archana-title-en">Kumkuma Archana</p>
            <div className="archana-rule" />
            <p className="archana-subtitle">
              Enter the details of each devotee for whom Archana is to be performed.
              <br />
              <span className="prasadam">Prasadam will be dispatched after the Archana is performed.</span>
            </p>
          </header>

          {/* ── Member Cards ─────────────────────────────────── */}
          <section className="archana-members" aria-label="Devotee details">
            {members.map((member, idx) => (
              <div
                className="archana-member-card"
                key={idx}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {/* Card header */}
                <div className="archana-member-header">
                  <span className="archana-member-label">
                    {idx === 0 ? "Primary Devotee" : `Family Member ${idx}`}
                  </span>
                  {idx > 0 && (
                    <button
                      className="archana-remove-btn"
                      onClick={() => removeMember(idx)}
                      aria-label={`Remove member ${idx}`}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Single-row input grid */}
                <div className="archana-form-grid">

                  {/* Name */}
                  <div className="archana-field">
                    <label className="archana-label" htmlFor={`name-${idx}`}>Name</label>
                    <input
                      id={`name-${idx}`}
                      className="archana-input"
                      type="text"
                      placeholder="Full name of devotee"
                      value={member.name}
                      onChange={e => updateMember(idx, "name", e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  {/* Gothram */}
                  <div className="archana-field">
                    <label className="archana-label" htmlFor={`gothram-${idx}`}>Gothram</label>
                    <input
                      id={`gothram-${idx}`}
                      className="archana-input"
                      type="text"
                      placeholder="e.g. Bharadwaja"
                      value={member.gothram}
                      onChange={e => updateMember(idx, "gothram", e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  {/* Rasi */}
                  <div className="archana-field">
                    <label className="archana-label" htmlFor={`rasi-${idx}`}>Rasi</label>
                    <select
                      id={`rasi-${idx}`}
                      className="archana-input"
                      value={member.rasi}
                      onChange={e => updateMember(idx, "rasi", e.target.value)}
                    >
                      <option value="" disabled>Select Rasi</option>
                      {RASI_OPTIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Natchathiram */}
                  <div className="archana-field">
                    <label className="archana-label" htmlFor={`natchathiram-${idx}`}>Natchathiram</label>
                    <select
                      id={`natchathiram-${idx}`}
                      className="archana-input"
                      value={member.natchathiram}
                      onChange={e => updateMember(idx, "natchathiram", e.target.value)}
                    >
                      <option value="" disabled>Select Natchathiram</option>
                      {NATCHATHIRAM_OPTIONS.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>
            ))}

            {/* ── Add Family Member — bottom-left of the section ── */}
            <div className="archana-members-footer">
              {members.length < 4 && (
                <button
                  id="add-family-member-btn"
                  className="archana-btn-add"
                  onClick={addMember}
                  aria-label="Add another family member"
                >
                  <span className="archana-btn-add-icon" aria-hidden="true">+</span>
                  <span className="archana-btn-add-text">Add Family Member</span>
                </button>
              )}
            </div>
          </section>

          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-secondary, #666)" }}>
            * Note: You can add a maximum of 4 people per registration.
          </div>

          {/* ── Divider ──────────────────────────────────────── */}
          <div className="archana-separator" aria-hidden="true" />

          {/* ── Action Buttons ───────────────────────────────── */}
          <div className="archana-actions">

            {members.length > 1 && (
              <p className="archana-count-pill">
                {members.length} devotees added for Archana
              </p>
            )}

            {/* Add Family Member */}
           

            {/* Register Button */}
            <button
              id="register-archana-btn"
              className="archana-btn-register"
              onClick={handleRegisterClick}
              aria-label="Register for Archana"
            >
              Register for Archana
              <span className="archana-btn-register-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </main>
      </div>

      {/* ── Registration Modal ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="archana-modal-overlay">
          <div className="archana-modal">
            
            <button className="archana-modal-close" onClick={() => setIsModalOpen(false)}>×</button>

            <div className="archana-modal-step fade-in">
              <h3 className="archana-modal-title">Delivery Details</h3>
              <p className="archana-modal-desc">
                To ensure smooth delivery of your Prasadam, please provide your contact and address details.
              </p>
              
              <div className="archana-modal-field">
                <label className="archana-label">Phone Number</label>
                <div className="phone-input-wrapper">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    className="archana-input"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0,10))}
                  />
                </div>
              </div>

              <div className="archana-modal-field">
                <label className="archana-label">Complete Address</label>
                <textarea
                  className="archana-input archana-textarea"
                  placeholder="House/Flat No., Street Name, Area, City, Pincode"
                  rows={3}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              <button className="archana-btn-pay" onClick={handleProceedToPayment}>
                Proceed to Payment (₹100)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Alert Component ────────────────────────────────────── */}
      {alertData.show && (
        <Alert 
          message={alertData.message} 
          type={alertData.type} 
          onClose={() => setAlertData({ ...alertData, show: false })} 
        />
      )}
    </>
  );
}