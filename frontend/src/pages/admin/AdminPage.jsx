import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Map, Trash2, Search, ShieldCheck, TrendingUp, Calendar } from 'lucide-react';
import api from '../../services/api.js';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { Skeleton } from '../../components/ui/SkeletonLoader.jsx';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/users'), api.get('/admin/trips')])
      .then(([s, u, t]) => { setStats(s.data.data); setUsers(u.data.data.users); setTrips(t.data.data.trips); })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
    toast.success('User deleted');
  };

  const handleDeleteTrip = async (id) => {
    if (!confirm('Delete this trip?')) return;
    await api.delete(`/admin/trips/${id}`);
    setTrips(prev => prev.filter(t => t._id !== id));
    toast.success('Trip deleted');
  };

  const filteredUsers = users.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  const TABS = [{ id: 'overview', label: 'Overview', icon: TrendingUp }, { id: 'users', label: 'Users', icon: Users }, { id: 'trips', label: 'Trips', icon: Map }];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Manage users and platform content</p>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />) :
              [['Total Users', stats?.totalUsers, Users], ['Total Trips', stats?.totalTrips, Map], ['Recent Users', stats?.recentUsers?.length, Calendar], ['Recent Trips', stats?.recentTrips?.length, TrendingUp]]
                .map(([label, value, Icon]) => (
                  <Card key={label} className="p-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3"><Icon className="w-5 h-5 text-primary" /></div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value ?? '—'}</p>
                    <p className="text-xs text-slate-500 mt-1">{label}</p>
                  </Card>
                ))
            }
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Recent Users</h3>
              <div className="space-y-3">
                {stats?.recentUsers?.map(u => (
                  <div key={u._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">{u.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>
                    <Badge variant={u.role === 'admin' ? 'warning' : 'default'} className="text-xs capitalize">{u.role}</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Recent Trips</h3>
              <div className="space-y-3">
                {stats?.recentTrips?.map(t => (
                  <div key={t._id}>
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{t.title}</p>
                    <p className="text-xs text-slate-500">{t.createdBy?.name} · {t.city}, {t.country}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {tab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-4"><Input placeholder="Search users…" icon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} /></div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-200 dark:border-slate-700">
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">{u.name[0]}</div><span className="font-medium text-slate-800 dark:text-white">{u.name}</span></div></td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3"><Badge variant={u.role === 'admin' ? 'warning' : 'outline'} className="capitalize">{u.role}</Badge></td>
                      <td className="px-4 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{u.role !== 'admin' && <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {tab === 'trips' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-200 dark:border-slate-700">
                  {['Title', 'Destination', 'Created By', 'Date', 'Delete'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {trips.map(t => (
                    <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-white max-w-xs truncate">{t.title}</td>
                      <td className="px-4 py-3 text-slate-500">{t.city}, {t.country}</td>
                      <td className="px-4 py-3 text-slate-500">{t.createdBy?.name}</td>
                      <td className="px-4 py-3 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><button onClick={() => handleDeleteTrip(t._id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
