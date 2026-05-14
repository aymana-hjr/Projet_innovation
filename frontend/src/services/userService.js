import { fetchApi } from './api';

export const userService = {
  getMe: async () => {
    return fetchApi('/users/me');
  }
};
