import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Alert from "../../components/Alert";
import {usePageTitle} from "../../hooks/usePageTitle"
import "./Shravanam.css";

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

const API_SERVER="http://localhost:3000";

const emptyMember = () => ({ name: "", rasi: "", natchathiram: "", gothram: "" });

export default function Shravanam() {
  const [members, setMembers] = useState([emptyMember()]);
  const [alertData, setAlertData] = useState({ show: false, message: '', type: 'message' });

  const showAlert = (message, type = 'message') => {
    setAlertData({ show: true, message, type });
  };

  usePageTitle("Shravana Sankalpam | Sri Lakshmi Hayagriva Perumal Temple");

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
      fetch(`${API_SERVER}/shravanamregister`,{
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
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 80);
  };

  const removeMember = (idx) => {
    if (members.length === 1) return;
    setMembers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRegisterClick = () => {
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

      <div className="shravanam-page">
        <div className="shravanam-left-accent" aria-hidden="true" />

        <main className="shravanam-content">

          <header className="shravanam-header">
            <p className="shravanam-eyebrow">Sri Hayagriva Perumal Temple</p>
            <h1 className="shravanam-title">ச்ரவண சங்கல்பம்</h1>
            <p className="shravanam-title-en">Shravana Sankalpam</p>
            <div className="shravanam-rule" />
            <p className="shravanam-subtitle">
              The Shravana natchathiram is highly auspicious for Sri Hayagreevar.
              As the procedure for this sankalpam is elaborate, the charge is ₹500.
              <br />
              <span className="prasadam">Prasadam will be dispatched after the Sankalpam is performed.</span>
            </p>
          </header>

          <section className="shravanam-members" aria-label="Devotee details">
            {members.map((member, idx) => (
              <div
                className="shravanam-member-card"
                key={idx}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="shravanam-member-header">
                  <span className="shravanam-member-label">
                    {idx === 0 ? "Primary Devotee" : `Family Member ${idx}`}
                  </span>
                  {idx > 0 && (
                    <button
                      className="shravanam-remove-btn"
                      onClick={() => removeMember(idx)}
                      aria-label={`Remove member ${idx}`}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="shravanam-form-grid">

                  <div className="shravanam-field">
                    <label className="shravanam-label" htmlFor={`name-${idx}`}>Name</label>
                    <input
                      id={`name-${idx}`}
                      className="shravanam-input"
                      type="text"
                      placeholder="Full name of devotee"
                      value={member.name}
                      onChange={e => updateMember(idx, "name", e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  <div className="shravanam-field">
                    <label className="shravanam-label" htmlFor={`gothram-${idx}`}>Gothram</label>
                    <input
                      id={`gothram-${idx}`}
                      className="shravanam-input"
                      type="text"
                      placeholder="e.g. Bharadwaja"
                      value={member.gothram}
                      onChange={e => updateMember(idx, "gothram", e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  <div className="shravanam-field">
                    <label className="shravanam-label" htmlFor={`rasi-${idx}`}>Rasi</label>
                    <select
                      id={`rasi-${idx}`}
                      className="shravanam-input"
                      value={member.rasi}
                      onChange={e => updateMember(idx, "rasi", e.target.value)}
                    >
                      <option value="" disabled>Select Rasi</option>
                      {RASI_OPTIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="shravanam-field">
                    <label className="shravanam-label" htmlFor={`natchathiram-${idx}`}>Natchathiram</label>
                    <select
                      id={`natchathiram-${idx}`}
                      className="shravanam-input"
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

            <div className="shravanam-members-footer">
              {members.length < 4 && (
                <button
                  id="add-family-member-btn"
                  className="shravanam-btn-add"
                  onClick={addMember}
                  aria-label="Add another family member"
                >
                  <span className="shravanam-btn-add-icon" aria-hidden="true">+</span>
                  <span className="shravanam-btn-add-text">Add Family Member</span>
                </button>
              )}
            </div>
          </section>

          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-secondary, #666)" }}>
            * Note: You can add a maximum of 4 people per registration.
          </div>

          <div className="shravanam-separator" aria-hidden="true" />

          <div className="shravanam-actions">

            {members.length > 1 && (
              <p className="shravanam-count-pill">
                {members.length} devotees added for Sankalpam
              </p>
            )}

            <button
              id="register-shravanam-btn"
              className="shravanam-btn-register"
              onClick={handleRegisterClick}
              aria-label="Register for Sankalpam"
            >
              Register for Sankalpam
              <span className="shravanam-btn-register-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="shravanam-modal-overlay">
          <div className="shravanam-modal">
            
            <button className="shravanam-modal-close" onClick={() => setIsModalOpen(false)}>×</button>

            <div className="shravanam-modal-step fade-in">
              <h3 className="shravanam-modal-title">Delivery Details</h3>
              <p className="shravanam-modal-desc">
                To ensure smooth delivery of your Prasadam, please provide your contact and address details.
              </p>
              
              <div className="shravanam-modal-field">
                <label className="shravanam-label">Phone Number</label>
                <div className="phone-input-wrapper">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    className="shravanam-input"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0,10))}
                  />
                </div>
              </div>

              <div className="shravanam-modal-field">
                <label className="shravanam-label">Complete Address</label>
                <textarea
                  className="shravanam-input shravanam-textarea"
                  placeholder="House/Flat No., Street Name, Area, City, Pincode"
                  rows={3}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              <button className="shravanam-btn-pay" onClick={handleProceedToPayment}>
                Proceed to Payment (₹500)
              </button>
            </div>

          </div>
        </div>
      )}

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
