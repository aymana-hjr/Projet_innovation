import React, { useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import { groupService } from '../../services/groupService';

export default function CreateGroupModal({ isOpen, onClose, onGroupCreated }) {
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Le nom du groupe est requis.'); return; }
    try {
      setLoading(true); setError('');
      const newGroup = await groupService.createGroup({ name, description });
      onGroupCreated(newGroup);
      setName(''); setDescription('');
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du groupe');
    } finally {
      setLoading(false);
    }
  };

  const labelClass = {
    fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'rgba(16,86,82,0.85)',
    display: 'block', marginBottom: 6,
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid rgba(16,86,82,0.2)',
    borderRadius: 10,
    background: 'rgb(251,247,235)',
    fontSize: 13, fontWeight: 500, color: '#111',
    outline: 'none', fontFamily: 'inherit',
    transition: 'all 0.25s ease',
    boxSizing: 'border-box',
  };

  const focusStyle  = { borderColor: 'rgba(16,86,82,0.7)', boxShadow: '0 0 0 3px rgba(16,86,82,0.08)', background: 'rgb(255,252,242)' };
  const blurStyle   = { borderColor: 'rgba(16,86,82,0.2)', boxShadow: 'none', background: 'rgb(251,247,235)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,20,30,0.5)', backdropFilter: 'blur(4px)' }}>

      {/* Overlay cliquable */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-[420px] overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ borderRadius: 20, background: 'rgb(255,252,242)', boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.12)' }}
      >

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(16,86,82,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,86,82,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
              👥
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: '#111' }}>
              NOUVEAU GROUPE
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: '#555', transition: 'background 0.2s', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Erreur */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(200,40,40,0.08)', border: '1px solid rgba(200,40,40,0.2)', borderRadius: 10, padding: '9px 12px', fontSize: 11, fontWeight: 600, color: '#b00' }}>
              ⚠ {error}
            </div>
          )}

          {/* Nom */}
          <div>
            <label style={labelClass}>Nom du groupe *</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); if (error) setError(''); }}
              placeholder="Ex: Révisions Mathématiques"
              style={inputStyle}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => Object.assign(e.target.style, blurStyle)}
            />
          </div>

          {/* Séparateur */}
          <div style={{ height: 1, background: 'rgba(16,86,82,0.1)' }} />

          {/* Description */}
          <div>
            <label style={labelClass}>
              Description
              <span style={{ fontWeight: 500, color: 'rgba(0,0,0,0.3)', marginLeft: 6, textTransform: 'none', letterSpacing: 0 }}>(optionnel)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description du groupe..."
              rows={3}
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6, paddingTop: 10, paddingBottom: 10 }}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => Object.assign(e.target.style, blurStyle)}
            />
          </div>

          {/* Résumé */}
          {name.trim() && (
            <div style={{ background: 'rgba(16,86,82,0.05)', border: '1px solid rgba(16,86,82,0.1)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 8px' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)' }}>Nom</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#111', textAlign: 'right', wordBreak: 'break-all' }}>{name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)' }}>Description</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#111', textAlign: 'right' }}>{description.trim() || '—'}</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid rgba(16,86,82,0.12)', background: 'rgba(16,86,82,0.06)', borderRadius: '0 0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: 'rgba(16,86,82,0.8)', cursor: 'pointer', padding: '8px 14px', borderRadius: 8, transition: 'background 0.2s', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,86,82,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 22px', borderRadius: 10,
              background: loading ? 'rgba(16,86,82,0.5)' : 'rgb(16,86,82)',
              border: 'none', color: '#fff',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.02em',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(16,86,82,0.35)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgb(12,68,65)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,86,82,0.4)'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = loading ? 'rgba(16,86,82,0.5)' : 'rgb(16,86,82)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,86,82,0.35)'; }}
          >
            {loading
              ? <><FiLoader style={{ width: 15, height: 15 }} className="animate-spin" /> Création...</>
              : <>👥 Créer le groupe</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}