import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiSearch,
  FiShield,
  FiStar,
  FiUsers,
  FiMessageCircle,
} from "react-icons/fi";
import "./LandingPage.css";

function LandingPage() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/user/get-all-approved-doctors");

        if (response.data?.success) {
          setDoctors(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching approved doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="landing-page">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="landing-navbar">
        <Link to="/" className="landing-logo">
          <span className="logo-mark">
            <FiHeart />
          </span>

          <span>TakeCare</span>
        </Link>

        <nav className="landing-nav">
          <button onClick={() => scrollToSection("doctors")}>Doctors</button>

          <button onClick={() => scrollToSection("how-it-works")}>
            How it works
          </button>

          <button onClick={() => scrollToSection("features")}>Features</button>
        </nav>

        <div className="landing-nav-actions">
          <Link to={isLoggedIn ? "/home" : "/login"} className="nav-login">
            {isLoggedIn ? "Dashboard" : "Login"}
          </Link>

          <Link to={isLoggedIn ? "/home" : "/register"} className="nav-signup">
            {isLoggedIn ? "Go to Dashboard" : "Get Started"}
            <FiArrowRight />
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <main>
        <section className="landing-hero">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot"></span>
              Healthcare made simpler
            </div>

            <h1>
              Healthcare that
              <br />
              <span>fits your life.</span>
            </h1>

            <p>
              Find trusted doctors, discover available appointments, and manage
              your healthcare journey — all from one simple platform.
            </p>

            <div className="hero-buttons">
              <Link
                to={isLoggedIn ? "/search-doctors" : "/register"}
                className="hero-primary-btn"
              >
                Find a Doctor
                <FiArrowRight />
              </Link>

              <button
                className="hero-secondary-btn"
                onClick={() => scrollToSection("how-it-works")}
              >
                See how it works
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-avatars">
                <span>SM</span>
                <span>AK</span>
                <span>RS</span>
                <span>+</span>
              </div>

              <div>
                <div className="trust-stars">
                  <FiStar />
                  <FiStar />
                  <FiStar />
                  <FiStar />
                  <FiStar />
                </div>

                <p>Simple care. Better experience.</p>
              </div>
            </div>
          </div>

          {/* PRODUCT PREVIEW */}

          <div className="hero-product">
            <div className="hero-glow"></div>

            <div className="product-window">
              <div className="window-topbar">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="window-title">TakeCare</div>
              </div>

              <div className="preview-content">
                <div className="preview-header">
                  <div>
                    <small>Welcome back</small>
                    <h3>Find your doctor</h3>
                  </div>

                  <div className="preview-avatar">SC</div>
                </div>

                <div className="preview-search">
                  <FiSearch />
                  <span>Search doctors or specialties...</span>
                </div>

                <div className="preview-label">Recommended doctors</div>

                <div className="preview-doctor">
                  <div className="preview-doctor-image">
                    <FiHeart />
                  </div>

                  <div className="preview-doctor-info">
                    <strong>Dr. Sarah Johnson</strong>
                    <span>Cardiologist</span>

                    <div className="doctor-rating">
                      <FiStar />
                      <span>4.9</span>
                      <small>• Available today</small>
                    </div>
                  </div>

                  <div className="preview-book">Book</div>
                </div>

                <div className="preview-doctor second">
                  <div className="preview-doctor-image purple">
                    <FiHeart />
                  </div>

                  <div className="preview-doctor-info">
                    <strong>Dr. Michael Lee</strong>
                    <span>General Physician</span>

                    <div className="doctor-rating">
                      <FiStar />
                      <span>4.8</span>
                      <small>• Available today</small>
                    </div>
                  </div>

                  <div className="preview-book">Book</div>
                </div>
              </div>
            </div>

            {/* FLOATING APPOINTMENT CARD */}

            <div className="floating-appointment">
              <div className="floating-icon">
                <FiCalendar />
              </div>

              <div>
                <small>Upcoming appointment</small>
                <strong>Today · 10:30 AM</strong>
              </div>

              <FiCheckCircle className="floating-check" />
            </div>

            {/* FLOATING VERIFIED CARD */}

            <div className="floating-verified">
              <div className="verified-icon">
                <FiShield />
              </div>

              <div>
                <strong>Verified doctors</strong>
                <small>Trusted professionals</small>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="landing-stats">
          <div className="stats-inner">
            <div className="stat-item">
              <div className="stat-icon">
                <FiUsers />
              </div>

              <div>
                <strong>{loadingDoctors ? "—" : doctors.length + "+"}</strong>
                <span>Verified doctors</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <FiCalendar />
              </div>

              <div>
                <strong>Easy</strong>
                <span>Appointment booking</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <FiClock />
              </div>

              <div>
                <strong>24/7</strong>
                <span>Access to your account</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <FiShield />
              </div>

              <div>
                <strong>Secure</strong>
                <span>Healthcare experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            DOCTORS
        ===================================================== */}

        <section id="doctors" className="doctors-section">
          <div className="section-top">
            <div>
              <span className="section-eyebrow">MEET OUR DOCTORS</span>

              <h2>
                Care from professionals
                <br />
                you can trust.
              </h2>
            </div>

            <Link to="/search-doctors" className="section-link">
              View all doctors
              <FiArrowRight />
            </Link>
          </div>

          <div className="doctor-grid">
            {loadingDoctors ? (
              <>
                <div className="doctor-skeleton"></div>
                <div className="doctor-skeleton"></div>
                <div className="doctor-skeleton"></div>
              </>
            ) : doctors.length > 0 ? (
              doctors.slice(0, 3).map((doctor) => (
                <div className="landing-doctor-card" key={doctor._id}>
                  <div className="doctor-card-top">
                    <div className="landing-doctor-image">
                      <img
                        src={
                          doctor.profilePic ||
                          "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        }
                        alt={`${doctor.firstName} ${doctor.lastName}`}
                      />

                      <span className="online-dot"></span>
                    </div>

                    <div className="verified-badge">
                      <FiCheckCircle />
                      Verified
                    </div>
                  </div>

                  <div className="landing-doctor-info">
                    <h3>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>

                    <p>{doctor.specialization}</p>

                    <div className="doctor-meta">
                      <span>
                        <FiStar />
                        4.9
                      </span>

                      <span>
                        <FiClock />
                        {doctor.experience} experience
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/book-appointment/${doctor._id}`}
                    className="doctor-book-btn"
                  >
                    Book appointment
                    <FiArrowRight />
                  </Link>
                </div>
              ))
            ) : (
              <div className="empty-doctors">
                <div className="empty-doctors-icon">
                  <FiUsers />
                </div>

                <div className="empty-doctors-content">
                  <h3>Doctors are joining TakeCare</h3>

                  <p>
                    Verified doctors will appear here as they become available
                    on the platform.
                  </p>
                </div>

                <div className="empty-doctors-actions">
                  <Link
                    to={isLoggedIn ? "/query" : "/login"}
                    className="empty-doctors-primary"
                  >
                    <FiMessageCircle />
                    Ask TakeCare
                  </Link>

                  <Link
                    to="/search-doctors"
                    className="empty-doctors-secondary"
                  >
                    Explore doctors
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
    ASK TAKECARE
===================================================== */}

        <section className="ask-takecare-section">
          <div className="ask-takecare-card">
            <div className="ask-takecare-icon">
              <FiMessageCircle />
            </div>

            <div className="ask-takecare-content">
              <span className="section-eyebrow">TAKECARE SUPPORT</span>

              <h2>
                Have a question?
                <br />
                <span>Ask TakeCare.</span>
              </h2>

              <p>
                Need help finding a doctor, managing an appointment, or using
                your account? Send your question to the TakeCare administration
                team.
              </p>

              <Link
                to={isLoggedIn ? "/query" : "/login"}
                className="ask-takecare-button"
              >
                Ask TakeCare
                <FiArrowRight />
              </Link>
            </div>

            <div className="ask-takecare-decoration">
              <FiMessageCircle />
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section id="how-it-works" className="how-section">
          <div className="section-centered">
            <span className="section-eyebrow">HOW IT WORKS</span>

            <h2>
              Your healthcare journey,
              <br />
              made effortless.
            </h2>

            <p>
              From finding the right doctor to keeping track of your
              appointments, TakeCare keeps everything simple.
            </p>
          </div>

          <div className="how-grid">
            <div className="how-card">
              <div className="how-number">01</div>

              <div className="how-icon">
                <FiSearch />
              </div>

              <h3>Find a doctor</h3>

              <p>
                Search through approved doctors and find the specialist that
                fits your needs.
              </p>
            </div>

            <div className="how-card active">
              <div className="how-number">02</div>

              <div className="how-icon">
                <FiCalendar />
              </div>

              <h3>Choose your time</h3>

              <p>
                Select an available date and time that works best for your
                schedule.
              </p>
            </div>

            <div className="how-card">
              <div className="how-number">03</div>

              <div className="how-icon">
                <FiCheckCircle />
              </div>

              <h3>Book & manage</h3>

              <p>
                Confirm your appointment and easily track its status from your
                account.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section id="features" className="features-section">
          <div className="features-intro">
            <span className="section-eyebrow">BUILT FOR BETTER CARE</span>

            <h2>
              Everything you need.
              <br />
              Nothing you don't.
            </h2>

            <p>
              TakeCare brings the important parts of your healthcare experience
              together in one place.
            </p>

            <Link to="/register" className="features-button">
              Get started
              <FiArrowRight />
            </Link>
          </div>

          <div className="features-showcase">
            <div className="feature-showcase-card large">
              <div className="showcase-icon teal">
                <FiCalendar />
              </div>

              <div>
                <h3>Simple appointment management</h3>

                <p>
                  View upcoming appointments, check their status, and stay
                  organized without the clutter.
                </p>
              </div>

              <div className="mini-appointment">
                <div className="mini-calendar">24</div>

                <div>
                  <strong>Doctor appointment</strong>
                  <span>Today · 10:30 AM</span>
                </div>

                <span className="status-approved">Approved</span>
              </div>
            </div>

            <div className="feature-showcase-card">
              <div className="showcase-icon purple">
                <FiShield />
              </div>

              <h3>Verified professionals</h3>

              <p>
                Discover doctors who have been reviewed and approved through the
                platform.
              </p>

              <div className="feature-check">
                <FiCheckCircle />
                Verified doctor profiles
              </div>
            </div>

            <div className="feature-showcase-card">
              <div className="showcase-icon blue">
                <FiClock />
              </div>

              <h3>Stay informed</h3>

              <p>Receive notifications when your appointment status changes.</p>

              <div className="notification-preview">
                <FiCheckCircle />
                Appointment approved
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="final-cta">
          <div className="cta-glow"></div>

          <div className="cta-content">
            <span className="section-eyebrow">START WITH TAKECARE</span>

            <h2>
              Your next appointment
              <br />
              starts here.
            </h2>

            <p>
              Find a doctor and take the next step toward simpler healthcare.
            </p>

            <Link to="/register" className="cta-button">
              Get started
              <FiArrowRight />
            </Link>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="landing-footer">
        <div className="footer-brand">
          <Link to="/" className="landing-logo">
            <span className="logo-mark">
              <FiHeart />
            </span>
            TakeCare
          </Link>

          <p>Making healthcare easier, one appointment at a time.</p>
        </div>

        <div className="footer-links">
          <button onClick={() => scrollToSection("doctors")}>Doctors</button>

          <button onClick={() => scrollToSection("how-it-works")}>
            How it works
          </button>

          <Link to="/login">Login</Link>

          <Link to="/register">Register</Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
