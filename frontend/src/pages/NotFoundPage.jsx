import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-8xl font-black text-slate-100 dark:text-slate-800 mb-6">404</div>
        <div className="text-6xl mb-6">🗺️</div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Page not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">Looks like you've ventured off the map. Let's get you back on track.</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/"><Button icon={<Home className="w-4 h-4" />}>Go Home</Button></Link>
          <Button variant="outline" onClick={() => window.history.back()} icon={<ArrowLeft className="w-4 h-4" />}>Go Back</Button>
        </div>
      </motion.div>
    </div>
  );
}
