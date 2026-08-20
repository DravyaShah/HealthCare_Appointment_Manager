import { FileSearch } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  title = "No diagnostic records found", 
  description = "Get started by generating or adding a new clinical entry.", 
  icon: Icon = FileSearch,
  actionButton 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 border-dashed"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-5 shadow-lg shadow-cyan-500/10">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold font-display text-slate-100 mb-2">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionButton && (
        <div className="mt-1">
          {actionButton}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
