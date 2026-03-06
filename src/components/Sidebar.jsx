import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import {
    LayoutDashboard,
    Truck,
    Building2,
    ClipboardList,
    Brain,
    BarChart3,
    LogOut,
    Zap,
    Shield
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'manager', 'driver'] },
    { path: '/fleet', icon: Truck, label: 'Fleet Registry', roles: ['admin', 'manager', 'driver'] },
    { path: '/organizations', icon: Building2, label: 'Organizations', roles: ['admin'] },
    { path: '/tasks', icon: ClipboardList, label: 'Task Manager', roles: ['admin', 'manager'] },
    { path: '/engine', icon: Brain, label: 'Scheduling Engine', roles: ['admin', 'manager'] },
    { path: '/reports', icon: BarChart3, label: 'Reports', roles: ['admin', 'manager'] },
];

export default function Sidebar() {
    const { currentUser, logout, isAdmin } = useAuth();
    const location = useLocation();

    const filteredNav = navItems.filter(item =>
        item.roles.includes(currentUser?.role)
    );

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    <Zap size={22} />
                </div>
                <div>
                    <h2>FleetCommand</h2>
                    <span className="sidebar-version">v2.0</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section-label">Main Menu</div>
                {filteredNav.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                        end={item.path === '/'}
                    >
                        <item.icon size={19} />
                        <span>{item.label}</span>
                        {item.path === '/engine' && (
                            <span className="nav-badge-ai">AI</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-bottom">
                {isAdmin && (
                    <div className="sidebar-admin-badge">
                        <Shield size={14} />
                        <span>Admin Access</span>
                    </div>
                )}
                <div className="sidebar-user">
                    <div className="sidebar-avatar"><Icon name={currentUser?.avatar} size={24} /></div>
                    <div className="sidebar-user-info">
                        <p className="sidebar-username">{currentUser?.name}</p>
                        <p className="sidebar-role">{currentUser?.title}</p>
                    </div>
                </div>
                <button className="sidebar-logout" onClick={logout}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
