import React from 'react';
import { FiCheck, FiX, FiUsers, FiMail } from 'react-icons/fi';

export default function InvitationsList({ invitations, onAccept, onDecline }) {
  if (!invitations || invitations.length === 0) {
    return (
      <div
        className="rounded-[20px] p-10 flex flex-col items-center justify-center gap-3 text-center"
        style={{ background: 'rgb(255,252,242)', border: '1.5px solid rgba(16,86,82,0.12)' }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,86,82,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiMail style={{ width: 22, height: 22, color: 'rgba(16,86,82,0.45)' }} />
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.35)' }}>
          Vous n'avez aucune invitation en attente.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {invitations.map((inv) => (
        <div
          key={inv.id}
          className="relative overflow-hidden rounded-[18px] transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'rgb(255,252,242)',
            border: '1.5px solid rgba(16,86,82,0.14)',
            boxShadow: '0 2px 12px rgba(16,86,82,0.06)',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(16,86,82,0.11)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(16,86,82,0.06)'}
        >
          {/* Bande latérale gauche */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
            borderRadius: '18px 0 0 18px',
            background: 'linear-gradient(180deg, rgb(16,86,82), rgba(16,185,129,0.8))',
          }} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5" style={{ paddingLeft: 24 }}>

            {/* Gauche : icône + infos */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Icône */}
              <div style={{
                width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                background: 'rgba(16,86,82,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiUsers style={{ width: 20, height: 20, color: 'rgb(16,86,82)' }} />
              </div>

              {/* Texte */}
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 900, color: '#111', marginBottom: 4, lineHeight: 1.2 }}>
                  {inv.groupName}
                </h4>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(16,185,129,0.7)', display: 'inline-block' }} />
                  Invitation de{' '}
                  <span style={{ fontWeight: 800, color: 'rgb(16,86,82)' }}>
                    {inv.senderUsername}
                  </span>
                </p>
              </div>
            </div>

            {/* Droite : boutons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {/* Refuser */}
              <button
                onClick={() => onDecline(inv.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 10,
                  background: 'rgba(200,40,40,0.07)',
                  border: '1.5px solid rgba(200,40,40,0.18)',
                  color: 'rgba(180,30,30,0.85)',
                  fontSize: 12, fontWeight: 800, letterSpacing: '0.02em',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,40,40,0.14)'; e.currentTarget.style.borderColor = 'rgba(200,40,40,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,40,40,0.07)'; e.currentTarget.style.borderColor = 'rgba(200,40,40,0.18)'; }}
              >
                <FiX style={{ width: 14, height: 14 }} />
                Refuser
              </button>

              {/* Accepter */}
              <button
                onClick={() => onAccept(inv.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 10,
                  background: 'rgb(16,86,82)',
                  border: 'none',
                  color: 'white',
                  fontSize: 12, fontWeight: 800, letterSpacing: '0.02em',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 2px 10px rgba(16,86,82,0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgb(12,68,65)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 16px rgba(16,86,82,0.38)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgb(16,86,82)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(16,86,82,0.3)'; }}
              >
                <FiCheck style={{ width: 14, height: 14 }} />
                Accepter
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}