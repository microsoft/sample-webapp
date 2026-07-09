import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Newsletter from './pages/Newsletter';
import Feedback from './pages/Feedback';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <ScrollProgress />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ScrollToTop />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
