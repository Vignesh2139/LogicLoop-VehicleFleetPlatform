import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Search, Bell, Truck, ClipboardList, Building2, CheckCircle } from 'lucide-react';
import './Header.css';

export default function Header() {
    const { currentUser } = useAuth();
    const { stats } = useData();

    const statItems = [
        { icon: Truck, label: 'Fleet', value: stats.totalVehicles, color: '#3b82f6' },
        { icon: ClipboardList, label: 'Active Tasks', value: stats.activeTasks, color: '#f59e0b' },
        { icon: Building2, label: 'Organizations', value: stats.totalOrgs, color: '#8b5cf6' },
        { icon: CheckCircle, label: 'Completed', value: stats.completedTasks, color: '#10b981' },
    ];

    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const date = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <header className="top-header">
            <div className="header-left">
                <div className="header-date">
                    <span className="header-day">{day}</span>
                    <span className="header-full-date">{date}</span>
                </div>
            </div>

            <div className="header-stats">
                {statItems.map((item, i) => (
                    <div key={i} className="header-stat" style={{ '--stat-color': item.color }}>
                        <item.icon size={16} />
                        <div>
                            <span className="stat-value">{item.value}</span>
                            <span className="stat-label">{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="header-right">
                <div className="header-search">
                    <Search size={16} />
                    <input type="text" placeholder="Search fleet, tasks..." />
                </div>
                <button className="header-notification">
                    <Bell size={18} />
                    <span className="notification-dot"></span>
                </button>
                <div className="header-user-compact">
                    <span>{currentUser?.avatar}</span>
                </div>
            </div>
        </header>
    );
}
