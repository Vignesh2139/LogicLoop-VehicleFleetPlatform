import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { users } from '../data/mockData';
import { Zap, Shield, ChevronRight, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import './Login.css';

export default function Login() {
    const { login } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);

    const handleLogin = () => {
        if (selectedUser) {
            login(selectedUser);
        }
    };

    const roleIcons = {
        admin: '👨‍💼',
        manager: '👩‍💻',
        driver: '👩‍✈️'
    };

    const roleDescriptions = {
        admin: 'Full platform access across all organizations',
        manager: 'Manage fleet & tasks for your organization',
        driver: 'View assigned vehicle and active tasks'
    };

    return (
        <div className="login-page">
            <div className="login-bg-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
                <div className="shape shape-3" />
            </div>

            <motion.div
                className="login-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="login-header">
                    <div className="login-logo">
                        <Zap size={28} />
                    </div>
                    <h1>FleetCommand</h1>
                    <p>Fleet Governance & Scheduling Platform</p>
                </div>

                <div className="login-subtitle">
                    <Shield size={14} />
                    <span>Select a role to explore the platform</span>
                </div>

                <div className="login-users">
                    {users.map((user, index) => (
                        <motion.div
                            key={user.id}
                            className={`login-user-card ${selectedUser === user.id ? 'selected' : ''}`}
                            onClick={() => setSelectedUser(user.id)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="login-user-avatar">{user.avatar}</div>
                            <div className="login-user-details">
                                <h3>{user.name}</h3>
                                <p className="login-user-title">{user.title}</p>
                                <p className="login-user-desc">{roleDescriptions[user.role]}</p>
                            </div>
                            <div className={`login-role-badge role-${user.role}`}>
                                {user.role}
                            </div>
                            <ChevronRight size={18} className="login-arrow" />
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    className="login-btn"
                    onClick={handleLogin}
                    disabled={!selectedUser}
                    whileHover={selectedUser ? { scale: 1.02 } : {}}
                    whileTap={selectedUser ? { scale: 0.98 } : {}}
                >
                    <Truck size={18} />
                    <span>Enter FleetCommand</span>
                </motion.button>

                <p className="login-footer-text">
                    Multi-tenant fleet management with role-based visibility control
                </p>
            </motion.div>
        </div>
    );
}
