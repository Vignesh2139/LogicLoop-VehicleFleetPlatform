import { createContext, useContext, useState, useCallback } from 'react';
import {
    vehicles as initialVehicles,
    tasks as initialTasks,
    organizations as initialOrgs,
    scheduleHistory as initialHistory
} from '../data/mockData';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const { canSeeVehicle, canSeeOrg, currentUser } = useAuth();

    const [vehicles, setVehicles] = useState(initialVehicles);
    const [tasks, setTasks] = useState(initialTasks);
    const [organizations] = useState(initialOrgs);
    const [history, setHistory] = useState(initialHistory);

    // Filtered data based on auth
    const visibleVehicles = vehicles.filter(v => canSeeVehicle(v));
    const visibleTasks = tasks.filter(t => canSeeOrg(t.orgId));
    const visibleOrgs = organizations.filter(o => canSeeOrg(o.id));

    // Vehicle CRUD
    const addVehicle = useCallback((vehicle) => {
        const newVehicle = {
            ...vehicle,
            id: `v-${Date.now()}`,
            status: 'available',
            healthScore: 100,
            mileage: 0,
            location: vehicle.location || { lat: 19.076, lng: 72.877, address: 'Default Location' }
        };
        setVehicles(prev => [...prev, newVehicle]);
        return newVehicle;
    }, []);

    const updateVehicle = useCallback((id, updates) => {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    }, []);

    const removeVehicle = useCallback((id) => {
        setVehicles(prev => prev.filter(v => v.id !== id));
    }, []);

    // Task CRUD
    const addTask = useCallback((task) => {
        const newTask = {
            ...task,
            id: `t-${Date.now()}`,
            status: 'pending',
            assignedVehicle: null,
            createdAt: new Date().toISOString(),
            orgId: task.orgId || currentUser?.orgId
        };
        setTasks(prev => [...prev, newTask]);
        return newTask;
    }, [currentUser]);

    const updateTask = useCallback((id, updates) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }, []);

    const assignVehicleToTask = useCallback((taskId, vehicleId, score, reasons) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, assignedVehicle: vehicleId, status: 'in-progress' } : t
        ));
        setVehicles(prev => prev.map(v =>
            v.id === vehicleId ? { ...v, status: 'in-transit' } : v
        ));
        setHistory(prev => [...prev, {
            id: `s-${Date.now()}`,
            taskId,
            vehicleId,
            score,
            assignedAt: new Date().toISOString(),
            status: 'active',
            explanation: reasons || []
        }]);
    }, []);

    // Stats
    const stats = {
        totalVehicles: visibleVehicles.length,
        availableVehicles: visibleVehicles.filter(v => v.status === 'available').length,
        inTransit: visibleVehicles.filter(v => v.status === 'in-transit').length,
        maintenance: visibleVehicles.filter(v => v.status === 'maintenance').length,
        totalTasks: visibleTasks.length,
        pendingTasks: visibleTasks.filter(t => t.status === 'pending').length,
        activeTasks: visibleTasks.filter(t => t.status === 'in-progress').length,
        completedTasks: visibleTasks.filter(t => t.status === 'completed').length,
        totalOrgs: visibleOrgs.length,
        evCount: visibleVehicles.filter(v => v.fuelType === 'Electric').length
    };

    return (
        <DataContext.Provider value={{
            vehicles: visibleVehicles,
            allVehicles: vehicles,
            tasks: visibleTasks,
            organizations: visibleOrgs,
            history,
            stats,
            addVehicle,
            updateVehicle,
            removeVehicle,
            addTask,
            updateTask,
            assignVehicleToTask
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within DataProvider');
    return context;
}
