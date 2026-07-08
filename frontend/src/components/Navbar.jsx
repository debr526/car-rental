import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">🚗</div>
          <span className="gradient-text">QuickReserve</span>
        </Link>

        <ul className="navbar-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/cars">Cars</NavLink></li>
          {user && !isAdmin && (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/my-bookings">My Bookings</NavLink></li>
            </>
          )}
          {isAdmin && (
            <li><NavLink to="/admin/dashboard">Admin Panel</NavLink></li>
          )}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <>
              <div className="user-menu">
                <div className="user-avatar">{initials}</div>
                <span>{user.full_name?.split(' ')[0]}</span>
              </div>
              {!isAdmin && (
                <Link to="/profile" className="btn btn-secondary btn-sm">Profile</Link>
              )}
              <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
