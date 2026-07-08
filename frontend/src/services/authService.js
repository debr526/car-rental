import api from './api';

const TOKEN_KEY = 'qr_token';
const USER_KEY = 'qr_user';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    const { token, user } = res.data.data;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token, user };
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data.data;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token, user };
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },
};
