import React from 'react';
import { FiCalendar } from 'react-icons/fi';

export default function TaskStats({ tasks }) {
  const total      = tasks.length;
  const todo       = tasks.filter(t => t.status === 'TODO').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const done       = tasks.filter(t => t.status === 'DONE').length;
  const donePercent = total > 0 ? Math.round((done / total) * 100) : 0;
  const pct = (n) => total > 0 ? Math.round((n / total) * 100) : 0;

  const mini = [
    { label: 'À faire',   value: todo,       color: 'rgba(100,116,139,1)', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)', bar: 'rgba(100,116,139,0.7)', dot: 'rgba(100,116,139,0.55)' },
    { label: 'En cours',  value: inProgress, color: 'rgba(59,130,246,1)',  bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)',  bar: 'rgba(59,130,246,0.75)',  dot: 'rgba(59,130,246,0.55)' },
    { label: 'Terminées', value: done,       color: 'rgba(16,185,129,1)',  bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)',  bar: 'rgba(16,185,129,0.8)',   dot: 'rgba(16,185,129,0.55)' },
  ];

  return (
    <div className="mb-10 flex flex-col gap-3">

      {/* ── Ligne haute : Carte héro + Carte progression ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Carte héro — Total */}
        <div
          className="relative overflow-hidden rounded-[20px] p-6 flex flex-col justify-between"
          style={{ background: 'rgb(16,86,82)', minHeight: 148, boxShadow: '0 8px 28px rgba(16,86,82,0.22)' }}
        >
          <div style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -35, right: -35 }} />
          <div style={{ position: 'absolute', width: 75,  height: 75,  borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -20, left: '55%' }} />

          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <FiCalendar style={{ width: 18, height: 18, color: 'white' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 54, fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: 4 }}>{total}</p>
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              Toutes les tâches
            </p>
          </div>
        </div>

        {/* Carte progression */}
        <div
          className="rounded-[20px] p-6 flex flex-col justify-between"
          style={{ background: 'rgb(255,252,242)', border: '1.5px solid rgba(16,86,82,0.12)', minHeight: 148 }}
        >
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.32)' }}>
            Progression
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ fontSize: 46, fontWeight: 900, color: 'rgb(16,86,82)', lineHeight: 1 }}>{donePercent}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'rgba(16,86,82,0.55)', marginBottom: 4 }}>%</span>
          </div>

          <div>
            <div style={{ height: 6, borderRadius: 99, background: 'rgba(16,86,82,0.1)', overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: `${donePercent}%`, height: '100%', background: 'rgb(16,86,82)', borderRadius: 99, transition: 'width 0.8s ease' }} />
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(16,86,82,0.5)' }}>
              {done} tâche{done > 1 ? 's' : ''} terminée{done > 1 ? 's' : ''} sur {total}
            </p>
          </div>
        </div>
      </div>

      {/* ── 3 mini-cartes statut ── */}
      <div className="grid grid-cols-3 gap-3">
        {mini.map((s, i) => (
          <div
            key={i}
            className="rounded-[16px] p-5 flex flex-col gap-2.5"
            style={{ background: 'rgb(255,252,242)', border: `1.5px solid ${s.border}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.color }}>
                {s.label}
              </span>
            </div>
            <p style={{ fontSize: 38, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <div style={{ height: 3, borderRadius: 99, background: s.bg, overflow: 'hidden' }}>
              <div style={{ width: `${pct(s.value)}%`, height: '100%', background: s.bar, borderRadius: 99, transition: 'width 0.8s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Barre segmentée globale ── */}
      <div
        className="rounded-[16px] px-5 py-4"
        style={{ background: 'rgb(255,252,242)', border: '1.5px solid rgba(16,86,82,0.1)' }}
      >
        <div style={{ display: 'flex', gap: 3, height: 6, borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
          {todo > 0       && <div style={{ flex: todo,       background: 'rgba(100,116,139,0.45)', transition: 'flex 0.8s ease' }} />}
          {inProgress > 0 && <div style={{ flex: inProgress, background: 'rgba(59,130,246,0.55)',  transition: 'flex 0.8s ease' }} />}
          {done > 0       && <div style={{ flex: done,       background: 'rgba(16,185,129,0.75)',  transition: 'flex 0.8s ease' }} />}
          {total === 0    && <div style={{ flex: 1,          background: 'rgba(0,0,0,0.06)' }} />}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: 'À faire',   val: todo,       col: 'rgba(100,116,139,0.8)', sq: 'rgba(100,116,139,0.35)' },
            { label: 'En cours',  val: inProgress, col: 'rgba(59,130,246,0.85)', sq: 'rgba(59,130,246,0.45)' },
            { label: 'Terminées', val: done,        col: 'rgba(16,185,129,0.9)', sq: 'rgba(16,185,129,0.6)' },
          ].map((leg, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: leg.col }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: leg.sq, display: 'inline-block' }} />
              {leg.label} · {leg.val}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}