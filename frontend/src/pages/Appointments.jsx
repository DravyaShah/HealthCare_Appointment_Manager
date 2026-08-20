import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, User, Plus, Search, Filter, Sparkles,
  CheckCircle2, XCircle, AlertCircle, ChevronRight, Stethoscope
} from 'lucide-react';
import api from '../api/axios';
import ErrorBanner from '../components/ErrorBanner';
import { useAuth } from '../context/AuthContext';

const Appointments = () => {
  const { role } = useAuth();
  const isDoctor = role === 'doctor';
  const isPatient = role === 'patient';

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New appointment modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00:00');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments/appointments/');
      setAppointments(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    if (isPatient) {
      api.get('/doctors/profile/')
        .then(res => setDoctors(res.data))
        .catch(err => console.error(err));
    }
  }, [isPatient]);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/appointments/appointments/', {
        doctor: selectedDoctor,
        appointment_date: date,
        appointment_time: time,
        reason,
      });
      setShowModal(false);
      setReason('');
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to schedule appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/appointments/${id}/`, { status });
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update appointment status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
            Consultation Scheduling & Records
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage medical appointments, status updates, and synthesize AI clinical insights
          </p>
        </div>
        {isPatient && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Book New Consult
          </button>
        )}
      </motion.div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {/* Appointments Grid / List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl">
          <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Appointments Scheduled</h3>
          <p className="text-xs text-slate-400 mt-1">Book your first clinical session above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointments.map((apt) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg border ${
                    apt.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    apt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {apt.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">ID #{apt.id}</span>
                </div>

                <h3 className="text-base font-bold font-display text-slate-100 mb-2">
                  {apt.reason || 'General Consultation'}
                </h3>

                <div className="space-y-2 text-xs text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{isDoctor ? `Patient: ${apt.patient?.name || apt.patient_name || 'Patient'}` : `Doctor: ${apt.doctor?.name || apt.doctor_name || 'Doctor'}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{apt.appointment_date} at {apt.appointment_time}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(`/ai-insights/${apt.id}`)}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" /> AI Insights
                </button>

                {isDoctor && apt.status === 'scheduled' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'completed')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold hover:bg-emerald-500/20 cursor-pointer"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold hover:bg-rose-500/20 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4"
            >
              <h3 className="text-lg font-bold text-white font-display">Schedule Medical Consult</h3>
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Specialist</label>
                  <select
                    required
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Choose a Doctor...</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} — {doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Time</label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reason for Consult</label>
                  <textarea
                    required
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe symptoms or routine checkup goals..."
                    className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? 'Confirming...' : 'Book Consult'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appointments;
