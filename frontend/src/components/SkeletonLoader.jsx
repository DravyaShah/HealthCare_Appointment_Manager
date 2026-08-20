import { motion } from 'framer-motion';

const SkeletonRow = ({ cols = 5 }) => (
  <tr className="animate-pulse border-b border-slate-800/60">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          {i === 0 && <div className="h-4 w-4 bg-slate-800 rounded-md" />}
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-800 rounded-md w-3/4" />
            {i === 0 && <div className="h-3 bg-slate-800/60 rounded-md w-1/2" />}
          </div>
        </div>
      </td>
    ))}
  </tr>
);

export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl"
  >
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-900/80">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-6 py-4 text-left">
                <div className="h-3 bg-slate-800 rounded-md w-20 animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-slate-950/40 divide-y divide-slate-800/60">
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-3 flex-1">
        <div className="h-5 bg-slate-800 rounded-md w-2/3" />
        <div className="h-4 bg-slate-800/60 rounded-md w-1/2" />
        <div className="h-3 bg-slate-800/40 rounded-md w-1/3" />
      </div>
      <div className="h-8 w-24 bg-slate-800 rounded-full" />
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-8 w-20 bg-slate-800/60 rounded-xl" />
      <div className="h-8 w-20 bg-slate-800/60 rounded-xl" />
    </div>
  </motion.div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-8 animate-pulse">
    <div className="space-y-3">
      <div className="h-8 bg-slate-800 rounded-lg w-1/4" />
      <div className="h-4 bg-slate-800/60 rounded-lg w-1/3" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 bg-slate-900/80 border border-slate-800 rounded-3xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="h-80 bg-slate-900/80 border border-slate-800 rounded-3xl" />
      <div className="h-80 bg-slate-900/80 border border-slate-800 rounded-3xl" />
    </div>
  </div>
);

export default SkeletonTable;
