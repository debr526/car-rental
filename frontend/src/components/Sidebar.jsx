import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, Tag, ClipboardList, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/admin/cars', icon: <Car size={20} />, label: 'Manage Cars' },
  { to: '/admin/categories', icon: <Tag size={20} />, label: 'Categories' },
  { to: '/admin/bookings', icon: <ClipboardList size={20} />, label: 'Bookings' },
  { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'A';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Car size={20} /></div>
        <div>
          <div className="sidebar-brand">QuickReserve</div>
          <div className="sidebar-subtitle">Admin Panel</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <span className="sidebar-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div>
            <div className="sidebar-user-name">{user?.full_name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-danger btn-sm btn-full">
          <><LogOut size={16} /> Logout</>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
