import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function TaskCard({ task, onEdit, onDelete }) {
  const isDone = task.status === 'DONE';

  // Extraire le mois et le jour de la date d'échéance
  const dateObj = task.dueDate ? new Date(task.dueDate) : new Date();
  const month = dateObj.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
  const dateNum = dateObj.getDate();

  // Déterminer la couleur de fond du content-box en fonction de la priorité ou du statut
  const getBgColor = () => {
    if (isDone) return 'rgba(16, 185, 129, 0.8)'; // Emeraude pour Terminé
    if (task.priority === 'HIGH') return 'rgba(239, 68, 68, 0.8)'; // Rouge pour Haute
    if (task.priority === 'MEDIUM') return 'rgba(245, 158, 11, 0.8)'; // Ambre pour Moyenne
    return 'rgba(4, 193, 250, 0.732)'; // Bleu par défaut
  };

  return (
    <div className="perspective-1000 w-full p-2 mb-4 group h-full">
      <div className="card h-full min-h-[300px] pt-12 border-4 border-white preserve-3d card-pattern w-full shadow-[0_30px_30px_-10px_rgba(142,142,142,0.3)] transition-all duration-500 ease-in-out group-hover:bg-[-100px_100px,-100px_100px] group-hover:[transform:rotate3d(0.5,1,0,30deg)] flex flex-col relative">
        
        {/* Date Box */}
        <div className="date-box absolute top-8 right-8 h-16 w-16 bg-white border border-[#07b9ff] p-2 preserve-3d [transform:translate3d(0,0,80px)] shadow-[0_17px_10px_-10px_rgba(100,100,111,0.2)] flex flex-col items-center justify-center">
          <span className="month block text-center text-[#04c1fa] text-[10px] font-bold">{month}</span>
          <span className="date block text-center text-[22px] font-black text-[#04c1fa] leading-none">{dateNum}</span>
        </div>

        {/* Content Box */}
        <div className="content-box flex-grow transition-all duration-500 ease-in-out px-6 pt-16 pb-6 preserve-3d" style={{ background: getBgColor() }}>
          
          <span className="card-title block text-white text-2xl font-black transition-all duration-500 preserve-3d [transform:translate3d(0,0,50px)] group-hover:[transform:translate3d(0,0,60px)]">
            {task.title}
          </span>
          
          <p className="card-content mt-2 text-[13px] font-bold text-[#f2f2f2] transition-all duration-500 preserve-3d [transform:translate3d(0,0,30px)] group-hover:[transform:translate3d(0,0,60px)] line-clamp-3">
            {task.description || "Aucune description"}
          </p>

          <div className="flex gap-2 mt-4 preserve-3d [transform:translate3d(0,0,20px)] group-hover:[transform:translate3d(0,0,60px)] transition-all duration-500">
            <button 
              onClick={() => onEdit(task)}
              className="see-more cursor-pointer font-black text-[10px] uppercase text-[#07b9ff] bg-white px-3 py-2 flex items-center gap-2 hover:bg-indigo-50"
            >
              <FiEdit2 className="w-3 h-3" />
              Modifier
            </button>
            <button 
              onClick={() => onDelete(task.id)}
              className="see-more cursor-pointer font-black text-[10px] uppercase text-red-500 bg-white px-3 py-2 flex items-center gap-2 hover:bg-red-50"
            >
              <FiTrash2 className="w-3 h-3" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}