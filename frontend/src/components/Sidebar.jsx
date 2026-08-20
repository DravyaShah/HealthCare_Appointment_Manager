import { NavLink, Link } from 'react-router-dom';
import { Activity, Sparkles, ShieldCheck } from 'lucide-react';

const statusItems = [
  { label: 'AI Engine Online' },
  { label: 'Realtime Diagnostic Feed' },
  { label: 'HIPAA & GDPR Enforced' },
];

const Sidebar = ({ links }) => {
  return (
    <aside className="w-64 bg-slate-950/90 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col min-h-screen z-30">
      {/* Brand */}
      <Link to="/" className="h-16 flex items-center px-6 border-b border-slate-800/80 hover:bg-slate-900/60 transition-colors">
        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <span className="ml-3 text-xl font-bold font-display tracking-tight text-white">
          Health<span className="text-cyan-400">AI</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.href}
              end={link.href === '/doctor-dashboard' || link.href === '/patient-dashboard'}
              className={({ isActive }) =>
                `relative flex items-center px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30 font-bold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${isActive ? 'text-cyan-200' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {link.name}
                  {isActive && (
                    <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-200" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Card */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 p-4 border border-slate-800 text-white shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Clinical Node
            </p>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="space-y-2">
            {statusItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] font-medium text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
