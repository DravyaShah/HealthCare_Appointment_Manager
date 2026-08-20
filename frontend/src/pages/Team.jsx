import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Star, Calendar, Phone, Award } from 'lucide-react';
import api from '../api/axios';
import NavbarPublic from '../components/NavbarPublic';
import ErrorBanner from '../components/ErrorBanner';

const Team = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await api.get('/doctors/profile/');
        setDoctors(res.data);
      } catch (err) {
        setError('Failed to load clinical specialists.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      <NavbarPublic />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
            <Stethoscope className="h-3.5 w-3.5" /> Board-Certified Medical Staff
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Our Clinical Specialists
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Leading cardiologists, endocrinologists, and general practitioners utilizing AI-augmented clinical decision support tools.
          </p>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading specialist network...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">
                      {doc.name ? doc.name.charAt(0) : 'D'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-400 transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-cyan-400 font-semibold">{doc.specialization}</p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>{doc.experience_years}+ Years Clinical Experience</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {doc.bio || 'Board-certified specialist committed to precision diagnostics and compassionate patient care.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-slate-300">${doc.consultation_fee} / Session</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300">
                    {doc.available_days}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
