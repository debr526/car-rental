import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users')
      .then(res => setUsers(res.data.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Role update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Manage Users</h1>
              <p className="page-subtitle">{users.length} registered accounts</p>
            </div>
          </div>

          {loading ? <div className="loading-center"><div className="spinner" /></div> : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{u.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: u.role === 'admin'
                              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                              : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 700, color: 'white',
                          }}>
                            {u.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.full_name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={u.role === 'admin' ? 'badge badge-pending' : 'badge badge-approved'}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        {updatingId === u.id ? (
                          <div className="spinner spinner-sm" />
                        ) : (
                          <button
                            className={`btn btn-sm ${u.role === 'admin' ? 'btn-warning' : 'btn-secondary'}`}
                            onClick={() => handleRoleChange(u.id, u.role === 'admin' ? 'customer' : 'admin')}
                          >
                            {u.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
