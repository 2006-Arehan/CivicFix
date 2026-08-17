import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home, LayoutDashboard, Map, FileText, Bell, BarChart2,
    Settings, ClipboardList, LogOut, Radio, ChevronLeft, ChevronRight,
    Navigation, Wrench, AlertTriangle, ScanSearch
} from 'lucide-react';
import './Sidebar.css';

const navConfig = {
    citizen: [
        { icon: Home, label: 'Home Page', path: '/' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/citizen/dashboard' },
        { icon: Map, label: 'Map View', path: '/citizen/map' },
        { icon: FileText, label: 'My Reports', path: '/citizen/reports' },
        { icon: Radio, label: 'Report Damage', path: '/citizen/report' },
        { icon: ScanSearch, label: 'Live Detection', path: '/citizen/live-detection' },
        { icon: Navigation, label: 'Safe Route', path: '/citizen/safe-route' },
        { icon: Settings, label: 'Settings', path: '/citizen/settings' },
    ],
    admin: [
        { icon: Home, label: 'Home Page', path: '/' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Map, label: 'City Map', path: '/admin/map' },
        { icon: ClipboardList, label: 'Reports', path: '/admin/reports' },
        { icon: AlertTriangle, label: 'Alerts', path: '/admin/alerts' },
        { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ],
    maintenance: [
        { icon: Home, label: 'Home Page', path: '/' },
        { icon: Wrench, label: 'My Tasks', path: '/maintenance/dashboard' },
        { icon: Map, label: 'Map', path: '/maintenance/map' },
        { icon: Settings, label: 'Settings', path: '/maintenance/settings' },
    ],
};

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = navConfig[user?.role] || navConfig.citizen;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                        <defs>
                            <linearGradient id="sbCfGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#00d4ff" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                        <rect width="40" height="40" rx="10" fill="url(#sbCfGrad)" fillOpacity="0.15" stroke="url(#sbCfGrad)" strokeWidth="1.5" strokeOpacity="0.4" />
                        <path d="M20 7L31 12V20C31 27 25.5 32.5 20 34C14.5 32.5 9 27 9 20V12L20 7Z" fill="url(#sbCfGrad)" fillOpacity="0.25" stroke="url(#sbCfGrad)" strokeWidth="1.8" />
                        <path d="M15 20L18.5 23.5L25 15" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {!collapsed && (
                    <div className="logo-text">
                        <span className="logo-primary">Civic</span>
                        <span className="logo-accent">Fix</span>
                    </div>
                )}
                <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Role Badge */}
            {!collapsed && (
                <div className="role-badge">
                    <span className={`role-pill role-${user?.role}`}>
                        {user?.role === 'admin' ? '🏛️ Admin' : user?.role === 'maintenance' ? '👷 Maintenance' : '🚴 Citizen'}
                    </span>
                </div>
            )}

            {/* Nav Items */}
            <nav className="sidebar-nav">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        title={collapsed ? label : undefined}
                    >
                        <Icon size={18} strokeWidth={2} />
                        {!collapsed && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom — Logout */}
            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
                    <LogOut size={18} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
