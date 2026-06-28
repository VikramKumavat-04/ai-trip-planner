import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Sparkles, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { POPULAR_DESTINATIONS, DESTINATION_CATEGORIES } from '../utils/constants.js';
import { userService } from '../services/user.service.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';
import toast from 'react-hot-toast';

export default function DestinationsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);

  const filtered = POPULAR_DESTINATIONS.filter(d => {
    const matchSearch = !search || d.city.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || d.category === activeCategory;
    return matchSearch && matchCat;
  });

  const toggleFav = async (dest) => {
    if (!user) return toast.error('Login to save favorites');
    const key = `${dest.city}, ${dest.country}`;
    if (favorites.includes(key)) {
      await userService.removeFavorite(key);
      setFavorites(prev => prev.filter(f => f !== key));
      toast.success('Removed from favorites');
    } else {
      await userService.addFavorite(key);
      setFavorites(prev => [...prev, key]);
      toast.success('Added to favorites!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-primary/20 to-secondary/10 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold text-white mb-4">
            Explore Destinations
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-300 mb-8">
            Find your next adventure. AI-powered itineraries for every destination.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Input placeholder="Search city or country…" icon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:ring-white/30" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {DESTINATION_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
              }`}>{cat}</button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{filtered.length} destination{filtered.length !== 1 ? 's' : ''} {activeCategory !== 'All' ? `in ${activeCategory}` : ''}</p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No destinations match your search.</p>
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((dest, i) => {
              const key = `${dest.city}, ${dest.country}`;
              const isFav = favorites.includes(key);
              return (
                <motion.div key={dest.city} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} layout>
                  <Card hover className="overflow-hidden group h-full flex flex-col">
                    <div className="relative h-52 flex-shrink-0">
                      <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">{dest.category}</Badge>
                      </div>
                      <button onClick={() => toggleFav(dest)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFav ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-red-500'}`}>
                        ♥
                      </button>
                      <div className="absolute bottom-3 left-3 text-white">
                        <p className="font-bold text-lg leading-tight">{dest.city}</p>
                        <p className="text-sm text-white/80 flex items-center gap-1"><MapPin className="w-3 h-3" />{dest.country}</p>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{dest.rating}</span>
                        </div>
                        <span className="text-xs text-slate-500">{dest.trips} trips planned</span>
                      </div>
                      <Link to={user ? `/generate?city=${dest.city}&country=${dest.country}` : '/register'} className="mt-auto">
                        <Button className="w-full justify-center" size="sm">
                          <Sparkles className="w-3.5 h-3.5" /> Plan This Trip
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
