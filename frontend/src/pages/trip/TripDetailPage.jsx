import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, DollarSign, Share2, Download, Trash2, ArrowLeft, Calendar, Globe, Edit3 } from 'lucide-react';
import { tripService } from '../../services/trip.service.js';
import { useTrip } from '../../hooks/useTrip.js';
import { usePDF } from '../../hooks/usePDF.js';
import TripItinerary from '../../components/trip/TripItinerary.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteTrip, shareTrip } = useTrip();
  const { exportTripPDF } = usePDF();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    tripService.getById(id)
      .then(res => setTrip(res.data.data.trip))
      .catch(() => toast.error('Trip not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    setDeleting(true);
    const ok = await deleteTrip(id);
    if (ok) navigate('/trips');
    else setDeleting(false);
  };

  const handleShare = () => shareTrip(id);
  const handlePDF = () => exportTripPDF(trip);

  if (loading) return <div className="flex items-center justify-center min-h-96"><LoadingSpinner size="lg" text="Loading trip..." /></div>;
  if (!trip) return <div className="flex items-center justify-center min-h-96"><p className="text-slate-500">Trip not found</p></div>;

  const isOwner = trip.createdBy?._id === user?._id || trip.createdBy === user?._id;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to trips
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent 60%)' }} />
        <div className="relative">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-white/20 text-white border-white/30 border">{trip.travelStyle}</Badge>
            <Badge className="bg-white/20 text-white border-white/30 border capitalize">{trip.budget}</Badge>
            {trip.isPublic && <Badge className="bg-green-500/30 text-white border-green-400/30 border">Public</Badge>}
          </div>
          <h1 className="text-3xl font-extrabold mb-2">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{trip.city}, {trip.country}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{trip.duration} days</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}</span>
            {trip.startDate && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(trip.startDate).toLocaleDateString()}</span>}
          </div>
          {trip.interests?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {trip.interests.map(i => <span key={i} className="text-xs bg-white/20 px-2.5 py-1 rounded-full capitalize">{i}</span>)}
            </div>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      {isOwner && (
        <div className="flex flex-wrap gap-3 mb-8">
          <Button variant="outline" size="sm" onClick={handleShare} icon={<Share2 className="w-4 h-4" />}>Share</Button>
          <Button variant="outline" size="sm" onClick={handlePDF} icon={<Download className="w-4 h-4" />}>Export PDF</Button>
          <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting} icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
        </div>
      )}

      {/* Itinerary */}
      {trip.generatedItinerary ? (
        <TripItinerary itinerary={trip.generatedItinerary} tripData={trip} />
      ) : (
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-12 text-center">
          <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">No itinerary generated yet.</p>
        </div>
      )}
    </div>
  );
}
