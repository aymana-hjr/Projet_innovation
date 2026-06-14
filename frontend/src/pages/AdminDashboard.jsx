import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiUsers, FiUserCheck, FiUserX, FiLayers, FiClock,
  FiTarget, FiCheckCircle, FiShield, FiEdit2, FiSave, FiX
} from 'react-icons/fi';
import { adminService } from '../services/adminService';
import { userService } from '../services/userService';

const ROLE_OPTIONS = [
  { value: 'ROLE_USER', label: 'Utilisateur' },
  { value: 'ROLE_ADMIN', label: 'Administrateur' },
];

function isAdminUser(me) {
  return me?.authorities?.some(
    (a) => (a.authority || a) === 'ROLE_ADMIN'
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stats');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', email: '', enabled: true, roles: ['ROLE_USER'] });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError('');
      const [statsData, usersData] = await Promise.all([
        adminService.getGlobalStats(),
        adminService.getUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData || []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    userService.getMe()
      .then((me) => {
        if (!isAdminUser(me)) {
          navigate('/dashboard');
          return;
        }
        fetchData();
      })
      .catch(() => navigate('/login'));
  }, [navigate, fetchData]);

  const openEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      enabled: user.enabled,
      roles: [...user.roles],
    });
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditForm({ fullName: '', email: '', enabled: true, roles: ['ROLE_USER'] });
  };

  const toggleRole = (role) => {
    setEditForm((prev) => {
      const hasRole = prev.roles.includes(role);
      const roles = hasRole
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles: roles.length ? roles : ['ROLE_USER'] };
    });
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      setSaving(true);
      setError('');
      const updated = await adminService.updateUser(editingUser.id, editForm);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      closeEdit();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const roleLabel = (role) => {
    if (role === 'ROLE_ADMIN') return 'Administrateur';
    if (role === 'ROLE_USER') return 'Utilisateur';
    return role;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full"
        />
        <p className="text-emerald-900 font-bold tracking-widest uppercase text-xs animate-pulse">
          Chargement du panneau admin...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF7] relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-amber-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-2 text-slate-500 hover:text-emerald-700 font-bold transition-all mb-4"
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <FiArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-sm">Retour au dashboard</span>
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              Panneau <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-emerald-600">
                Administrateur
              </span>
            </h1>
          </div>

          <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/80 shadow-sm inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <FiShield />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Accès</p>
              <p className="font-bold text-amber-900">Administrateur</p>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-2 p-1 bg-white/80 backdrop-blur rounded-2xl border border-slate-100 w-fit">
          <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
            Statistiques globales
          </TabButton>
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            Gestion utilisateurs
          </TabButton>
        </div>

        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Utilisateurs" value={stats.totalUsers} icon={<FiUsers />} color="from-teal-500 to-emerald-600" subtitle={`${stats.newUsersLast7Days} nouveaux (7j)`} />
            <StatCard title="Comptes actifs" value={stats.activeUsers} icon={<FiUserCheck />} color="from-blue-500 to-indigo-600" subtitle={`${stats.disabledUsers} désactivés`} />
            <StatCard title="Tâches totales" value={stats.totalTasks} icon={<FiLayers />} color="from-violet-500 to-purple-600" subtitle={`${stats.totalGroups} groupes`} />
            <StatCard title="Heures d'étude" value={`${stats.totalStudyHours}h`} icon={<FiClock />} color="from-amber-400 to-orange-500" subtitle="Toutes sessions complétées" />
            <StatCard title="Sessions planifiées" value={stats.totalSessions} icon={<FiTarget />} color="from-emerald-400 to-teal-500" subtitle={`${stats.completedSessions} terminées`} />
            <StatCard title="Taux de complétion" value={`${stats.completionRate}%`} icon={<FiCheckCircle />} color="from-rose-400 to-pink-500" subtitle="Global plateforme" />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-[36px] border border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Utilisateurs inscrits</h2>
              <span className="text-sm font-bold text-slate-400">{users.length} compte(s)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-8 py-4">Utilisateur</th>
                    <th className="px-4 py-4">Rôles</th>
                    <th className="px-4 py-4">Statut</th>
                    <th className="px-4 py-4">Inscription</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-slate-100 hover:bg-emerald-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <p className="font-bold text-slate-900">{user.fullName}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                role === 'ROLE_ADMIN'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {roleLabel(role)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        {user.enabled ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-sm">
                            <FiUserCheck className="w-4 h-4" /> Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-bold text-sm">
                            <FiUserX className="w-4 h-4" /> Désactivé
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-5 text-sm text-slate-500 font-medium">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="p-2 rounded-xl hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Modifier"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Modifier l'utilisateur</h3>
              <button onClick={closeEdit} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Nom complet">
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </Field>
              <Field label="Statut du compte">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.enabled}
                    onChange={(e) => setEditForm({ ...editForm, enabled: e.target.checked })}
                    className="w-5 h-5 rounded accent-emerald-600"
                  />
                  <span className="font-medium text-slate-700">Compte actif</span>
                </label>
              </Field>
              <Field label="Rôles">
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleRole(opt.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        editForm.roles.includes(opt.value)
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={closeEdit}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
        active
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl shadow-lg mb-6`}>
        {icon}
      </div>
      <p className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 mb-2">{title}</p>
      <p className="text-3xl font-black text-slate-900">{value}</p>
      {subtitle && <p className="text-xs font-medium text-slate-500 mt-2">{subtitle}</p>}
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{label}</label>
      {children}
    </div>
  );
}
