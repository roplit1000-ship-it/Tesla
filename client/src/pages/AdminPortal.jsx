import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminPortal.css';

const API = import.meta.env.DEV ? 'http://localhost:5001' : '';

export default function AdminPortal() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null);
    const [editForm, setEditForm] = useState({ balance: '', profitPercent: '', displayName: '' });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    // Redirect non-admins
    useEffect(() => {
        if (user && !user.isAdmin) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to load users:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token && user?.isAdmin) fetchUsers();
    }, [token, user, fetchUsers]);

    const openEdit = (u) => {
        setEditUser(u);
        setEditForm({
            balance: u.balance.toString(),
            profitPercent: u.profitPercent.toString(),
            displayName: u.displayName,
        });
    };

    const handleSave = async () => {
        if (!editUser) return;
        setSaving(true);
        try {
            const res = await axios.put(`${API}/api/admin/users/${editUser.id}`, {
                balance: parseFloat(editForm.balance) || 0,
                profitPercent: parseFloat(editForm.profitPercent) || 0,
                displayName: editForm.displayName,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(prev => prev.map(u => u.id === editUser.id ? res.data : u));
            setEditUser(null);
            showToast(`${res.data.displayName}'s profile updated successfully`);
        } catch (err) {
            console.error('Save failed:', err);
            showToast('Failed to save changes', true);
        } finally {
            setSaving(false);
        }
    };

    const showToast = (msg, isError = false) => {
        setToast({ msg, isError });
        setTimeout(() => setToast(null), 3000);
    };

    if (!user?.isAdmin) {
        return (
            <div className="admin-denied">
                <div className="admin-denied-icon">🔒</div>
                <h2>Access Denied</h2>
                <p>You don't have admin privileges.</p>
                <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header-left">
                    <div className="admin-badge">⚡ ADMIN</div>
                    <h1>Control Panel</h1>
                    <p>Manage users, balances, and profit margins</p>
                </div>
                <div className="admin-header-right">
                    <div className="admin-stat-card">
                        <span className="admin-stat-num">{users.filter(u => !u.isAdmin).length}</span>
                        <span className="admin-stat-label">Users</span>
                    </div>
                    <div className="admin-stat-card">
                        <span className="admin-stat-num">
                            ${users.filter(u => !u.isAdmin).reduce((sum, u) => sum + (u.balance || 0), 0).toLocaleString()}
                        </span>
                        <span className="admin-stat-label">Total Deposits</span>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="admin-table-section">
                <div className="admin-table-header">
                    <h2>👤 User Management</h2>
                    <span className="admin-table-count">{users.filter(u => !u.isAdmin).length} users</span>
                </div>

                {loading ? (
                    <div className="admin-loading">
                        <div className="admin-spinner" />
                        <span>Loading users...</span>
                    </div>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Balance</th>
                                    <th>Profit %</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(u => !u.isAdmin).map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="admin-user-cell">
                                                <div className="admin-user-avatar">{u.displayName?.charAt(0)?.toUpperCase() || '?'}</div>
                                                <span>{u.displayName}</span>
                                            </div>
                                        </td>
                                        <td className="admin-email">{u.email}</td>
                                        <td>
                                            <span className="admin-balance">${(u.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        </td>
                                        <td>
                                            <span className={`admin-profit ${u.profitPercent >= 0 ? 'up' : 'down'}`}>
                                                {u.profitPercent >= 0 ? '↑' : '↓'} {Math.abs(u.profitPercent || 0).toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="admin-date">
                                            {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td>
                                            <button className="admin-edit-btn" onClick={() => openEdit(u)}>
                                                ✏️ Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editUser && (
                    <motion.div
                        className="admin-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditUser(null)}
                    >
                        <motion.div
                            className="admin-modal"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="admin-modal-header">
                                <h3>Edit User</h3>
                                <button className="admin-modal-close" onClick={() => setEditUser(null)}>✕</button>
                            </div>

                            <div className="admin-modal-user">
                                <div className="admin-user-avatar lg">{editUser.displayName?.charAt(0)?.toUpperCase()}</div>
                                <div>
                                    <div className="admin-modal-name">{editUser.displayName}</div>
                                    <div className="admin-modal-email">{editUser.email}</div>
                                </div>
                            </div>

                            <div className="admin-modal-fields">
                                <div className="admin-field">
                                    <label>Display Name</label>
                                    <input
                                        type="text"
                                        value={editForm.displayName}
                                        onChange={e => setEditForm(f => ({ ...f, displayName: e.target.value }))}
                                    />
                                </div>
                                <div className="admin-field">
                                    <label>Balance ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editForm.balance}
                                        onChange={e => setEditForm(f => ({ ...f, balance: e.target.value }))}
                                    />
                                </div>
                                <div className="admin-field">
                                    <label>Weekly Profit (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editForm.profitPercent}
                                        onChange={e => setEditForm(f => ({ ...f, profitPercent: e.target.value }))}
                                        placeholder="e.g. 2.5 for profit, -1.3 for loss"
                                    />
                                    <span className="admin-field-hint">
                                        Positive = green ↑ profit, Negative = red ↓ loss
                                    </span>
                                </div>
                            </div>

                            <div className="admin-modal-actions">
                                <button className="admin-cancel-btn" onClick={() => setEditUser(null)}>Cancel</button>
                                <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving...' : '💾 Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        className={`admin-toast ${toast.isError ? 'error' : 'success'}`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                    >
                        {toast.isError ? '❌' : '✅'} {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
