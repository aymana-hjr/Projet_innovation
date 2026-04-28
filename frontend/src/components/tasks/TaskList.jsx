import React from 'react';
import TaskCard from './TaskCard';
import { FiInbox } from 'react-icons/fi';

export default function TaskList({ tasks, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 flex flex-col items-center justify-center shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <FiInbox className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Aucune tâche trouvée</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Il n'y a aucune tâche correspondant à vos critères. Ajoutez une nouvelle tâche pour commencer ou modifiez vos filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}
