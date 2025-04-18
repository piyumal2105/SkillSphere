import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigateLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="logo" onClick={() => (window.location.href = "/")}>
              <span>SkillSphere</span>
            </div>

            {/* Desktop Navigation */}
            <div className="desktop-nav">
              <a href="/" className="nav-link">
                Home
              </a>
              <a href="#features" className="nav-link">
                Features
              </a>
              <a href="#about" className="nav-link">
                About
              </a>
              <a href="/login" className="nav-link">
                Contact
              </a>
              <button className="primary-button" onClick={handleNavigateLogin}>
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="mobile-menu-toggle">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="menu-button"
              >
                <svg
                  className="menu-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <a href="#home" className="mobile-nav-link">
                Home
              </a>
              <a href="#features" className="mobile-nav-link">
                Features
              </a>
              <a href="#about" className="mobile-nav-link">
                About
              </a>
              <a href="#contact" className="mobile-nav-link">
                Contact
              </a>
              <button className="mobile-primary-button">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span>Welcome to Our</span>
              <span className="highlight">Amazing Platform</span>
            </h1>
            <p className="hero-description">
              Transform your business with our innovative solutions. Start your
              journey today and see the difference.
            </p>
            <div className="hero-buttons">
              <a href="#" className="primary-button hero-button">
                Get Started
              </a>
              <a href="#" className="secondary-button hero-button">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Key Features</h2>
            <p className="features-description">
              Everything you need to succeed in today's competitive market.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">
                  <svg
                    className="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Our platform is optimized for speed and efficiency, helping you
                accomplish more in less time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">
                  <svg
                    className="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="feature-title">Secure & Reliable</h3>
              <p className="feature-description">
                Security is our priority. Your data is always protected with
                enterprise-grade security.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">
                  <svg
                    className="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="feature-title">Easy to Use</h3>
              <p className="feature-description">
                Intuitive design means you'll be up and running in minutes, not
                hours or days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
