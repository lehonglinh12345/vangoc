import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Studio Initial Intro Loading Reveal */}
          <LoadingScreen />

          {/* Ambient Background Grid and Vignette */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-[#0A0A0A]">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            {/* Top ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-studio-red/10 via-transparent to-transparent blur-3xl opacity-60 pointer-events-none" />
          </div>

          <div className="relative min-h-screen flex flex-col font-sans selection:bg-studio-red selection:text-white bg-transparent">
            {/* Main Sticky Navbar */}
            <Navbar />

            {/* Page Routes */}
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Global Studio Footer */}
            <Footer />

            {/* Global Auth Modal */}
            <AuthModal />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
