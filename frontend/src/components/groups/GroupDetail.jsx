import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiUserPlus, FiUsers, FiCalendar, FiClock, FiShare2, FiLoader } from 'react-icons/fi';
import { groupService } from '../../services/groupService';

export default function GroupDetail({ group, onBack }) {
  const [inviteCode, setInviteCode]     = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(null);
  const [sessions, setSessions]         = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setSessionsLoading(true);
        const data = await groupService.getGroupSessions(group.id);
        setSessions(data || []);
      } catch (err) {
        console.error('Erreur sessions groupe:', err);
      } finally {
        setSessionsLoading(false);
      }
    };
    if (group?.id) fetchSessions();
  }, [group]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    try {
      setInviteLoading(true); setInviteMessage(null);
      await groupService.inviteUser(group.id, inviteCode);
      setInviteMessage({ type: 'success', text: `Invitation envoyée via le code ${inviteCode} !` });
      setInviteCode('');
    } catch (err) {
      setInviteMessage({ type: 'error', text: err.message || "Erreur lors de l'invitation." });
    } finally {
      setInviteLoading(false);
    }
  };

  /* ── Shared styles ── */
  const card = {
    background: 'rgb(255,252,242)',
    border: '1.5px solid rgba(16,86,82,0.12)',
    borderRadius: 20,
    boxShadow: '0 4px 20px rgba(16,86,82,0.06)',
  };

  const sectionTitle = (icon, label, count) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,86,82,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {React.cloneElement(icon, { style: { width: 17, height: 17, color: 'rgb(16,86,82)' } })}
      </div>
      <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#111' }}>
        {label}{count !== undefined ? <span style={{ fontWeight: 600, color: 'rgba(0,0,0,0.35)', marginLeft: 6 }}>({count})</span> : null}
      </span>
    </div>
  );

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid rgba(16,86,82,0.2)', borderRadius: 10,
    background: 'rgb(251,247,235)',
    fontSize: 13, fontWeight: 500, color: '#111',
    outline: 'none', fontFamily: 'inherit',
    transition: 'all 0.25s ease', boxSizing: 'border-box',
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onBack}
          style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: 'rgb(255,252,242)', border: '1.5px solid rgba(16,86,82,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(16,86,82,0.07)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,86,82,0.08)'; e.currentTarget.style.transform = 'translateX(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgb(255,252,242)'; e.currentTarget.style.transform = 'none'; }}
        >
          <FiArrowLeft style={{ width: 18, height: 18, color: 'rgb(16,86,82)' }} />
        </button>

        <div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
            {group.name}
          </h2>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.4)', marginTop: 4 }}>
            {group.description || 'Espace de collaboration'}
          </p>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Colonne gauche ── */}
        <div className="lg:col-span-1 flex flex-col gap-5">

          {/* Inviter */}
          <div style={{ ...card, padding: '24px' }}>
            {sectionTitle(<FiUserPlus />, 'Inviter un membre')}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(16,86,82,0.85)', display: 'block', marginBottom: 6 }}>
                  Code de collaboration
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  placeholder="Ex: 12345678"
                  style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, { borderColor: 'rgba(16,86,82,0.7)', boxShadow: '0 0 0 3px rgba(16,86,82,0.08)', background: 'rgb(255,252,242)' })}
                  onBlur={e => Object.assign(e.target.style, { borderColor: 'rgba(16,86,82,0.2)', boxShadow: 'none', background: 'rgb(251,247,235)' })}
                />
              </div>

              <button
                onClick={handleInvite}
                disabled={inviteLoading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '10px 18px', borderRadius: 10,
                  background: inviteLoading ? 'rgba(16,86,82,0.5)' : 'rgb(16,86,82)',
                  border: 'none', color: 'white',
                  fontSize: 13, fontWeight: 700, cursor: inviteLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(16,86,82,0.3)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => { if (!inviteLoading) { e.currentTarget.style.background = 'rgb(12,68,65)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,86,82,0.38)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={e => { e.currentTarget.style.background = inviteLoading ? 'rgba(16,86,82,0.5)' : 'rgb(16,86,82)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,86,82,0.3)'; e.currentTarget.style.transform = 'none'; }}
              >
                {inviteLoading
                  ? <><FiLoader style={{ width: 15, height: 15 }} className="animate-spin" /> Envoi...</>
                  : <><FiUserPlus style={{ width: 15, height: 15 }} /> Envoyer l'invitation</>
                }
              </button>

              {inviteMessage && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                  ...(inviteMessage.type === 'error'
                    ? { background: 'rgba(200,40,40,0.08)', border: '1px solid rgba(200,40,40,0.2)', color: '#b00' }
                    : { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', color: 'rgb(5,100,70)' }
                  ),
                }}>
                  {inviteMessage.type === 'error' ? '⚠' : '✓'} {inviteMessage.text}
                </div>
              )}
            </div>
          </div>

          {/* Membres */}
          <div style={{ ...card, padding: '24px' }}>
            {sectionTitle(<FiUsers />, 'Membres', group.members?.length ?? 0)}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {group.members?.map(member => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 12,
                    background: 'rgba(16,86,82,0.04)',
                    border: '1px solid rgba(16,86,82,0.08)',
                  }}
                >
                  {/* Avatar initiales */}
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: 'rgb(16,86,82)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 900, letterSpacing: '0.04em',
                  }}>
                    {member.username ? member.username.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{member.username}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Colonne droite : Sessions ── */}
        <div className="lg:col-span-2">
          <div style={{ ...card, padding: '24px', minHeight: '100%' }}>
            {sectionTitle(<FiShare2 />, 'Sessions partagées')}

            {sessionsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
                <FiLoader style={{ width: 28, height: 28, color: 'rgb(16,86,82)' }} className="animate-spin" />
              </div>

            ) : sessions.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '48px 20px', borderRadius: 14,
                background: 'rgba(16,86,82,0.03)',
                border: '1.5px dashed rgba(16,86,82,0.15)',
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,86,82,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <FiCalendar style={{ width: 22, height: 22, color: 'rgba(16,86,82,0.45)' }} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.4)', marginBottom: 6 }}>
                  Aucune session partagée dans ce groupe.
                </p>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.28)' }}>
                  Partagez vos sessions depuis votre planning pour étudier ensemble !
                </p>
              </div>

            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className="group relative overflow-hidden rounded-[14px] transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: 'rgb(255,252,242)',
                      border: '1.5px solid rgba(16,86,82,0.12)',
                      padding: '16px 16px 16px 20px',
                      boxShadow: '0 2px 8px rgba(16,86,82,0.04)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,86,82,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,86,82,0.04)'}
                  >
                    {/* Bande gauche */}
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderRadius: '14px 0 0 14px', background: 'rgb(16,86,82)' }} />

                    {/* Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '3px 9px', borderRadius: 99, background: 'rgba(16,86,82,0.08)', color: 'rgb(16,86,82)', border: '1px solid rgba(16,86,82,0.15)' }}>
                        {session.subject}
                      </span>
                      <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(0,0,0,0.38)', letterSpacing: '0.04em' }}>
                        par {session.sharedByUsername}
                      </span>
                    </div>

                    {/* Titre session */}
                    <h4 style={{ fontSize: 14, fontWeight: 900, color: '#111', marginBottom: 10, lineHeight: 1.3 }}>
                      {session.taskTitle}
                    </h4>

                    {/* Date & heure */}
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,0.38)' }}>
                        <FiCalendar style={{ width: 11, height: 11 }} />
                        {new Date(session.startTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,0.38)' }}>
                        <FiClock style={{ width: 11, height: 11 }} />
                        {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} – {new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}