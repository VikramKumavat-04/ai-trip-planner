import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Map, Heart, User, Settings, LogOut, Plane, X, Sparkles, BarChart3, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/generate', label: 'Generate Trip', icon: Sparkles, highlight: true },
  { href: '/trips', label: 'My Trips', icon: Map },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300`}>
      <div className="h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg">
            <Plane className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-slate-900 dark:text-white">AI Trip</span>}
          {onClose && <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-600 lg:hidden"><X className="w-4 h-4" /></button>}
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.avatar ? <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" /> : <span className="text-white text-sm font-bold">{user?.name?.[0]?.toUpperCase()}</span>}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          {navItems.map(({ href, label, icon: Icon, highlight }) => {
            const isActive = location.pathname === href;
            return (
              <Link key={href} to={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                    : highlight
                      ? 'text-primary dark:text-primary hover:bg-primary/10 border border-primary/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${highlight && !isActive ? 'text-primary' : ''}`} />
                {!collapsed && <span>{label}</span>}
                {highlight && !isActive && !collapsed && <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">AI</span>}
              </Link>
            );
          })}
          {user?.role === 'admin' && (
            <Link to="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/admin' ? 'bg-purple-500 text-white' : 'text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}>
              <ShieldCheck className="w-4 h-4" />
              {!collapsed && 'Admin'}
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-900/40">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="font-semibold">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
