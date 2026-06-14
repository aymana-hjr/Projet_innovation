import React, { useState, useEffect } from 'react';
import { FiLoader, FiShare2 } from 'react-icons/fi';
import { groupService } from '../../services/groupService';

export default function ShareSessionModal({ session, isOpen, onClose, onShared }) {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setSuccess('');
    setGroupId('');

    (async () => {
      try {
        setLoadingGroups(true);
        const data = await groupService.getMyGroups();
        setGroups(data || []);
        if (data?.length === 1) setGroupId(String(data[0].id));
      } catch (err) {
        setError(err.message || 'Impossible de charger vos groupes.');
      } finally {
        setLoadingGroups(false);
      }
    })();
  }, [isOpen]);

  if (!isOpen || !session) return null;

  const handleShare = async () => {
    if (!groupId) {
      setError('Sélectionnez un groupe.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await groupService.shareSession(Number(groupId), session.id);
      setSuccess('Session partagée avec succès !');
      onShared?.();
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message || 'Erreur lors du partage.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dt) =>
    new Date(dt).toLocaleString('fr-FR', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit',
    });

  const labelStyle = {
    fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'rgba(16,86,82,0.85)',
    display: 'block', marginBottom: 6,
  };

  const selectStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid rgba(16,86,82,0.2)', borderRadius: 10,
    background: 'rgb(251,247,235)', fontSize: 13, fontWeight: 500,
    color: '#111', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,20,30,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative w-full max-w-[420px] overflow-hidden"
        style={{ borderRadius: 20, background: 'rgb(255,252,242)', boxShadow: '0 24px 48px rgba(0,0,0,0.12)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(16,86,82,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiShare2 style={{ width: 18, height: 18, color: 'rgb(16,86,82)' }} />
            <span style={{ fontSize: 14, fontWeight: 900, color: '#111' }}>Partager la session</span>
          </div>
          <button type="button" onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 16 }}>
            <strong style={{ color: '#111' }}>{session.subjectName}</strong>
            <br />
            {formatTime(session.startDateTime)}
          </p>

          {loadingGroups ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
              <FiLoader className="animate-spin" style={{ width: 24, height: 24, color: 'rgb(16,86,82)' }} />
            </div>
          ) : groups.length === 0 ? (
            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.45)', marginBottom: 16 }}>
              Vous n'avez aucun groupe. Créez-en un depuis l'espace collaboratif.
            </p>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Groupe de destination</label>
              <select value={groupId} onChange={(e) => setGroupId(e.target.value)} style={selectStyle}>
                <option value="">Choisir un groupe…</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div style={{ padding: '9px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600, marginBottom: 12, background: 'rgba(200,40,40,0.08)', border: '1px solid rgba(200,40,40,0.2)', color: '#b00' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '9px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600, marginBottom: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', color: 'rgb(5,100,70)' }}>
              {success}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: 'rgba(16,86,82,0.8)', cursor: 'pointer', padding: '8px 14px' }}>
              Annuler
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={loading || loadingGroups || groups.length === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10,
                background: (loading || loadingGroups || groups.length === 0) ? 'rgba(16,86,82,0.5)' : 'rgb(16,86,82)',
                border: 'none', color: 'white', fontSize: 13, fontWeight: 700,
                cursor: (loading || loadingGroups || groups.length === 0) ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? <><FiLoader className="animate-spin" style={{ width: 14, height: 14 }} /> Partage…</> : 'Partager'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
