import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, MapPin, Clock, Utensils, Hotel,
  Lightbulb, Package, Phone, Thermometer, Star, Camera,
  ShoppingBag, Sparkles, ExternalLink, Plane, Train,
  IndianRupee, TrendingUp, Navigation, AlertCircle
} from 'lucide-react';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

const DAY_THEMES = [
  { gradient: 'from-orange-400 to-rose-400', emoji: '🌅' },
  { gradient: 'from-blue-400 to-cyan-400', emoji: '🏛️' },
  { gradient: 'from-purple-400 to-pink-400', emoji: '🌙' },
  { gradient: 'from-green-400 to-teal-400', emoji: '🌿' },
  { gradient: 'from-yellow-400 to-orange-400', emoji: '☀️' },
  { gradient: 'from-indigo-400 to-purple-400', emoji: '✨' },
  { gradient: 'from-red-400 to-pink-400', emoji: '🎭' },
];

const SectionTitle = ({ icon: Icon, children, color = 'text-primary' }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className={`w-5 h-5 ${color}`} />
    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{children}</h3>
  </div>
);

const periodColors = {
  morning: { border: 'border-l-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  afternoon: { border: 'border-l-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10', badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  evening: { border: 'border-l-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/10', badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
};

const ActivityCard = ({ activity, period }) => {
  const colors = periodColors[period] || periodColors.morning;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(activity.location || activity.title)}`;

  return (
    <div className={`border-l-4 ${colors.border} ${colors.bg} pl-4 py-3 pr-3 rounded-r-xl`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {activity.time && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                🕐 {activity.time}
              </span>
            )}
            <span className="text-sm font-semibold text-slate-800 dark:text-white">{activity.title}</span>
          </div>
          {activity.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{activity.description}</p>
          )}
          {activity.openingHours && (
            <div className="flex items-center gap-1 mt-1.5">
              <AlertCircle className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Open: {activity.openingHours}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            {activity.location && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors">
                <MapPin className="w-3 h-3" />{activity.location}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            {activity.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activity.duration}</span>}
            {activity.cost && <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium"><IndianRupee className="w-3 h-3" />{activity.cost}</span>}
          </div>
          {activity.tips && (
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-2.5 py-1.5 rounded-lg">
              💡 {activity.tips}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const DayCard = ({ day, isOpen, onToggle, themeIndex }) => {
  const theme = DAY_THEMES[themeIndex % DAY_THEMES.length];
  const totalActivities = (day.morning?.length || 0) + (day.afternoon?.length || 0) + (day.evening?.length || 0);

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-0 text-left hover:opacity-95 transition-opacity">
        <div className={`flex items-center gap-4 p-5 w-full bg-gradient-to-r ${theme.gradient} bg-opacity-10`}>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}>
            {theme.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-slate-900 dark:text-white">Day {day.day}</p>
              {day.theme && <span className="text-sm text-slate-600 dark:text-slate-400">— {day.theme}</span>}
            </div>
            {day.date && <p className="text-xs text-slate-500 mt-0.5">{day.date}</p>}
            <div className="flex gap-3 mt-1.5">
              {day.morning?.length > 0 && <span className="text-xs text-slate-500">🌅 {day.morning.length} morning</span>}
              {day.afternoon?.length > 0 && <span className="text-xs text-slate-500">☀️ {day.afternoon.length} afternoon</span>}
              {day.evening?.length > 0 && <span className="text-xs text-slate-500">🌙 {day.evening.length} evening</span>}
            </div>
          </div>
          <div className="flex-shrink-0 mr-1">
            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700/50 space-y-5 pt-4">
              {[
                ['morning', '🌅 Morning', day.morning],
                ['afternoon', '☀️ Afternoon', day.afternoon],
                ['evening', '🌙 Evening', day.evening],
              ].map(([key, label, activities]) =>
                activities?.length ? (
                  <div key={key}>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{label}</p>
                    <div className="space-y-3">
                      {activities.map((act, i) => <ActivityCard key={i} activity={act} period={key} />)}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

const BudgetBar = ({ label, value, total, color }) => {
  const numericValue = parseInt((value || '0').replace(/[^0-9]/g, '')) || 0;
  const numericTotal = parseInt((total || '1').replace(/[^0-9]/g, '')) || 1;
  const pct = Math.min((numericValue / numericTotal) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="capitalize text-slate-600 dark:text-slate-400">{label.replace(/([A-Z])/g, ' $1').trim()}</span>
        <span className="font-semibold text-slate-800 dark:text-white">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

const BUDGET_COLORS = [
  'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400',
  'bg-pink-400', 'bg-orange-400', 'bg-teal-400',
];

export default function TripItinerary({ itinerary, tripData }) {
  const [openDays, setOpenDays] = useState([1]);
  const toggleDay = (day) => setOpenDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  const expandAll = () => setOpenDays(itinerary.dailyPlan?.map(d => d.day) || []);
  const collapseAll = () => setOpenDays([]);

  if (!itinerary) return null;

  const budgetEntries = Object.entries(itinerary.budgetBreakdown || {}).filter(([k]) => k !== 'total');
  const totalValue = itinerary.budgetBreakdown?.total || '';

  return (
    <div className="space-y-8">

      {/* Summary */}
      {itinerary.summary && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Trip Overview</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{itinerary.summary}</p>
            </div>
          </div>
          {itinerary.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {itinerary.highlights.map((h, i) => <Badge key={i} variant="default" className="text-xs">{h}</Badge>)}
            </div>
          )}
        </Card>
      )}

      {/* Travel Cost Card */}
      {itinerary.travelCost && (
        <Card className="p-5 border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10">
          <SectionTitle icon={Plane} color="text-blue-500">Travel Cost to {tripData?.city}</SectionTitle>
          <div className="grid sm:grid-cols-3 gap-3">
            {Object.entries(itinerary.travelCost).map(([key, value]) => (
              <div key={key} className={`p-3 rounded-xl ${key === 'totalTravelCost' ? 'bg-blue-500 text-white col-span-full sm:col-span-1' : 'bg-white dark:bg-slate-800'}`}>
                <p className={`text-xs capitalize mb-1 ${key === 'totalTravelCost' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {key === 'visaFee' ? '🛂 Visa Fee' : key === 'flightOrTrain' ? '✈️ Flight/Train' : '💰 Total Travel'}
                </p>
                <p className={`font-bold text-sm ${key === 'totalTravelCost' ? 'text-white text-base' : 'text-slate-800 dark:text-white'}`}>{value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Daily Itinerary */}
      {itinerary.dailyPlan?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle icon={Clock}>Day-by-Day Itinerary</SectionTitle>
            <div className="flex gap-2 text-xs">
              <button onClick={expandAll} className="text-primary hover:underline">Expand all</button>
              <span className="text-slate-300">|</span>
              <button onClick={collapseAll} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Collapse</button>
            </div>
          </div>
          <div className="space-y-3">
            {itinerary.dailyPlan.map((day, idx) => (
              <DayCard key={day.day} day={day} isOpen={openDays.includes(day.day)} onToggle={() => toggleDay(day.day)} themeIndex={idx} />
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Hotels */}
        {itinerary.hotels?.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={Hotel} color="text-accent">Hotels</SectionTitle>
            <div className="space-y-4">
              {itinerary.hotels.slice(0, 3).map((hotel, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Hotel className="w-4 h-4 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{hotel.name}</p>
                      {hotel.rating && (
                        <div className="flex items-center gap-0.5">
                          {[...Array(Math.round(hotel.rating))].map((_, j) => <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                        </div>
                      )}
                    </div>
                    {hotel.address && <p className="text-xs text-slate-500 mt-0.5">{hotel.address}</p>}
                    {hotel.priceRange && <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">₹ {hotel.priceRange}</p>}
                    {hotel.description && <p className="text-xs text-slate-500 mt-1">{hotel.description}</p>}
                    {hotel.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {hotel.amenities.slice(0, 4).map(a => <span key={a} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">{a}</span>)}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      {hotel.bookingLink && (
                        <a href={hotel.bookingLink} target="_blank" rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                          <ExternalLink className="w-3 h-3" /> Booking.com
                        </a>
                      )}
                      {hotel.makemytripLink && (
                        <a href={hotel.makemytripLink} target="_blank" rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline">
                          <ExternalLink className="w-3 h-3" /> MakeMyTrip
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Restaurants */}
        {itinerary.restaurants?.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={Utensils} color="text-orange-500">Restaurants</SectionTitle>
            <div className="space-y-3">
              {itinerary.restaurants.slice(0, 4).map((r, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.cuisine} • ₹{r.priceRange}</p>
                    {r.location && <p className="text-xs text-slate-400 mt-0.5">{r.location}</p>}
                    {r.mustTry?.length > 0 && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Try: {r.mustTry.join(', ')}</p>}
                    {r.zomatoLink && (
                      <a href={r.zomatoLink} target="_blank" rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 mt-1 text-red-500 hover:underline">
                        <ExternalLink className="w-3 h-3" /> View on Zomato
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Budget Breakdown — visual */}
      {itinerary.budgetBreakdown && (
        <Card className="p-5">
          <SectionTitle icon={IndianRupee} color="text-green-500">Budget Breakdown</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {budgetEntries.map(([key, value], i) => (
                <BudgetBar
                  key={key}
                  label={key}
                  value={value}
                  total={totalValue}
                  color={BUDGET_COLORS[i % BUDGET_COLORS.length]}
                />
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-200 dark:border-green-900/40 w-full">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Total Estimated Cost</p>
                <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">{totalValue}</p>
                <p className="text-xs text-slate-400 mt-2">per person · all inclusive</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Must Visit */}
        {itinerary.mustVisitPlaces?.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={Star} color="text-yellow-500">Must Visit</SectionTitle>
            <div className="space-y-3">
              {itinerary.mustVisitPlaces.slice(0, 5).map((place, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-yellow-600 dark:text-yellow-400">{i + 1}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{place.name}</p>
                      {place.googleMapsLink && (
                        <a href={place.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                          <Navigation className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{place.description}</p>
                    {place.openingHours && <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">🕐 {place.openingHours}</p>}
                    {place.entryFee && <p className="text-xs text-primary font-medium mt-0.5">₹ {place.entryFee}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Hidden Gems */}
        {itinerary.hiddenGems?.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={Sparkles} color="text-purple-500">Hidden Gems</SectionTitle>
            <div className="space-y-3">
              {itinerary.hiddenGems.slice(0, 4).map((gem, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10">
                  <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 text-xs">💎</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{gem.name}</p>
                    <p className="text-xs text-slate-500">{gem.description}</p>
                    {gem.location && <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">📍 {gem.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Food Recommendations */}
      {itinerary.foodRecommendations?.length > 0 && (
        <Card className="p-5">
          <SectionTitle icon={Utensils} color="text-red-500">Local Food You Must Try</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {itinerary.foodRecommendations.map((food, i) => (
              <div key={i} className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">🍽️ {food.name}</p>
                <p className="text-xs text-slate-500 mt-1">{food.description}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">📍 {food.where}</p>
                {food.approxCost && <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">₹ {food.approxCost}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Transportation */}
      {itinerary.transportation?.length > 0 && (
        <Card className="p-5">
          <SectionTitle icon={Train} color="text-cyan-500">Getting Around</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3">
            {itinerary.transportation.map((t, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/10">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 text-sm">🚌</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{t.type}</p>
                  <p className="text-xs text-slate-500">{t.description}</p>
                  {t.estimatedCost && <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">₹ {t.estimatedCost}</p>}
                  {t.tips && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">💡 {t.tips}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shopping */}
        {itinerary.shoppingSpots?.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={ShoppingBag} color="text-pink-500">Shopping Spots</SectionTitle>
            <div className="space-y-3">
              {itinerary.shoppingSpots.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <div className="text-lg flex-shrink-0">🛍️</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.description}</p>
                    {s.whatToBuy && <p className="text-xs text-pink-600 dark:text-pink-400 mt-0.5">Buy: {s.whatToBuy}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Nearby Attractions */}
        {itinerary.nearbyAttractions?.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={MapPin} color="text-teal-500">Nearby Day Trips</SectionTitle>
            <div className="space-y-3">
              {itinerary.nearbyAttractions.map((n, i) => (
                <div key={i} className="flex gap-3">
                  <div className="text-lg flex-shrink-0">🗺️</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{n.name}</p>
                    <p className="text-xs text-slate-500">{n.description}</p>
                    {n.distance && <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5">📏 {n.distance}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Travel Tips */}
      {itinerary.travelTips?.length > 0 && (
        <Card className="p-5">
          <SectionTitle icon={Lightbulb} color="text-amber-500">Travel Tips</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3">
            {itinerary.travelTips.map((tip, i) => (
              <div key={i} className="flex gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10">
                <span className="text-amber-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-slate-600 dark:text-slate-400">{tip}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Packing List */}
        {itinerary.packingList?.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={Package} color="text-indigo-500">Packing List</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {itinerary.packingList.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Weather */}
        {itinerary.weather && (
          <Card className="p-5">
            <SectionTitle icon={Thermometer} color="text-sky-500">Weather & Climate</SectionTitle>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-900/10">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{itinerary.weather.description}</p>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[['🌡️', 'Temp', itinerary.weather.temperature], ['💧', 'Humidity', itinerary.weather.humidity], ['🌧️', 'Rainfall', itinerary.weather.rainfall]].map(([emoji, label, val]) => (
                    <div key={label} className="text-center">
                      <div className="text-lg">{emoji}</div>
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              {itinerary.bestTimeToVisit && (
                <p className="text-xs text-slate-500 dark:text-slate-400 px-1">📅 Best time: {itinerary.bestTimeToVisit}</p>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Emergency Contacts */}
      {itinerary.emergencyContacts?.length > 0 && (
        <Card className="p-5 border-red-200 dark:border-red-900/40">
          <SectionTitle icon={Phone} color="text-red-500">Emergency Contacts</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            {itinerary.emergencyContacts.map((c, i) => (
              <a key={i} href={`tel:${c.number}`}
                className="flex flex-col items-center p-3 rounded-xl bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-center">
                <span className="text-2xl mb-1">{['🚔', '🚑', '📞'][i] || '📞'}</span>
                <p className="text-xs font-bold text-slate-800 dark:text-white">{c.name}</p>
                <p className="text-sm font-extrabold text-red-600 dark:text-red-400">{c.number}</p>
                {c.note && <p className="text-xs text-slate-500 mt-0.5">{c.note}</p>}
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
