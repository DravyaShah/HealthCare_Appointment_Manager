import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import ErrorBanner from '../components/ErrorBanner';
import { useAuth } from '../context/AuthContext';

const Prescriptions = () => {
  const { role } = useAuth();
  const isDoctor = role === 'doctor';

  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState('');
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rxRes, apptRes] = await Promise.all([
        api.get('/prescriptions/prescriptions/'),
        api.get('/appointments/appointments/'),
      ]);
      setPrescriptions(rxRes.data);
      setAppointments(apptRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch prescriptions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssuePrescription = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post('/prescriptions/prescriptions/', {
        appointment: selectedAppt,
        diagnosis,
        medicines,
        instructions,
      });
      setShowModal(false);
      setDiagnosis('');
      setMedicines('');
      setInstructions('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to issue prescription.');
    } finally {
      setSubmitting(false);
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
            Clinical Prescriptions & Medication Directives
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verified pharmaceutical scripts, dosage guidelines & patient instructions
          </p>
        </div>
        {isDoctor && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Issue Prescription
          </button>
        )}
      </motion.div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl">
          <Pill className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Prescriptions Issued</h3>
          <p className="text-xs text-slate-400 mt-1">Issued prescriptions will be indexed here for AI synthesis.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prescriptions.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                  <Pill className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-mono text-slate-500">Rx #{p.id}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Diagnosis</span>
                <h3 className="text-base font-bold font-display text-slate-100">{p.diagnosis}</h3>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Medicines:</span>
                  <p className="mt-0.5 leading-relaxed font-mono text-cyan-300">{p.medicines}</p>
                </div>
                {p.instructions && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Instructions:</span>
                    <p className="mt-0.5 text-slate-400">{p.instructions}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{isDoctor ? `Patient: ${p.patient?.name || 'Patient'}` : `Dr. ${p.doctor?.name || 'Physician'}`}</span>
                <span>{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4"
            >
              <h3 className="text-lg font-bold text-white font-display">Issue Clinical Prescription</h3>
              <form onSubmit={handleIssuePrescription} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Appointment</label>
                  <select
                    required
                    value={selectedAppt}
                    onChange={(e) => setSelectedAppt(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select Appointment...</option>
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        Appt #{a.id} — Patient: {a.patient?.name || a.patient_name || 'Patient'} ({a.reason})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Clinical Diagnosis</label>
                  <input
                    type="text"
                    required
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Essential Hypertension (Stage 1)"
                    className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Prescribed Medicines & Dosage</label>
                  <textarea
                    required
                    rows={3}
                    value={medicines}
                    onChange={(e) => setMedicines(e.target.value)}
                    placeholder="e.g. Amlodipine 5mg once daily morning..."
                    className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Patient Directives & Care Plan</label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Low sodium diet, monitor blood pressure twice daily..."
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
                    {submitting ? 'Issuing...' : 'Issue Prescription'}
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

export default Prescriptions;
