import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.js';

export default function LoadingSpinner({ fullScreen, size = 'md', text }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className={cn('rounded-full border-2 border-primary/20 border-t-primary', sizes[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="text-sm text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-950 z-50">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-full border-3 border-primary/20 border-t-primary"
            style={{ borderWidth: 3 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}
