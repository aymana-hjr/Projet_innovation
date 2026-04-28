import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiClock, FiBook, FiCheckCircle } from 'react-icons/fi';
import { subjectService } from '../../services/subjectService';
import { configService } from '../../services/configService';

export default function PlanningConfigModal({ isOpen, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [goalInputs, setGoalInputs] = useState({});
  
  const [newSubject, setNewSubject] = useState({ name: '', priority: 'MEDIUM' });
  const [newSlot, setNewSlot] = useState({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '11:00' });
  
  useEffect(() => {
    if (isOpen) {
      loadAll();
    }
  }, [isOpen]);

  const loadAll = async () => {
    try {
      const [sData, aData, gData] = await Promise.all([
        subjectService.getSubjects(),
        configService.getAvailabilities(),
        configService.getGoals()
      ]);
      setSubjects(sData || []);
      setAvailabilities(aData || []);
      setGoals(gData || []);

      const nextGoalInputs = {};
      for (const s of (sData || [])) {
        const goal = (gData || []).find(g => g.subject?.id === s.id);
        nextGoalInputs[s.id] = goal ? String(Math.round(goal.targetMinutesPerWeek / 60)) : '';
      }
      setGoalInputs(nextGoalInputs);
    } catch (err) {
      console.error("Erreur chargement config:", err);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.name) return;
    await subjectService.createSubject(newSubject);
    setNewSubject({ name: '', priority: 'MEDIUM' });
    loadAll();
  };

  const handleDeleteSubject = async (id) => {
    await subjectService.deleteSubject(id);
    loadAll();
  };

  const handleSaveGoal = async (subjectId, hours) => {
    const trimmed = String(hours ?? '').trim();
    if (trimmed === '') return;

    let val = parseInt(trimmed, 10);
    if (Number.isNaN(val) || val < 0) return;
    // garde-fou côté UI (le champ affiche max=20, on applique vraiment la limite)
    val = Math.min(val, 20);
    
    await configService.saveGoal({
      subjectId,
      targetMinutesPerWeek: val * 60
    });
    loadAll();
  };

  const handleAddSlot = async () => {
    await configService.saveAvailability({
      ...newSlot,
      startTime: newSlot.startTime + ":00",
      endTime: newSlot.endTime + ":00"
    });
    loadAll();
  };

  const handleDeleteSlot = async (id) => {
    await configService.deleteAvailability(id);
    loadAll();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Configuration Planning</h2>
            <p className="text-slate-500 text-sm font-medium">Définissez vos matières et votre emploi du temps.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-slate-100 gap-8">
          {['subjects', 'goals', 'availabilities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'subjects' && 'Matières'}
              {tab === 'goals' && 'Objectifs'}
              {tab === 'availabilities' && 'Disponibilités'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-in slide-in-from-bottom-1" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8">
          
          {/* ── MATIÈRES ── */}
          {activeTab === 'subjects' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <input
                  type="text"
                  placeholder="Nom de la matière..."
                  className="px-4 py-3 rounded-xl border border-indigo-200 outline-none focus:ring-2 ring-indigo-500/20 text-sm font-bold"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                />
                <select
                  className="px-4 py-3 rounded-xl border border-indigo-200 text-sm font-bold bg-white"
                  value={newSubject.priority}
                  onChange={(e) => setNewSubject({...newSubject, priority: e.target.value})}
                >
                  <option value="LOW">Priorité Basse</option>
                  <option value="MEDIUM">Priorité Moyenne</option>
                  <option value="HIGH">Priorité Haute</option>
                </select>
                <button
                  onClick={handleAddSubject}
                  className="bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <FiPlus /> Ajouter
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 rounded-full ${s.priority === 'HIGH' ? 'bg-red-400' : s.priority === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <span className="font-bold text-slate-700">{s.name}</span>
                    </div>
                    <button onClick={() => handleDeleteSubject(s.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── OBJECTIFS ── */}
          {activeTab === 'goals' && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              {subjects.length === 0 ? (
                <p className="text-center text-slate-400 py-12 italic">Ajoutez d'abord des matières pour définir des objectifs.</p>
              ) : (
                subjects.map(s => {
                  const goal = goals.find(g => g.subject.id === s.id);
                  const currentHours = goal ? Math.round(goal.targetMinutesPerWeek / 60) : 0;
                  const inputVal = Object.prototype.hasOwnProperty.call(goalInputs, s.id)
                    ? goalInputs[s.id]
                    : String(currentHours || '');
                  return (
                    <div key={s.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                          <FiBook />
                        </div>
                        <span className="font-black text-slate-800 uppercase tracking-tighter">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">Heures / Semaine</span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          className="w-20 px-3 py-2 rounded-lg border border-slate-200 font-bold text-center outline-none focus:ring-2 ring-indigo-500/20"
                          value={inputVal}
                          onChange={(e) => setGoalInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                          onBlur={() => handleSaveGoal(s.id, goalInputs[s.id])}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                        />
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <FiCheckCircle size={16} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── DISPONIBILITÉS ── */}
          {activeTab === 'availabilities' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <select
                  className="px-4 py-3 rounded-xl border border-indigo-200 text-sm font-bold bg-white"
                  value={newSlot.dayOfWeek}
                  onChange={(e) => setNewSlot({...newSlot, dayOfWeek: e.target.value})}
                >
                  <option value="MONDAY">Lundi</option>
                  <option value="TUESDAY">Mardi</option>
                  <option value="WEDNESDAY">Mercredi</option>
                  <option value="THURSDAY">Jeudi</option>
                  <option value="FRIDAY">Vendredi</option>
                  <option value="SATURDAY">Samedi</option>
                  <option value="SUNDAY">Dimanche</option>
                </select>
                <input
                  type="time"
                  className="px-4 py-3 rounded-xl border border-indigo-200 text-sm font-bold outline-none"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                />
                <input
                  type="time"
                  className="px-4 py-3 rounded-xl border border-indigo-200 text-sm font-bold outline-none"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                />
                <button
                  onClick={handleAddSlot}
                  className="bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <FiPlus /> Ajouter
                </button>
              </div>

              <div className="space-y-2">
                {availabilities.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-6">
                      <span className="w-24 text-sm font-black text-slate-800 uppercase tracking-widest">{slot.dayOfWeek}</span>
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-50 px-3 py-1 rounded-full">
                        <FiClock size={14} />
                        {slot.startTime?.slice(0, 5)} - {slot.endTime?.slice(0, 5)}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteSlot(slot.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-white transition-all ring-1 ring-slate-200"
          >
            Fermer
          </button>
          <button
            onClick={() => { onRefresh(); onClose(); }}
            className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}
