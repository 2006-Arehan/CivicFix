import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Camera, MapPin, CheckCircle2, ArrowRight, ShieldCheck,
    AlertCircle, Wrench, Bell, UserCheck, Zap, ChevronRight, Sun, Moon
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleQuickDemo = (role) => {
        const demoCreds = {
            citizen: { email: 'citizen@demo.com', name: 'Citizen User' },
            admin: { email: 'admin@demo.com', name: 'Municipal Admin' },
            maintenance: { email: 'crew@demo.com', name: 'Field Maintenance' }
        };
        const c = demoCreds[role];
        login(c.email, role, c.name);
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'maintenance') navigate('/maintenance/dashboard');
        else navigate('/citizen/dashboard');
    };

    return (
        <div className="landing-page">
            {/* Minimalist Background */}
            <div className="landing-bg">
                <div className="ambient-glow glow-top" />
                <div className="bg-grid-pattern" />
            </div>

            {/* Top Navigation */}
            <header className="landing-header">
                <div className="nav-container">
                    <div className="nav-logo">
                        <div className="logo-icon-box">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                                <defs>
                                    <linearGradient id="navCfGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#00d4ff" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                                <rect width="40" height="40" rx="10" fill="url(#navCfGrad)" fillOpacity="0.15" stroke="url(#navCfGrad)" strokeWidth="1.5" strokeOpacity="0.4" />
                                <path d="M20 7L31 12V20C31 27 25.5 32.5 20 34C14.5 32.5 9 27 9 20V12L20 7Z" fill="url(#navCfGrad)" fillOpacity="0.25" stroke="url(#navCfGrad)" strokeWidth="1.8" />
                                <path d="M15 20L18.5 23.5L25 15" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="logo-brand">Civic<span className="accent">Fix</span></span>
                    </div>

                    <nav className="nav-menu">
                        <a href="#how-it-works">How to Report</a>
                        <a href="#features">Features</a>
                        <a href="#demo">Try Demo</a>
                    </nav>

                    <div className="nav-actions">
                        {/* Night / Bright Mode Toggle */}
                        <button
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Night Mode'}
                            aria-label="Toggle theme mode"
                        >
                            {theme === 'dark' ? (
                                <>
                                    <Sun size={15} color="#ffdd57" />
                                    <span>Bright Mode</span>
                                </>
                            ) : (
                                <>
                                    <Moon size={15} color="#4f46e5" />
                                    <span>Night Mode</span>
                                </>
                            )}
                        </button>

                        {user ? (
                            <Link to="/dashboard" className="btn-primary-sm">
                                Open Dashboard <ArrowRight size={15} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary-sm">
                                    Sign Up <ArrowRight size={15} />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section - Focused directly on Problem Reporting */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-badge">
                        <AlertCircle size={14} className="badge-icon" />
                        <span>Road Hazard Reporting Platform</span>
                    </div>

                    <h1 className="hero-title">
                        Spot a Pothole or Road Hazard? <br />
                        <span className="highlight-text">Report It & Get It Fixed.</span>
                    </h1>

                    <p className="hero-subtitle">
                        CivicFix makes it effortless for citizens to report road damage, track repair progress in real time, and help city crews fix hazards fast.
                    </p>

                    <div className="hero-cta-group">
                        {user ? (
                            <Link to="/citizen/report" className="cta-btn-main">
                                <Camera size={18} /> Report a Problem Now
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="cta-btn-main">
                                    <Camera size={18} /> Report a Problem
                                </Link>
                                <Link to="/login" className="cta-btn-secondary">
                                    Sign In / Track Report <ChevronRight size={18} />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Quick Demo Access Bar */}
                    <div className="quick-demo-box">
                        <span className="demo-box-label"><Zap size={14} /> Quick Demo Access:</span>
                        <div className="demo-pills-list">
                            <button onClick={() => handleQuickDemo('citizen')} className="demo-pill-btn">
                                🚴 Citizen Reporter
                            </button>
                            <button onClick={() => handleQuickDemo('admin')} className="demo-pill-btn">
                                🏛️ City Admin
                            </button>
                            <button onClick={() => handleQuickDemo('maintenance')} className="demo-pill-btn">
                                👷 Repair Crew
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3-Step Simple How It Works */}
            <section id="how-it-works" className="steps-section">
                <div className="section-title-box">
                    <span className="subhead">Simple 3-Step Process</span>
                    <h2>How You Report & Fix Road Hazards</h2>
                </div>

                <div className="steps-cards-grid">
                    <div className="step-box">
                        <div className="step-icon-bg">
                            <Camera size={26} color="#00d4ff" />
                        </div>
                        <div className="step-num">Step 1</div>
                        <h3>1. Snap & Upload</h3>
                        <p>Take a quick photo of the pothole or road damage on your phone and add brief details.</p>
                    </div>

                    <div className="step-box">
                        <div className="step-icon-bg">
                            <MapPin size={26} color="#3b82f6" />
                        </div>
                        <div className="step-num">Step 2</div>
                        <h3>2. Auto Location Pin</h3>
                        <p>Your report is automatically mapped with exact GPS coordinates on the city hazard tracker.</p>
                    </div>

                    <div className="step-box">
                        <div className="step-icon-bg">
                            <CheckCircle2 size={26} color="#10b981" />
                        </div>
                        <div className="step-num">Step 3</div>
                        <h3>3. Fixed & Updated</h3>
                        <p>Municipal repair crews get dispatched, fix the damage, and send you live status updates.</p>
                    </div>
                </div>
            </section>

            {/* Civic Quote Section */}
            <section className="quote-banner-section">
                <div className="quote-banner">
                    <p className="quote-text">
                        "A safer, smoother road starts with a single report from a citizen who cares."
                    </p>
                    <span className="quote-sub">— CivicFix Road Safety Initiative</span>
                </div>
            </section>

            {/* Key Utility Features */}
            <section id="features" className="features-section">
                <div className="section-title-box">
                    <span className="subhead">Core Features</span>
                    <h2>Everything Built for Faster Problem Resolution</h2>
                </div>

                <div className="features-grid">
                    <div className="feature-item">
                        <div className="f-icon"><Camera size={22} color="#00d4ff" /></div>
                        <h3>Fast Photo Reporting</h3>
                        <p>Upload road damage photos instantly with automatic location tagging and severity notes.</p>
                    </div>

                    <div className="feature-item">
                        <div className="f-icon"><MapPin size={22} color="#3b82f6" /></div>
                        <h3>Live Hazard Tracker</h3>
                        <p>View all active potholes and road hazards reported across your neighborhood on an interactive map.</p>
                    </div>

                    <div className="feature-item">
                        <div className="f-icon"><Bell size={22} color="#f59e0b" /></div>
                        <h3>Real-Time Repair Status</h3>
                        <p>Receive notifications when your report is reviewed, dispatched to crews, and marked resolved.</p>
                    </div>

                    <div className="feature-item">
                        <div className="f-icon"><Wrench size={22} color="#10b981" /></div>
                        <h3>Direct Crew Dispatch</h3>
                        <p>Municipal repair teams receive clear work orders with GPS directions directly to the hazard site.</p>
                    </div>
                </div>
            </section>

            {/* Direct Call-to-Action Entry Card */}
            <section id="demo" className="cta-section">
                <div className="cta-card">
                    <h2>Ready to Report a Road Problem?</h2>
                    <p>Join citizens and city teams working together for safer streets.</p>
                    <div className="cta-buttons">
                        <Link to="/register" className="btn-primary-lg">
                            Sign Up to Report <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn-secondary-lg">
                            Sign In to Existing Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <span>Civic<span className="accent">Fix</span></span>
                        <p>Community Road Damage Reporting System</p>
                    </div>
                    <div className="footer-links">
                        <Link to="/login">Sign In</Link>
                        <Link to="/register">Sign Up</Link>
                        <Link to="/citizen/report">Report Damage</Link>
                    </div>
                </div>
                <div className="footer-copy">
                    &copy; {new Date().getFullYear()} CivicFix. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
