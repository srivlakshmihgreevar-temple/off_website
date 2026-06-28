// src/App.jsx
import { Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage/LandingPage'
import Shravanam from './pages/Shravanam/Shravanam'
import Login      from './pages/Login/Login'
import SignUp      from './pages/SignUp/SignUp'
import Darshan    from './pages/Darshan'
import Events     from './pages/Events'
import Gallery    from './pages/Gallery'
import Visit      from './pages/Visit'
import Archana    from './pages/Archana/Archana'
import Donate     from './pages/Donate'

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<LandingPage />} />
      <Route path="/darshan" element={<Darshan />} />
      <Route path="/shravanam" element={<Shravanam />} />
      <Route path="/events"  element={<Events />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/visit"   element={<Visit />} />
      <Route path="/archana" element={<Archana />} />
      <Route path="/donate"  element={<Donate />} />
      <Route path="/login"  element={<Login />} />
      <Route path="/signup"  element={<SignUp />} />

    </Routes>
  )
}