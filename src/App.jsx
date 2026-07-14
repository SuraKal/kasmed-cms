import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import ContentDetailPage from './pages/public/ContentDetailPage';
import EngagementsPage from './pages/public/EngagementsPage';
import GalleryPage from './pages/public/GalleryPage';
import SolutionsPage from './pages/public/SolutionsPage';


function App() {

  return (
    <Router>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/engagements" element={<EngagementsPage />} />
          <Route
            path="/engagements/:slug"
            element={<ContentDetailPage type="engagements" />}
          />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route
            path="/solutions/:slug"
            element={<ContentDetailPage type="solutions" />}
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
