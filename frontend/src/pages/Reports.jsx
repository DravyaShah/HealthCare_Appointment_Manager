import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Calendar, User, Sparkles, Download, Plus } from 'lucide-react';
import api from '../api/axios';
import ErrorBanner from '../components/ErrorBanner';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState('');
  const [reportType, setReportType] = useState('Diagnostic Lab Report');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [repRes, apptRes] = await Promise.all([
        api.get('/reports/reports/'),
        api.get('/appointments/appointments/'),
      ]);
      setReports(repRes.data);
      setAppointments(apptRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch medical reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('appointment', selectedAppt);
    formData.append('report_type', reportType);
    if (file) {
      formData.append('report_file', file);
    }

    try {
      await api.post('/reports/reports/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowModal(false);
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload medical report.');
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
            Medical Reports & Diagnostics Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store, analyze, and cross-reference laboratory & diagnostic imaging files
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          Upload New Report
        </button>
      </motion.div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading diagnostic vault...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl">
          <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Reports Uploaded</h3>
          <p className="text-xs text-slate-400 mt-1">Upload a lab report or lipid panel to generate AI health insights.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((rep) => (
            <motion.div
              key={rep.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                    <FileText className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">ID #{rep.id}</span>
                </div>

                <h3 className="text-base font-bold font-display text-slate-100 mb-2">
                  {rep.report_type}
                </h3>

                <div className="space-y-2 text-xs text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Patient: {rep.patient?.name || rep.appointment?.patient?.name || 'Patient'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{new Date(rep.uploaded_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> AI Ready
                </span>
                <a
                  href={rep.report_file}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all"
                >
                  <Download className="h-3.5 w-3.5 text-cyan-400" /> Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4"
            >
              <h3 className="text-lg font-bold text-white font-display">Upload Diagnostic Report</h3>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Associated Appointment</label>
                  <select
                    required
                    value={selectedAppt}
                    onChange={(e) => setSelectedAppt(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select Appointment...</option>
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        Appt #{a.id} — {a.reason} ({a.appointment_date})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Report Category</label>
                  <input
                    type="text"
                    required
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    placeholder="e.g. Comprehensive Blood Panel"
                    className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Document File (PDF / Image)</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
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
                    {submitting ? 'Uploading...' : 'Upload File'}
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

export default Reports;
