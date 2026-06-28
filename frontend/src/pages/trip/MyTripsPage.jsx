import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Search, Plus, Trash2, Share2, Filter, SortAsc, Sparkles } from 'lucide-react';
import { tripService } from '../../services/trip.service.js';
import { useTrip } from '../../hooks/useTrip.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { TripCardSkeleton } from '../../components/ui/SkeletonLoader.jsx';
import Input from '../../components/ui/Input.jsx';

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { deleteTrip, shareTrip } = useTrip();

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tripService.getAll({ page, limit: 9, search: search || undefined });
      setTrips(res.data.data.trips);
      setPagination(res.data.data.pagination);
    } catch {}
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!confirm('Delete this trip?')) return;
    const ok = await deleteTrip(id);
    if (ok) setTrips(prev => prev.filter(t => t._id !== id));
  };

  const handleShare = async (e, id) => { e.preventDefault(); await shareTrip(id); };

  const budgetColor = { budget: 'success', moderate: 'warning', luxury: 'default' };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Trips</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{pagination?.total || 0} trip{pagination?.total !== 1 ? 's' : ''} saved</p>
        </div>
        <Link to="/generate"><Button icon={<Plus className="w-4 h-4" />}>New Trip</Button></Link>
      </div>

      <div className="mb-6">
        <Input placeholder="Search trips by city or country…" icon={<Search className="w-4 h-4" />} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <TripCardSkeleton key={i} />)}
        </div>
      ) : trips.length === 0 ? (
        <Card className="p-16 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><MapPin className="w-8 h-8 text-primary" /></div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{search ? 'No trips found' : 'No trips yet'}</h3>
          <p className="text-slate-500 mb-6 text-sm">{search ? 'Try a different search' : 'Generate your first AI-powered trip!'}</p>
          {!search && <Link to="/generate"><Button icon={<Sparkles className="w-4 h-4" />}>Generate a Trip</Button></Link>}
        </Card>
      ) : (
        <>
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip, i) => (
              <motion.div key={trip._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} layout>
                <Link to={`/trips/${trip._id}`}>
                  <Card hover className="overflow-hidden group h-full flex flex-col">
                    <div className="h-40 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">🗺️</div>
                      <div className="absolute top-3 left-3"><Badge variant={budgetColor[trip.budget] || 'default'} className="capitalize">{trip.budget}</Badge></div>
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => handleShare(e, trip._id)} className="w-7 h-7 bg-white/90 dark:bg-slate-700/90 rounded-lg flex items-center justify-center text-slate-600 hover:text-primary transition-colors">
                          <Share2 className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => handleDelete(e, trip._id)} className="w-7 h-7 bg-white/90 dark:bg-slate-700/90 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate">{trip.title}</h3>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-3">
                        <MapPin className="w-3.5 h-3.5" />{trip.city}, {trip.country}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{trip.duration}d</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{trip.travelers}</span>
                        <span className="capitalize ml-auto">{trip.travelStyle}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="text-sm text-slate-500">{page} / {pagination.pages}</span>
              <Button variant="outline" size="sm" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
