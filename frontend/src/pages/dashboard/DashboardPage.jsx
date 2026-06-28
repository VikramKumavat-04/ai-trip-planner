import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Clock, Globe, ArrowRight, TrendingUp, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { tripService } from '../../services/trip.service.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { TripCardSkeleton } from '../../components/ui/SkeletonLoader.jsx';

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, tripsRes] = await Promise.all([
          tripService.getStats(),
          tripService.getAll({ limit: 6 }),
        ]);
        setStats(statsRes.data.data);
        setTrips(tripsRes.data.data.trips);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { label: 'Total Trips', value: stats?.totalTrips ?? '—', icon: MapPin, color: 'from-primary to-secondary', bg: 'from-primary/10 to-secondary/10' },
    { label: 'Countries Visited', value: stats?.countriesVisited ?? '—', icon: Globe, color: 'from-accent to-blue-500', bg: 'from-accent/10 to-blue-500/10' },
    { label: 'Days Planned', value: trips.reduce((a, t) => a + (t.duration || 0), 0) || '—', icon: Calendar, color: 'from-orange-400 to-pink-500', bg: 'from-orange-400/10 to-pink-500/10' },
    { label: 'AI Generations', value: trips.length || '—', icon: Sparkles, color: 'from-purple-500 to-indigo-500', bg: 'from-purple-500/10 to-indigo-500/10' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {greeting}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your travel overview.</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} variants={fadeUp}>
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{loading ? '…' : value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 bg-gradient-to-br ${color} bg-clip-text`} style={{ color: 'transparent', WebkitBackgroundClip: 'text' }} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white, transparent 60%)' }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Ready for your next adventure?</h2>
            <p className="text-white/80 text-sm mt-1">Let AI plan your perfect trip in seconds.</p>
          </div>
          <Link to="/generate">
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 flex-shrink-0">
              <Sparkles className="w-4 h-4" /> Generate Trip <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Recent Trips */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Trips</h2>
        <Link to="/trips" className="text-sm text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <TripCardSkeleton key={i} />)}
        </div>
      ) : trips.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No trips yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Generate your first AI-powered itinerary!</p>
          <Link to="/generate"><Button><Sparkles className="w-4 h-4" /> Generate First Trip</Button></Link>
        </Card>
      ) : (
        <motion.div initial="hidden" animate="show" variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip) => (
            <motion.div key={trip._id} variants={fadeUp}>
              <Link to={`/trips/${trip._id}`}>
                <Card hover className="overflow-hidden group">
                  <div className="h-36 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">🗺️</div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="default" className="text-xs">{trip.budget}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate">{trip.title}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{trip.city}, {trip.country}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{trip.duration}d</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{trip.travelStyle}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}

          <motion.div variants={fadeUp}>
            <Link to="/generate">
              <Card className="h-full min-h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-colors flex items-center justify-center group cursor-pointer">
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-primary/10 flex items-center justify-center mx-auto mb-3 transition-colors">
                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-primary">New Trip</p>
                </div>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
