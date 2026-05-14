import React from 'react';
import { FiUsers, FiArrowRight } from 'react-icons/fi';

export default function GroupList({ groups, onSelectGroup }) {
  if (!groups || groups.length === 0) {
    return (
      <div
        className="rounded-[20px] p-12 flex flex-col items-center justify-center gap-4 text-center"
        style={{ background: 'rgb(255,252,242)', border: '1.5px solid rgba(16,86,82,0.12)' }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(16,86,82,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiUsers style={{ width: 26, height: 26, color: 'rgba(16,86,82,0.55)' }} />
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: '#111', marginBottom: 6 }}>Aucun groupe pour le moment</h3>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.38)', maxWidth: 320 }}>
            Créez un groupe ou attendez une invitation pour commencer à collaborer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="group relative"
          style={{ padding: '20px', perspective: '1000px', cursor: 'pointer' }}
          onClick={() => onSelectGroup(group)}
        >
          {/* Carte 3D */}
          <div
            style={{
              paddingTop: '50px',
              border: '3px solid white',
              borderRadius: '24px',
              transformStyle: 'preserve-3d',
              background: `
                linear-gradient(135deg,#0000 18.75%,#f3f3f3 0 31.25%,#0000 0),
                repeating-linear-gradient(45deg,#f3f3f3 -6.25% 6.25%,#ffffff 0 18.75%)
              `,
              backgroundSize: '60px 60px',
              backgroundColor: '#f0f0f0',
              boxShadow: 'rgba(142,142,142,0.3) 0px 30px 30px -10px',
              transition: 'all 0.5s ease-in-out',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundPosition = '-100px 100px, -100px 100px';
              e.currentTarget.style.transform = 'rotate3d(0.5, 1, 0, 30deg)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundPosition = '0 0, 0 0';
              e.currentTarget.style.transform = 'none';
            }}
          >
            {/* Badge membres — coin haut gauche */}
            <div
              className="absolute top-5 left-5 flex items-center gap-1.5"
              style={{ transform: 'translate3d(0,0,80px)' }}
            >
              <span style={{
                fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: 99,
                background: 'white',
                color: 'rgb(16,86,82)',
                border: '1.5px solid rgba(16,86,82,0.3)',
                boxShadow: 'rgba(100,100,111,0.15) 0px 4px 8px -4px',
              }}>
                👥 {group.members ? group.members.length : 1} membre{(group.members?.length ?? 1) > 1 ? 's' : ''}
              </span>
            </div>

            {/* Icône groupe — coin haut droit */}
            <div
              className="absolute top-4 right-5 flex flex-col items-center justify-center"
              style={{
                width: 52, height: 52,
                background: 'white',
                border: '1.5px solid rgb(16,86,82)',
                borderRadius: '14px',
                transform: 'translate3d(0,0,80px)',
                boxShadow: 'rgba(16,86,82,0.2) 0px 8px 12px -6px',
              }}
            >
              <FiUsers style={{ width: 22, height: 22, color: 'rgb(16,86,82)' }} />
            </div>

            {/* Content box */}
            <div style={{
              background: 'rgba(16,86,82,0.88)',
              padding: '60px 25px 25px',
              transformStyle: 'preserve-3d',
              transition: 'all 0.5s ease-in-out',
              borderRadius: '20px 20px 0 0',
            }}>
              {/* Nom du groupe */}
              <span style={{
                display: 'block', color: 'white',
                fontSize: 18, fontWeight: 900,
                transform: 'translate3d(0,0,50px)',
                transition: 'all 0.5s ease-in-out',
                lineHeight: 1.3, marginBottom: 8,
                letterSpacing: '-0.01em',
              }}>
                {group.name}
              </span>

              {/* Description */}
              <p style={{
                fontSize: 12, fontWeight: 600,
                color: 'rgba(255,255,255,0.7)', lineHeight: 1.55,
                transform: 'translate3d(0,0,30px)',
                transition: 'all 0.5s ease-in-out',
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                marginBottom: 16,
              }}>
                {group.description || 'Aucune description fournie pour ce groupe.'}
              </p>

              {/* Footer CTA */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transform: 'translate3d(0,0,20px)',
                transition: 'all 0.5s ease-in-out',
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 900, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: 'white',
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  borderRadius: 99, padding: '4px 10px',
                }}>
                  Groupe d'étude
                </span>

                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 800,
                  color: 'rgba(255,255,255,0.8)',
                  letterSpacing: '0.04em',
                }}>
                  Voir
                  <FiArrowRight style={{ width: 13, height: 13 }} />
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}