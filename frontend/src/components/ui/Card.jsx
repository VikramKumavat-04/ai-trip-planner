import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.js';

export default function Card({ children, className, hover = false, glass = false, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'rounded-2xl border transition-all duration-300',
        glass
          ? 'bg-white/10 backdrop-blur-md border-white/20'
          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50',
        hover && 'hover:shadow-xl cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
