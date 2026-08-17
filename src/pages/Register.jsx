import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', location: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return setError('Please fill required fields');
        if (form.password !== form.confirm) return setError('Passwords do not match');
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));
        login(form.email, 'citizen', form.name);
        navigate('/dashboard');
    };

    return (
        <div className="auth-page">
            <div className="auth-bg"><div className="bg-grid" /></div>
            <div className="auth-card animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                        <svg viewBox="0 0 40 40" fill="none" width="48" height="48">
                            <defs>
                                <linearGradient id="regCfGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#00d4ff" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                            <rect width="40" height="40" rx="10" fill="url(#regCfGrad)" fillOpacity="0.15" stroke="url(#regCfGrad)" strokeWidth="1.5" strokeOpacity="0.4" />
                            <path d="M20 7L31 12V20C31 27 25.5 32.5 20 34C14.5 32.5 9 27 9 20V12L20 7Z" fill="url(#regCfGrad)" fillOpacity="0.25" stroke="url(#regCfGrad)" strokeWidth="1.8" />
                            <path d="M15 20L18.5 23.5L25 15" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="auth-title">Create <span>Account</span></h1>
                    <p className="auth-subtitle">Join CivicFix as a Citizen</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}
                    <div className="auth-split">
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mobile *</label>
                            <input className="form-input" placeholder="+91 9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div className="auth-split">
                        <div className="form-group">
                            <label className="form-label">Password *</label>
                            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password *</label>
                            <input className="form-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Location (optional)</label>
                        <input className="form-input" placeholder="City / Area" value={form.location} onChange={e => set('location', e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? <><span className="spinner" /> Creating Account...</> : <><UserPlus size={16} /> Create Account</>}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
