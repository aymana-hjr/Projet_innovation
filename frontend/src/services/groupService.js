import { fetchApi } from './api';

export const groupService = {
  createGroup: async (data) => {
    return fetchApi('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyGroups: async () => {
    return fetchApi('/groups/my');
  },

  inviteUser: async (groupId, receiverCode) => {
    return fetchApi(`/groups/${groupId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ receiverCode }),
    });
  },

  getMyPendingInvitations: async () => {
    return fetchApi('/groups/invitations/pending');
  },

  acceptInvitation: async (invitationId) => {
    return fetchApi(`/groups/invitations/${invitationId}/accept`, {
      method: 'POST',
    });
  },

  declineInvitation: async (invitationId) => {
    return fetchApi(`/groups/invitations/${invitationId}/decline`, {
      method: 'POST',
    });
  },

  shareSession: async (groupId, studySessionId) => {
    return fetchApi(`/groups/${groupId}/sessions/${studySessionId}/share`, {
      method: 'POST',
    });
  },

  getGroupSessions: async (groupId) => {
    return fetchApi(`/groups/${groupId}/sessions`);
  }
};
