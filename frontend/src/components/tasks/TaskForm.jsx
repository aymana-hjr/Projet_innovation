import React, { useState, useEffect } from 'react';

export default function TaskForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'TODO',
        priority: initialData.priority || 'MEDIUM',
        dueDate: initialData.dueDate || ''
      });
      setError('');
    } else if (isOpen) {
      setFormData({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });
      setError('');
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { setError('Le titre est requis.'); return; }
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const statusLabels = { TODO: 'À faire', IN_PROGRESS: 'En cours', DONE: 'Terminé' };
  const priorityLabels = { LOW: 'Basse', MEDIUM: 'Moyenne', HIGH: 'Haute' };

  const formattedDate = formData.dueDate
    ? new Date(formData.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  const labelClass = "text-[10px] font-black tracking-[0.12em] uppercase text-[rgba(16,86,82,0.85)]";

  const inputClass = "w-full px-3.5 py-2.5 border-[1.5px] border-[rgba(16,86,82,0.2)] rounded-[10px] bg-[rgb(251,247,235)] text-[13px] font-medium text-gray-900 placeholder:text-black/30 placeholder:font-normal focus:outline-none focus:border-[rgba(16,86,82,0.7)] focus:bg-[rgb(255,252,242)] focus:ring-[3px] focus:ring-[rgba(16,86,82,0.08)] transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[rgb(255,252,242)] rounded-[20px] w-full max-w-[420px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(16,86,82,0.15)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[rgba(16,86,82,0.12)] flex items-center justify-center text-sm">
              📋
            </div>
            <h2 className="text-[11px] font-black tracking-[0.1em] text-gray-900">
              {initialData ? 'MODIFIER LA TÂCHE' : 'NOUVELLE TÂCHE'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/[0.06] flex items-center justify-center text-gray-500 hover:bg-black/[0.12] text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* Erreur */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200/60 rounded-[10px] px-3 py-2.5 text-[11px] font-semibold text-red-700">
              ⚠ {error}
            </div>
          )}

          {/* Titre */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Titre *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Réviser le chapitre 4"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Détails supplémentaires..."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          {/* Statut & Priorité */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer appearance-none bg-[image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23105652' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center] pr-8`}
              >
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="DONE">Terminé</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Priorité</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer appearance-none bg-[image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23105652' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center] pr-8`}
              >
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
              </select>
            </div>
          </div>

          {/* Date d'échéance */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Date d'échéance</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Séparateur */}
          <div className="h-px bg-[rgba(16,86,82,0.1)]" />

          {/* Résumé */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Résumé</label>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 bg-[rgba(16,86,82,0.05)] border border-[rgba(16,86,82,0.1)] rounded-[10px] px-3.5 py-3">
              <span className="text-[11px] font-semibold text-black/45">Statut</span>
              <span className="text-[11px] font-bold text-gray-900 text-right">{statusLabels[formData.status]}</span>
              <span className="text-[11px] font-semibold text-black/45">Priorité</span>
              <span className="text-[11px] font-bold text-gray-900 text-right">{priorityLabels[formData.priority]}</span>
              <span className="text-[11px] font-semibold text-black/45">Échéance</span>
              <span className="text-[11px] font-bold text-gray-900 text-right">{formattedDate}</span>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[rgba(16,86,82,0.12)] bg-[rgba(16,86,82,0.06)] rounded-b-[20px]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[12px] font-semibold text-[rgba(16,86,82,0.8)] px-3.5 py-2 rounded-lg hover:bg-[rgba(16,86,82,0.08)] hover:text-[rgb(16,86,82)] transition-all disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            form=""
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[rgb(16,86,82)] text-white text-[13px] font-bold tracking-[0.02em] shadow-[0_2px_8px_rgba(16,86,82,0.35)] hover:bg-[rgb(12,68,65)] hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(16,86,82,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {isSubmitting ? (
              <>⏳ Sauvegarde...</>
            ) : (
              <>{initialData ? '✏️ Mettre à jour' : '💾 Créer'}</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}