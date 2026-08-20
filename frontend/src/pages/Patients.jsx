import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Phone, MapPin, Heart, Activity } from 'lucide-react';
import api from '../api/axios';
import ErrorBanner from '../components/ErrorBanner';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await api.get('/patients/profile/');
        setPatients(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch patients.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.blood_group || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
            Patient Medical Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Clinical profiles, health history & emergency contact records
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search patients or blood group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </motion.div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading directory...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl">
          <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Patient Records Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pat) => (
            <motion.div
              key={pat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-base shadow-md shadow-cyan-500/20">
                    {pat.name ? pat.name.charAt(0) : 'P'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{pat.name}</h3>
                    <p className="text-[11px] text-slate-400">{pat.age} yrs · {pat.gender}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {pat.blood_group || 'N/A'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-400 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                <div className="flex items-start gap-2">
                  <Heart className="h-3.5 w-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">History: {pat.medical_history || 'None reported'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Emergency: {pat.emergency_contact || 'N/A'}</span>
                </div>
                {pat.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{pat.address}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Patients;
