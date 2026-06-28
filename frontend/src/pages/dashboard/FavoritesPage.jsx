import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Trash2, Sparkles, Plus } from 'lucide-react';
import { userService } from '../../services/user.service.js';
import { POPULAR_DESTINATIONS } from '../../utils/constants.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getFavorites()
      .then(res => setFavorites(res.data.data.favorites))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (destination) => {
    try {
      await userService.removeFavorite(destination);
      setFavorites(prev => prev.filter(f => f !== destination));
      toast.success('Removed from favorites');
    } catch { toast.error('Failed to remove'); }
  };

  const handleAdd = async (destination) => {
    if (favorites.includes(destination)) return toast('Already in favorites', { icon: '💛' });
    try {
      await userService.addFavorite(destination);
      setFavorites(prev => [...prev, destination]);
      toast.success('Added to favorites!');
    } catch { toast.error('Failed to add'); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Favorites</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{favorites.length} saved destination{favorites.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Saved Favorites */}
      {favorites.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Your Saved Destinations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map((dest, i) => {
              const match = POPULAR_DESTINATIONS.find(d => `${d.city}, ${d.country}` === dest || d.city === dest);
              return (
                <motion.div key={dest} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Card hover className="overflow-hidden group">
                    {match ? (
                      <>
                        <div className="relative h-40">
                          <img src={match.image} alt={match.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                          <button onClick={() => handleRemove(dest)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                            <Heart className="w-4 h-4 fill-white" />
                          </button>
                          <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-bold">{match.city}</p>
                            <p className="text-xs text-white/80">{match.country}</p>
                          </div>
                        </div>
                        <div className="p-3 flex justify-between items-center">
                          <span className="text-xs text-slate-500">{match.category}</span>
                          <Link to={`/generate?city=${match.city}&country=${match.country}`}>
                            <Button size="sm" variant="ghost" className="text-xs h-7 px-2"><Sparkles className="w-3 h-3" /> Plan</Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div>
                            <span className="font-semibold text-slate-800 dark:text-white text-sm">{dest}</span>
                          </div>
                          <button onClick={() => handleRemove(dest)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Discover */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Discover Destinations</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_DESTINATIONS.map((dest, i) => {
            const key = `${dest.city}, ${dest.country}`;
            const isFav = favorites.includes(key);
            return (
              <motion.div key={dest.city} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card hover className="overflow-hidden group">
                  <div className="relative h-44">
                    <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                    <button onClick={() => isFav ? handleRemove(key) : handleAdd(key)}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFav ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-red-500'}`}>
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                    </button>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="font-bold">{dest.city}</p>
                      <p className="text-xs text-white/80 flex items-center gap-1"><MapPin className="w-3 h-3" />{dest.country}</p>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-xs text-slate-500">{dest.category} · ⭐ {dest.rating}</span>
                    <Link to={`/generate?city=${dest.city}&country=${dest.country}`}>
                      <Button size="sm" variant="ghost" className="text-xs h-7 px-2"><Sparkles className="w-3 h-3" /> Plan</Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {favorites.length === 0 && !loading && (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">No favorites yet. Click the heart icon on any destination above!</p>
        </div>
      )}
    </div>
  );
}
