import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, MapPin, Clock, Users, Star, ArrowRight, ChevronDown, Zap, Shield, Globe, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { POPULAR_DESTINATIONS } from '../utils/constants.js';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const TESTIMONIALS = [
  { name: 'Priya Sharma', location: 'Mumbai', text: 'Generated a perfect 7-day Paris itinerary in seconds. The budget breakdown was spot-on!', rating: 5, avatar: 'PS' },
  { name: 'Rahul Mehta', location: 'Bangalore', text: 'Found hidden gems in Tokyo I never would have discovered. This app is a game-changer!', rating: 5, avatar: 'RM' },
  { name: 'Ananya Patel', location: 'Ahmedabad', text: 'Family trip to Bali planned flawlessly. Kids loved every activity the AI suggested.', rating: 5, avatar: 'AP' },
];

const FEATURES = [
  { icon: Sparkles, title: 'AI-Powered Planning', desc: 'Gemini AI generates personalized itineraries based on your style, budget and interests in seconds.', color: 'from-purple-500 to-pink-500' },
  { icon: Globe, title: 'Global Destinations', desc: 'Plan trips to 195+ countries with local insights, hidden gems, and expert recommendations.', color: 'from-blue-500 to-cyan-500' },
  { icon: Zap, title: 'Instant Generation', desc: 'Get a complete day-by-day itinerary with hotels, restaurants and activities in under 30 seconds.', color: 'from-yellow-500 to-orange-500' },
  { icon: Shield, title: 'Smart Budget Control', desc: 'AI adapts every recommendation to your budget — from backpacker to luxury traveler.', color: 'from-green-500 to-teal-500' },
];

const STATS = [
  { value: '50K+', label: 'Trips Generated' },
  { value: '120+', label: 'Countries' },
  { value: '4.9/5', label: 'User Rating' },
  { value: '30s', label: 'Avg. Gen Time' },
];

export default function HomePage() {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="overflow-hidden">
      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Animated background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#4F46E5_0%,_transparent_60%)] opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#8B5CF6_0%,_transparent_60%)] opacity-15" />
          {/* Floating orbs */}
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl"
              style={{ width: `${150 + i * 80}px`, height: `${150 + i * 80}px`, left: `${10 + i * 15}%`, top: `${5 + i * 12}%` }}
              animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
            />
          ))}
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/90 font-medium">Powered by Google Gemini AI</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Plan Your Dream{' '}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
              Trip with AI
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate complete, personalized travel itineraries in seconds. Tell us where you want to go — AI handles the rest.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? '/generate' : '/register'}>
              <Button size="xl" className="group">
                <Sparkles className="w-5 h-5" />
                Start Planning Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/destinations">
              <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                <Globe className="w-5 h-5" /> Explore Destinations
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 pt-10 border-t border-white/10">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-white mb-1">{value}</div>
                <div className="text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40">
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" /> Why Choose Us
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Everything you need to travel smart
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From AI-generated itineraries to real-time budget tracking — we've built the tool that makes every trip unforgettable.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card hover className="p-6 h-full">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── POPULAR DESTINATIONS ─── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="flex items-end justify-between mb-12">
            <div>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-medium mb-3">
                <TrendingUp className="w-4 h-4" /> Trending Now
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-slate-900 dark:text-white">Popular Destinations</motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link to="/destinations"><Button variant="outline" size="sm">View All <ArrowRight className="w-4 h-4" /></Button></Link>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_DESTINATIONS.slice(0, 8).map((dest) => (
              <motion.div key={dest.city} variants={fadeUp}>
                <Link to={user ? `/generate?city=${dest.city}&country=${dest.country}` : '/register'}>
                  <Card hover className="overflow-hidden group">
                    <div className="relative h-52 overflow-hidden">
                      <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs text-white font-medium">{dest.category}</div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <div className="font-bold text-lg leading-tight">{dest.city}</div>
                        <div className="text-sm text-white/80 flex items-center gap-1"><MapPin className="w-3 h-3" />{dest.country}</div>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{dest.rating}</span>
                      </div>
                      <span className="text-xs text-slate-500">{dest.trips} trips</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Plan a trip in 3 steps
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 dark:text-slate-400 mb-16">No travel agent needed.</motion.p>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { step: '01', title: 'Tell us your dream', desc: 'Pick a destination, set your budget, travel style, and interests.', icon: MapPin },
                { step: '02', title: 'AI does the magic', desc: 'Gemini AI crafts a personalized day-by-day itinerary with hotels, restaurants, and activities.', icon: Sparkles },
                { step: '03', title: 'Travel with confidence', desc: 'Save your plan, export to PDF, share with friends, and go explore!', icon: Globe },
              ].map(({ step, title, desc, icon: Icon }) => (
                <motion.div key={step} variants={fadeUp} className="relative">
                  <div className="text-8xl font-black text-slate-100 dark:text-slate-800 absolute -top-4 left-1/2 -translate-x-1/2 select-none">{step}</div>
                  <div className="relative pt-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-16">
              Loved by travelers worldwide
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map(({ name, location, text, rating, avatar }) => (
                <motion.div key={name} variants={fadeUp}>
                  <Card className="p-7 h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[...Array(rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-1 mb-6">"{text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">{avatar}</div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-white">{name}</div>
                        <div className="text-xs text-slate-500">{location}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white, transparent 60%)' }} />
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white mb-6">
            Your next adventure starts here
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-white/80 mb-10">
            Join 50,000+ travelers who plan smarter trips with AI.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to={user ? '/generate' : '/register'}>
              <Button size="xl" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Sparkles className="w-5 h-5" />
                {user ? 'Plan Your Next Trip' : 'Get Started for Free'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
