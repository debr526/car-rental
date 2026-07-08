import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ full_name: user?.full_name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/users/${user.id}`, { full_name: form.full_name, email: form.email });
      updateUser(res.data.data.user);
      localStorage.setItem('qr_user', JSON.stringify(res.data.data.user));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.password !== pwForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (pwForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSavingPw(true);
    try {
      await api.put(`/users/${user.id}`, { password: pwForm.password });
      toast.success('Password updated successfully!');
      setPwForm({ password: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setSavingPw(false);
    }
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <div className="main-content">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: 700 }}>
        <h1 className="page-title mb-2">My Profile</h1>
        <p className="page-subtitle mb-4">Manage your account information</p>

        {/* Avatar Card */}
        <div className="glass-card mb-4" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 800, color: 'white', flexShrink: 0,
          }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{user?.full_name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</div>
            <span className="badge badge-available" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <div className="glass-card mb-4" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Personal Information</h2>
          <form onSubmit={handleProfileSave}>
            <div className="grid-2 mb-3">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><div className="spinner spinner-sm" /> Saving...</> : '💾 Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Change Password</h2>
          <form onSubmit={handlePasswordSave}>
            <div className="grid-2 mb-3">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={pwForm.password}
                  onChange={e => setPwForm({ ...pwForm, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={pwForm.confirm}
                  onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={savingPw}>
              {savingPw ? <><div className="spinner spinner-sm" /> Updating...</> : '🔒 Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
