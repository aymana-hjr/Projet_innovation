import React from 'react';
import { FiClock, FiBookOpen, FiZap, FiShare2, FiCheckCircle } from 'react-icons/fi';

export default function StudySessionsList({ sessions, onShare }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div
        className="rounded-[20px] p-10 flex flex-col items-center justify-center gap-3 text-center"
        style={{ background: 'rgb(255,252,242)', border: '1.5px solid rgba(16,86,82,0.12)' }}
      >
        <div
          style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,86,82,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FiBookOpen style={{ width: 22, height: 22, color: 'rgba(16,86,82,0.5)' }} />
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.01em' }}>
          Aucune session d'étude planifiée pour cette semaine.
        </p>
      </div>
    );
  }

  const formatTime = (dt) =>
    new Date(dt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const formatDate = (dt) =>
    new Date(dt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });

  const durationMin = (start, end) =>
    Math.round((new Date(end) - new Date(start)) / 60000);

  // Dans StudySessionsList.jsx, ajoute une fonction pour valider
const handleComplete = async (sessionId) => {
  const mins = prompt("Combien de minutes avez-vous réellement étudié ?");
  if (mins) {
    await fetch(`http://localhost:8080/api/planning/sessions/${sessionId}/complete?actualMinutes=${mins}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    window.location.reload(); // Pour rafraîchir la liste
  }
};
  return (
    <div className="flex flex-col gap-3">
      {sessions.map((session) => {
        const isAI = session.isGenerated;
        const dur  = durationMin(session.startDateTime, session.endDateTime);

        return (
          <div
            key={session.id}
            className="group relative overflow-hidden rounded-[18px] flex items-center gap-4 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'rgb(255,252,242)',
              border: '1.5px solid rgba(16,86,82,0.12)',
              boxShadow: '0 2px 12px rgba(16,86,82,0.05)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,86,82,0.1)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(16,86,82,0.05)'}
          >
            {/* Bande gauche colorée */}
            <div
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: 4, borderRadius: '18px 0 0 18px',
                background: isAI ? 'rgb(16,86,82)' : 'rgba(59,130,246,0.7)',
              }}
            />

            {/* Icône */}
            <div
              style={{
                width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                background: isAI ? 'rgba(16,86,82,0.1)' : 'rgba(59,130,246,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isAI
                ? <FiZap style={{ width: 20, height: 20, color: 'rgb(16,86,82)' }} />
                : <FiBookOpen style={{ width: 20, height: 20, color: 'rgba(59,130,246,0.9)' }} />
              }
            </div>

            {/* Infos principales */}
            <div className="flex-1 min-w-0">
              <h4 style={{ fontSize: 14, fontWeight: 900, color: '#111', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session.subjectName}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiClock style={{ width: 11, height: 11, color: 'rgba(0,0,0,0.3)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {formatTime(session.startDateTime)} – {formatTime(session.endDateTime)}
                </span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(0,0,0,0.2)', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.04em' }}>
                  {dur} min
                </span>
              </div>
            </div>

            {/* Droite : badge + date + partager */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
              <span
                style={{
                  fontSize: 9, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '4px 10px', borderRadius: 99,
                  background: isAI ? 'rgba(16,86,82,0.1)' : 'rgba(59,130,246,0.1)',
                  color: isAI ? 'rgb(16,86,82)' : 'rgba(59,130,246,0.9)',
                  border: `1px solid ${isAI ? 'rgba(16,86,82,0.2)' : 'rgba(59,130,246,0.2)'}`,
                }}
              >
                {isAI ? '✦ IA' : 'Manuel'}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.3)', textTransform: 'capitalize' }}>
                {formatDate(session.startDateTime)}
              </span>
              {onShare && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onShare(session); }}
                  title="Partager dans un groupe"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    marginTop: 4, padding: '5px 10px', borderRadius: 8,
                    background: 'rgba(16,86,82,0.08)', border: '1px solid rgba(16,86,82,0.2)',
                    color: 'rgb(16,86,82)', fontSize: 10, fontWeight: 800,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <FiShare2 style={{ width: 11, height: 11 }} />
                  Partager
                </button>
              )}

              {/* Bouton de validation */}
              {!session.completed ? (
                <button
                  onClick={() => handleComplete(session.id)}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                >
                  Valider la session
                </button>
              ) : (
                <div className="mt-2 flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                  <FiCheckCircle className="w-3 h-3" /> Terminée ({session.actualDurationMinutes} min)
                </div>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
}