import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Users, Globe, ArrowRight } from 'lucide-react';
import { tripService } from '../../services/trip.service.js';
import TripItinerary from '../../components/trip/TripItinerary.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import { usePDF } from '../../hooks/usePDF.js';

export default function SharedTripPage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { exportTripPDF } = usePDF();

  useEffect(() => {
    tripService.getByShareToken(token)
      .then(res => setTrip(res.data.data.trip))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!trip) return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <Globe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Trip not found</h1>
        <p className="text-slate-500 mb-6">This shared trip link may have expired or been made private.</p>
        <Link to="/"><Button>Go Home</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/70 text-sm mb-2">Shared trip by {trip.createdBy?.name}</p>
          <h1 className="text-3xl font-extrabold mb-4">{trip.title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-5 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{trip.city}, {trip.country}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{trip.duration} days</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{trip.travelers} travelers</span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button variant="secondary" className="bg-white text-primary" size="sm" onClick={() => exportTripPDF(trip)}>Export PDF</Button>
            <Link to="/register"><Button className="bg-white/20 text-white border border-white/30" size="sm">Plan My Own Trip <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 py-10">
        {trip.generatedItinerary && <TripItinerary itinerary={trip.generatedItinerary} tripData={trip} />}
      </div>
    </div>
  );
}
