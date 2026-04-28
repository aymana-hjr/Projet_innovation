import React, { useState } from 'react';
import { FiSearch, FiChevronDown, FiSliders, FiXCircle, FiFilter } from 'react-icons/fi';

export default function TaskFilters({ filters, setFilters }) {
  const [open, setOpen] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const activeCount = [
    filters.status !== 'ALL',
    filters.priority !== 'ALL',
  ].filter(Boolean).length;

  // Classe élégante pour les selects
  const selectClass = `
    w-full appearance-none cursor-pointer
    px-4 py-2.5 pr-10
    bg-white/50 border border-slate-200
    rounded-xl text-[13px] font-bold text-slate-700
    focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50
    transition-all duration-300
    bg-[image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23105652' stroke-width='3'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")]
    bg-no-repeat bg-[right_12px_center]
  `;

  return (
    <div className="mb-8 space-y-4">
      {/* ── Barre de Recherche & Actions Principales ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        
        {/* Recherche Style "Input Luxe" */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FiSearch className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input
            type="text"
            name="search"
            value={filters.search || ''}
            onChange={handleFilterChange}
            placeholder="Rechercher un projet, une mission..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-[20px] text-sm font-medium shadow-sm shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Bouton de Filtre Avancé */}
        <button
          onClick={() => setOpen(o => !o)}
          className={`flex items-center justify-center gap-3 px-6 py-3.5 rounded-[20px] font-bold text-sm transition-all duration-300 ${
            open 
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
            : 'bg-white text-slate-700 border border-slate-100 hover:border-emerald-200 shadow-sm shadow-slate-200/50'
          }`}
        >
          <FiFilter className={`w-4 h-4 ${open ? 'animate-pulse' : ''}`} />
          <span>Filtres</span>
          {activeCount > 0 && (
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${open ? 'bg-white text-emerald-600' : 'bg-emerald-600 text-white'}`}>
              {activeCount}
            </span>
          )}
          <FiChevronDown className={`w-4 h-4 transition-transform duration-500 ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Tri Rapide */}
        <div className="relative min-w-[220px]">
          <select
            name="sortByDesc"
            value={filters.sortByDesc?.toString()}
            onChange={e => setFilters(prev => ({ ...prev, sortByDesc: e.target.value === 'true' }))}
            className="w-full appearance-none bg-white border border-slate-100 px-5 py-3.5 pr-12 rounded-[20px] text-sm font-bold text-slate-700 shadow-sm shadow-slate-200/50 focus:outline-none focus:border-emerald-200 transition-all cursor-pointer bg-[image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22M7 15l5 5 5-5%22/%3E%3Cpath d=%22M7 9l5-5 5 5%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_16px_center]"
          >
            <option value="false">Échéance la plus proche</option>
            <option value="true">Échéance la plus lointaine</option>
          </select>
        </div>
      </div>

      {/* ── Panneau de Filtres Détaché ── */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[28px] flex flex-wrap gap-6 items-end">
            
            {/* Statut */}
            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                État de progression
              </label>
              <select name="status" value={filters.status} onChange={handleFilterChange} className={selectClass}>
                <option value="ALL">Toutes les étapes</option>
                <option value="TODO">À planifier</option>
                <option value="IN_PROGRESS">En cours d'exécution</option>
                <option value="DONE">Missions accomplies</option>
              </select>
            </div>

            {/* Priorité */}
            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Niveau d'urgence
              </label>
              <select name="priority" value={filters.priority} onChange={handleFilterChange} className={selectClass}>
                <option value="ALL">Toutes les priorités</option>
                <option value="LOW">Basse priorité</option>
                <option value="MEDIUM">Priorité standard</option>
                <option value="HIGH">Urgence critique</option>
              </select>
            </div>

            {/* Bouton Reset avec icône */}
            {activeCount > 0 && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, status: 'ALL', priority: 'ALL' }))}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-black text-red-500 hover:bg-red-50 transition-all duration-300"
              >
                <FiXCircle className="w-4 h-4" />
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}