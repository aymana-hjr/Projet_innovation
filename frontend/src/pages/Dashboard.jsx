import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { planningService } from '../services/planningService';

import TaskStats from '../components/tasks/TaskStats';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import StudySessionsList from '../components/tasks/StudySessionsList';
import PlanningConfigModal from '../components/tasks/PlanningConfigModal';

import { FiPlus, FiAlertCircle, FiLoader, FiLogOut, FiCalendar, FiCpu, FiSettings } from 'react-icons/fi';

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: 'ALL', priority: 'ALL', sortByDesc: true, search: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // États Planning
  const [sessions, setSessions] = useState([]);
  const [isPlanningLoading, setIsPlanningLoading] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Helper pour obtenir le lundi cible (cette semaine, ou la suivante si on est le week-end)
  const formatLocalDateYYYYMMDD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Si on est Samedi (6) ou Dimanche (0), on vise le lundi suivant
    // Sinon on prend le lundi de la semaine en cours
    let diff;
    if (day === 0) {
      diff = 1; // Demain
    } else if (day === 6) {
      diff = 2; // Après-demain
    } else {
      diff = 1 - day; // Lundi passé ou aujourd'hui
    }
    
    const target = new Date(date);
    target.setDate(date.getDate() + diff);
    // IMPORTANT: ne pas utiliser toISOString() (UTC) sinon décalage possible d'un jour.
    return formatLocalDateYYYYMMDD(target);
  };

  const weekStart = useMemo(() => getMonday(new Date()), []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true); setError('');
      const data = await taskService.getTasks();
      setTasks(data || []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des tâches');
      if (err.message.includes('session')) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await planningService.getWeekSessions(weekStart);
      setSessions(data || []);
    } catch (err) {
      console.error("Erreur chargement planning:", err);
    }
  }, [weekStart]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchTasks();
    fetchSessions();
  }, [navigate, fetchTasks, fetchSessions]);

  const handleGeneratePlan = async () => {
    try {
      setIsPlanningLoading(true);
      const response = await planningService.generatePlan(weekStart);
      alert(response.message); // Affiche le résultat (succès ou ce qui manque)
      await fetchSessions();
    } catch (err) {
      alert(err.message || "Erreur lors de la génération du planning");
    } finally {
      setIsPlanningLoading(false);
    }
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];
    if (filters.status !== 'ALL') result = result.filter(t => t.status === filters.status);
    if (filters.priority !== 'ALL') result = result.filter(t => t.priority === filters.priority);
    if (filters.search?.trim()) result = result.filter(t => t.title?.toLowerCase().includes(filters.search.toLowerCase()));
    result.sort((a, b) => {
      if (!a.dueDate) return 1; if (!b.dueDate) return -1;
      const diff = new Date(a.dueDate) - new Date(b.dueDate);
      return filters.sortByDesc ? -diff : diff;
    });
    return result;
  }, [tasks, filters]);

  const handleOpenCreate = () => { setEditingTask(null); setIsFormOpen(true); };
  const handleOpenEdit = (task) => { setEditingTask(task); setIsFormOpen(true); };

  const handleSubmitForm = async (formData) => {
    if (editingTask) {
      const updated = await taskService.updateTask(editingTask.id, formData);
      setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
    } else {
      const created = await taskService.createTask(formData);
      setTasks([...tasks, created]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await taskService.deleteTask(id);
        setTasks(tasks.filter(t => t.id !== id));
      } catch (err) {
        alert(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(250,248,240)' }}>
        <div className="flex flex-col items-center gap-4" style={{ color: 'rgb(16,86,82)' }}>
          <FiLoader className="w-10 h-10 animate-spin" />
          <p className="font-bold text-sm tracking-widest uppercase">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-sans pb-16 relative overflow-x-hidden"
      style={{ background: 'rgb(245,242,232)' }}
    >

      {/* ── Fond décoratif doux ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grille de points */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(16,86,82,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        {/* Blobs crème/teal très subtils */}
        <div style={{
          position: 'absolute', top: '-15%', left: '-10%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'rgba(16,86,82,0.06)', filter: 'blur(120px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: '45vw', height: '45vw', borderRadius: '50%',
          background: 'rgba(16,185,129,0.07)', filter: 'blur(100px)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          width: '30vw', height: '30vw', borderRadius: '50%',
          background: 'rgba(251,243,228,0.8)', filter: 'blur(80px)',
        }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-7xl mx-auto rounded-[24px] transition-all duration-300 border border-white/40 shadow-[0_8px_32px_rgba(16,86,82,0.08)]"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex justify-between items-center h-16 px-6">

            {/* Logo Section */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-9 h-9 bg-[#105652] rounded-xl flex items-center justify-center transform group-hover:rotate-[10deg] transition-transform duration-300 shadow-lg">
                  <span className="text-white font-black text-xs tracking-tighter">SP</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tighter text-slate-900 leading-none">
                  StudyPlanner
                </span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] leading-none mt-1">
                  Dashboard
                </span>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex items-center gap-6">
              {/* On peut ajouter des liens discrets ici si besoin */}
              <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

              <button
                onClick={handleLogout}
                className="group relative flex items-center gap-2 px-5 py-2 overflow-hidden rounded-xl transition-all duration-300"
              >
                {/* Effet de fond au survol */}
                <div className="absolute inset-0 bg-red-50 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>

                <FiLogOut className="relative w-4 h-4 text-slate-500 group-hover:text-red-500 transition-colors" />
                <span className="relative text-sm font-bold text-slate-600 group-hover:text-red-600 transition-colors">
                  Quitter
                </span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">

        {/* ── Hero Banner Nouvelle Génération ── */}
        <div className="relative mb-16 group">
          {/* Effet d'aura lumineuse derrière la bannière */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[40px] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

          <div
            className="relative rounded-[40px] overflow-hidden p-8 md:p-16 bg-[#105652]"
            style={{
              boxShadow: '0 25px 50px -12px rgba(16, 86, 82, 0.4)',
            }}
          >
            {/* Background Design : Cercles Concentriques au lieu des textures basiques */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full border-[1px] border-white/10" />
              <div className="absolute top-[-5%] right-[0%] w-[400px] h-[400px] rounded-full border-[1px] border-white/5" />
              <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="max-w-3xl">
                {/* Badge Premium */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-emerald-400">
                    System Priority v2.0
                  </span>
                </div>

                {/* Titre Typographique */}
                <h1 className="text-white font-black leading-[1] mb-6 tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                  Dominez votre <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-100">
                    Temps.
                  </span>
                </h1>

                <p className="text-emerald-100/60 text-lg md:text-xl max-w-xl font-light leading-relaxed">
                  Ne vous contentez pas de gérer vos tâches. <strong className="text-white font-semibold">Propulsez</strong> votre productivité avec une interface conçue pour la performance pure.
                </p>
              </div>

              {/* CTA Ultra-Commercial */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleOpenCreate}
                  className="relative group/btn flex items-center gap-6 pl-8 pr-2 py-2 overflow-hidden rounded-full bg-white transition-all duration-500 hover:pr-8 hover:bg-emerald-500 active:scale-95 shadow-2xl shadow-white/10"
                >
                  <span className="font-black text-emerald-900 group-hover/btn:text-white transition-colors duration-300 text-base uppercase tracking-wider">
                    Lancer une Mission
                  </span>

                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full transition-all duration-500 group-hover/btn:bg-white group-hover/btn:rotate-[360deg]">
                    <FiPlus className="w-6 h-6 text-white group-hover/btn:text-emerald-500" />
                  </div>
                </button>

                {/* Petit texte de réassurance sous le bouton */}
                <p className="text-center mt-4 text-emerald-400/50 text-[11px] font-medium uppercase tracking-widest">
                  Action instantanée
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div
            className="mb-6 flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-semibold"
            style={{ background: 'rgba(200,40,40,0.08)', border: '1px solid rgba(200,40,40,0.2)', color: '#b00' }}
          >
            <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Composants */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
          
          <TaskStats tasks={tasks} />

          {/* ── Section Planning Hebdomadaire ── */}
          <section className="bg-white/50 backdrop-blur-xl rounded-[40px] p-8 md:p-10 border border-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                  <FiCalendar className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Planning Hebdomadaire</h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Semaine du {new Date(weekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsConfigOpen(true)}
                  className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all shadow-sm"
                  title="Configurer mes matières et dispos"
                >
                  <FiSettings className="w-6 h-6" />
                </button>

                <button 
                  onClick={handleGeneratePlan}
                  disabled={isPlanningLoading}
                  className="flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50"
                >
                  {isPlanningLoading ? <FiLoader className="animate-spin" /> : <FiCpu className="w-5 h-5" />}
                  <span>Générer mon planning</span>
                </button>
              </div>
            </div>

            <StudySessionsList sessions={sessions} />
          </section>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Liste des Missions</h2>
            </div>
            <TaskFilters filters={filters} setFilters={setFilters} />
            <TaskList tasks={filteredAndSortedTasks} onEdit={handleOpenEdit} onDelete={handleDelete} />
          </div>
        </div>

      </main>

      {/* Modal Planning Config */}
      <PlanningConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onRefresh={() => fetchSessions()}
      />

      {/* Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingTask}
      />
    </div>
  );
}