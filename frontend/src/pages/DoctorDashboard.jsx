import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Calendar, FileText, Pill, BrainCircuit, Activity,
  ArrowUpRight, Clock, CheckCircle2, ChevronRight, AlertCircle, Sparkles
} from 'lucide-react';
import api from '../api/axios';
import ErrorBanner from '../components/ErrorBanner';

const DoctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboard/doctor/');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load doctor dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Activity className="h-10 w-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
            Clinical Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time diagnostic metrics, patient schedules & autonomous clinical insights
          </p>
        </div>
        <Link
          to="/ai-insights"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
        >
          <BrainCircuit className="h-4 w-4" />
          AI Synthesis Engine
        </Link>
      </motion.div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-5 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Patients</span>
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-display text-white">{stats?.total_patients || 0}</div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Active care directory
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-5 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointments</span>
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-display text-white">{stats?.total_appointments || 0}</div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">
            {stats?.scheduled_appointments || 0} scheduled · {stats?.completed_appointments || 0} completed
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-5 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lab Reports</span>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-display text-white">{stats?.total_reports || 0}</div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-cyan-400" /> Indexed for AI parsing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-5 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prescriptions</span>
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Pill className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-display text-white">{stats?.total_prescriptions || 0}</div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">Issued clinical scripts</p>
        </motion.div>
      </div>

      {/* Recent Appointments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/90 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold font-display text-white">Upcoming Appointments</h3>
              <p className="text-xs text-slate-400">Scheduled clinical consults requiring doctor attention</p>
            </div>
            <Link to="/appointments" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!stats?.recent_appointments || stats.recent_appointments.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              No scheduled appointments at this time.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recent_appointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => navigate(`/ai-insights/${apt.id}`)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                      {apt.patient_name ? apt.patient_name.charAt(0) : 'P'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {apt.patient_name || apt.patient?.name || 'Patient'}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{apt.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-mono font-medium text-slate-300">{apt.appointment_date}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-bold">
                        {apt.status}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/90 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-white mb-2">Clinical Toolkit</h3>
            <p className="text-xs text-slate-400 mb-6">Autonomous workflows & records management</p>

            <div className="space-y-3">
              <Link
                to="/prescriptions"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                    <Pill className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">Issue Prescription</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </Link>

              <Link
                to="/reports"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">Upload Lab Report</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </Link>

              <Link
                to="/patients"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">Patient Directory</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-1">
              <Sparkles className="h-3.5 w-3.5" /> AI Clinical Assistant Active
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Gemini model is auto-synthesizing prescription and report correlations in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
