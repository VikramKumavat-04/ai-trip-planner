import { Link } from 'react-router-dom';
import { Plane, Github, Linkedin, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">AI Trip Planner</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              Plan smarter trips with Gemini AI. Generate personalized itineraries, discover hidden gems, and travel with confidence.
            </p>
            <div className="flex gap-4 mt-6">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              {[['/', 'Home'], ['/destinations', 'Destinations'], ['/generate', 'Plan a Trip'], ['/dashboard', 'Dashboard']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {['About', 'Privacy Policy', 'Terms of Service', 'Contact'].map(label => (
                <li key={label}><a href="#" className="hover:text-white transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2026 AI Trip Planner. All rights reserved.</p>
          <p className="flex items-center gap-1.5">Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by Vikram Kumavat</p>
        </div>
      </div>
    </footer>
  );
}
