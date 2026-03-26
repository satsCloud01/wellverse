import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Nav from './components/Nav'
import Footer from './components/Footer'
import GuideModal from './components/GuideModal'
import GuidedTour, { LS_KEY } from './components/GuidedTour'
import Home from './pages/Home'
import Explore from './pages/Explore'
import VerticalDetail from './pages/VerticalDetail'
import Browse from './pages/Browse'
import ForGuides from './pages/ForGuides'
import Apply from './pages/Apply'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Messages from './pages/Messages'
import Library from './pages/Library'
import Circles from './pages/Circles'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

export default function App() {
  const [modal, setModal] = useState(null)
  const [tourOpen, setTourOpen] = useState(false)

  // Auto-show tour on first visit
  useEffect(() => {
    if (!localStorage.getItem(LS_KEY)) {
      const timer = setTimeout(() => setTourOpen(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <AuthProvider>
      <div className="bg-void text-parchment min-h-screen font-body">
        <Nav onStartTour={() => setTourOpen(true)} />
        <Routes>
          <Route path="/" element={<Home onOpenGuide={setModal} />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/vertical/:id" element={<VerticalDetail onOpenGuide={setModal} />} />
          <Route path="/browse" element={<Browse onOpenGuide={setModal} />} />
          <Route path="/for-guides" element={<ForGuides />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/library" element={<Library />} />
          <Route path="/circles" element={<Circles />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <Footer />
        <GuideModal guide={modal} onClose={() => setModal(null)} />
        <GuidedTour isOpen={tourOpen} onClose={() => setTourOpen(false)} />
      </div>
    </AuthProvider>
  )
}
