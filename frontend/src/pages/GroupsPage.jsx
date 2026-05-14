import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLoader, FiLogOut, FiPlus, FiMessageCircle, FiBell } from 'react-icons/fi';

import { groupService } from '../services/groupService';
import { userService } from '../services/userService';

import GroupList from '../components/groups/GroupList';
import CreateGroupModal from '../components/groups/CreateGroupModal';
import InvitationsList from '../components/groups/InvitationsList';
import GroupDetail from '../components/groups/GroupDetail';

export default function GroupsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('groups'); // 'groups' ou 'invitations'
  const [groups, setGroups] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [fetchedGroups, fetchedInvitations, userData] = await Promise.all([
        groupService.getMyGroups(),
        groupService.getMyPendingInvitations(),
        userService.getMe()
      ]);
      setGroups(fetchedGroups || []);
      setInvitations(fetchedInvitations || []);
      setCurrentUser(userData);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données.');
      if (err.message.includes('session')) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchData();
  }, [fetchData, navigate]);

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };
  const goToDashboard = () => { navigate('/dashboard'); };

  const handleGroupCreated = (newGroup) => {
    setGroups([...groups, newGroup]);
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await groupService.acceptInvitation(invitationId);
      // Rafraîchir les données
      fetchData();
    } catch (err) {
      alert(err.message || "Erreur lors de l'acceptation de l'invitation");
    }
  };

  const handleDeclineInvitation = async (invitationId) => {
    try {
      await groupService.declineInvitation(invitationId);
      setInvitations(invitations.filter(i => i.id !== invitationId));
    } catch (err) {
      alert(err.message || "Erreur lors du refus de l'invitation");
    }
  };

  if (loading && groups.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(245,242,232)' }}>
        <div className="flex flex-col items-center gap-4 text-emerald-800">
          <FiLoader className="w-10 h-10 animate-spin" />
          <p className="font-bold text-sm tracking-widest uppercase">Chargement de l'espace collaboratif...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans pb-16 relative overflow-x-hidden" style={{ background: 'rgb(245,242,232)' }}>
      {/* Fond décoratif doux */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(16,86,82,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'rgba(16,86,82,0.05)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'rgba(16,185,129,0.05)', filter: 'blur(80px)' }} />
      </div>

      {/* Navbar */}
      <nav className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-[24px] border border-white/40 shadow-[0_8px_32px_rgba(16,86,82,0.08)]" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)' }}>
          <div className="flex justify-between items-center h-16 px-6">
            
            <div className="flex items-center gap-6 group cursor-pointer" onClick={goToDashboard}>
              <div className="relative w-9 h-9 bg-[#105652] rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg">
                <span className="text-white font-black text-xs tracking-tighter">SP</span>
              </div>
              <span className="font-black text-lg tracking-tighter text-slate-900 group-hover:text-emerald-700 transition-colors hidden sm:block">
                Retour au Dashboard
              </span>
            </div>

            <div className="flex items-center gap-6">
              {currentUser && currentUser.collaborationCode && (
                <div 
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(currentUser.collaborationCode);
                    alert('Code copié dans le presse-papier !');
                  }}
                  title="Cliquez pour copier"
                >
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Mon Code :</span>
                  <span className="text-sm font-black text-emerald-800 tracking-widest">{currentUser.collaborationCode}</span>
                </div>
              )}

              <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors">
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm font-bold hidden sm:inline">Quitter</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        
        {/* Banner */}
        <div className="relative mb-12 bg-[#105652] rounded-[40px] overflow-hidden p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/50 to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6 text-white text-[10px] font-bold uppercase tracking-widest">
                <FiMessageCircle className="w-3 h-3" /> Espace Collaboratif
              </div>
              <h1 className="text-white font-black text-4xl md:text-5xl leading-tight mb-4 tracking-tight">
                Étudiez en <span className="text-emerald-300">Équipe.</span>
              </h1>
              <p className="text-emerald-100/80 text-lg max-w-xl">
                Partagez vos sessions, suivez la progression de vos amis et restez motivés ensemble.
              </p>
            </div>

            {!selectedGroup && (
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-3 px-8 py-4 bg-white text-emerald-900 font-black rounded-full hover:scale-105 hover:bg-emerald-50 transition-all shadow-xl shadow-white/10 flex-shrink-0"
              >
                <FiPlus className="w-5 h-5" />
                <span>Nouveau Groupe</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-semibold flex items-center gap-3">
            <span>{error}</span>
          </div>
        )}

        {/* View Switcher: Detail vs List */}
        {selectedGroup ? (
          <GroupDetail group={selectedGroup} onBack={() => setSelectedGroup(null)} />
        ) : (
          <div className="space-y-8">
            
            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-300/50 pb-px">
              <button
                onClick={() => setActiveTab('groups')}
                className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-colors relative ${activeTab === 'groups' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Mes Groupes
                {activeTab === 'groups' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full"></div>}
              </button>
              
              <button
                onClick={() => setActiveTab('invitations')}
                className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'invitations' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Invitations
                {invitations.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {invitations.length}
                  </span>
                )}
                {activeTab === 'invitations' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full"></div>}
              </button>
            </div>

            {/* Content */}
            <div className="animate-in fade-in duration-500">
              {activeTab === 'groups' ? (
                <GroupList groups={groups} onSelectGroup={setSelectedGroup} />
              ) : (
                <div className="max-w-3xl">
                  <InvitationsList 
                    invitations={invitations} 
                    onAccept={handleAcceptInvitation} 
                    onDecline={handleDeclineInvitation} 
                  />
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      <CreateGroupModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onGroupCreated={handleGroupCreated} 
      />
    </div>
  );
}
