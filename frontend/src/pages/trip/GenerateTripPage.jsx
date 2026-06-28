import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Users, DollarSign, Calendar, Heart, Loader2, ChevronRight, ChevronLeft, Check, Globe } from 'lucide-react';
import { useTrip } from '../../hooks/useTrip.js';
import { TRAVEL_STYLES, INTERESTS, BUDGET_OPTIONS } from '../../utils/constants.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Card from '../../components/ui/Card.jsx';
import TripItinerary from '../../components/trip/TripItinerary.jsx';
import toast from 'react-hot-toast';

const STEPS = ['Destination', 'Travel Style', 'Preferences', 'Dates & Details'];

export default function GenerateTripPage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [itinerary, setItinerary] = useState(null);
  const [formData, setFormData] = useState({
    city: searchParams.get('city') || '',
    country: searchParams.get('country') || '',
    budget: 'moderate',
    travelStyle: 'adventure',
    travelers: 2,
    duration: 5,
    startDate: '',
    interests: [],
  });
  const { generating, generating: isGenerating, generateTrip, saveTrip, loading: saving } = useTrip();
  const navigate = useNavigate();

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleInterest = (val) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(val) ? prev.interests.filter(i => i !== val) : [...prev.interests, val],
    }));
  };

  const canProceed = () => {
    if (step === 0) return formData.city.trim() && formData.country.trim();
    if (step === 1) return !!formData.travelStyle;
    if (step === 2) return !!formData.budget;
    return formData.duration >= 1;
  };

  const handleGenerate = async () => {
    try {
      const result = await generateTrip(formData);
      setItinerary(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  const handleSave = async () => {
    try {
      const trip = await saveTrip({
        ...formData,
        title: `${formData.city}, ${formData.country} — ${formData.duration} Days`,
        generatedItinerary: itinerary,
      });
      navigate(`/trips/${trip._id}`);
    } catch {}
  };

  const handleRegenerate = () => {
    setItinerary(null);
    setStep(0);
  };

  if (generating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">AI is planning your trip…</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Gemini is crafting a personalized itinerary for {formData.city}, {formData.country}. This takes about 15–30 seconds.</p>
          <div className="space-y-2">
            {['Analyzing destination data', 'Finding hidden gems', 'Optimizing for your budget', 'Crafting daily schedule'].map((text, i) => (
              <motion.div key={text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }}
                className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="w-4 h-4 text-primary flex-shrink-0" />
                </motion.div>
                {text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (itinerary) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your AI Itinerary</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{formData.city}, {formData.country} • {formData.duration} Days</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRegenerate}>Regenerate</Button>
            <Button onClick={handleSave} loading={saving} icon={<Check className="w-4 h-4" />}>Save Trip</Button>
          </div>
        </div>
        <TripItinerary itinerary={itinerary} tripData={formData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Plan Your Trip</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Tell us about your dream trip and AI will do the rest.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                i < step ? 'bg-primary text-white' : i === step ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`h-1 flex-1 rounded-full transition-all ${i < step ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        <Card className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">{STEPS[step]}</h2>

              {/* Step 0: Destination */}
              {step === 0 && (
                <div className="space-y-4">
                  <Input label="City / Destination" placeholder="e.g., Paris, Bali, Tokyo" icon={<MapPin className="w-4 h-4" />} value={formData.city} onChange={(e) => update('city', e.target.value)} />
                  <Input label="Country" placeholder="e.g., France, Indonesia, Japan" icon={<Globe className="w-4 h-4" />} value={formData.country} onChange={(e) => update('country', e.target.value)} />
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {['Paris, France', 'Bali, Indonesia', 'Tokyo, Japan', 'Rome, Italy', 'Dubai, UAE', 'New York, USA'].map((dest) => {
                      const [city, country] = dest.split(', ');
                      return (
                        <button key={dest} onClick={() => { update('city', city); update('country', country); }}
                          className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary transition-all text-left">
                          {dest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 1: Travel Style */}
              {step === 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TRAVEL_STYLES.map(({ value, label, icon }) => (
                    <button key={value} onClick={() => update('travelStyle', value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                        formData.travelStyle === value ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                      }`}>
                      <span className="text-2xl">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Budget & Interests */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Budget Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {BUDGET_OPTIONS.map(({ value, label, description, icon }) => (
                        <button key={value} onClick={() => update('budget', value)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            formData.budget === value ? 'border-primary bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                          }`}>
                          <span className="text-2xl">{icon}</span>
                          <span className={`text-sm font-semibold ${formData.budget === value ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{label}</span>
                          <span className="text-xs text-slate-500">{description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Interests <span className="text-slate-400 font-normal">(pick any)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map(({ value, label, icon }) => (
                        <button key={value} onClick={() => toggleInterest(value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            formData.interests.includes(value) ? 'bg-primary text-white border-primary' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                          }`}>
                          <span>{icon}</span>{label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Dates & Travelers */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Duration: <span className="text-primary font-bold">{formData.duration} {formData.duration === 1 ? 'day' : 'days'}</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input type="range" min={1} max={30} value={formData.duration} onChange={(e) => update('duration', parseInt(e.target.value))} className="flex-1 accent-primary" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-12 text-center">{formData.duration}d</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1 day</span><span>30 days</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Travelers: <span className="text-primary font-bold">{formData.travelers}</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => update('travelers', Math.max(1, formData.travelers - 1))} className="w-9 h-9 rounded-xl border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors font-bold">−</button>
                      <span className="text-xl font-bold text-slate-900 dark:text-white w-8 text-center">{formData.travelers}</span>
                      <button onClick={() => update('travelers', Math.min(20, formData.travelers + 1))} className="w-9 h-9 rounded-xl border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors font-bold">+</button>
                    </div>
                  </div>
                  <Input label="Start Date (optional)" type="date" icon={<Calendar className="w-4 h-4" />} value={formData.startDate} onChange={(e) => update('startDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />

                  {/* Summary */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm space-y-2">
                    <p className="font-semibold text-slate-800 dark:text-white mb-3">Trip Summary</p>
                    {[
                      ['🗺️ Destination', `${formData.city}, ${formData.country}`],
                      ['🎒 Style', formData.travelStyle],
                      ['💰 Budget', formData.budget],
                      ['📅 Duration', `${formData.duration} days`],
                      ['👥 Travelers', formData.travelers],
                      formData.interests.length && ['❤️ Interests', formData.interests.slice(0, 3).join(', ') + (formData.interests.length > 3 ? '…' : '')],
                    ].filter(Boolean).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500">{k}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-200 dark:border-slate-700">
            <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0} icon={<ChevronLeft className="w-4 h-4" />}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleGenerate} disabled={!canProceed()} loading={isGenerating}>
                <Sparkles className="w-4 h-4" /> Generate with AI
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
