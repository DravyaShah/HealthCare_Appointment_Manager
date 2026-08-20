import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, Activity, Pill, CheckCircle2, Apple, User,
  Ban, Home, AlertTriangle, MessageCircleQuestion, ArrowLeft,
  Calendar, Sparkles, Shield, Clock, ChevronRight, ChevronDown
} from 'lucide-react';
import api from '../api/axios';
import ErrorBanner from '../components/ErrorBanner';
import { useAuth } from '../context/AuthContext';

/* ─── Follow-Up Accordion ─── */
const FollowUpAccordion = ({ item, t, delay }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`rounded-xl border overflow-hidden transition-all ${t.itemBg} ${t.itemBorder}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left focus:outline-none cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1.5 flex-shrink-0">
            <div className={`h-2 w-2 rounded-full ${t.dot}`} />
          </div>
          <span className="text-xs font-semibold text-slate-200">{item.question || item}</span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && item.answer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 pl-8 pr-4 text-xs text-slate-400 border-t border-slate-800/60 mt-1 leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Insight Card Component ─── */
const InsightCard = ({ title, items, icon: Icon, colorTheme, delay = 0 }) => {
  const themes = {
    blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400',   titleColor: 'text-slate-100',   itemBg: 'bg-slate-900/40', itemBorder: 'border-slate-800/60',  dot: 'bg-blue-400' },
    emerald:{ bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', titleColor: 'text-slate-100', itemBg: 'bg-slate-900/40', itemBorder: 'border-slate-800/60', dot: 'bg-emerald-400' },
    amber:  { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400',   titleColor: 'text-slate-100',   itemBg: 'bg-slate-900/40', itemBorder: 'border-slate-800/60',  dot: 'bg-amber-400' },
    red:    { bg: 'bg-rose-500/10',     border: 'border-rose-500/20',     iconBg: 'bg-rose-500/10',   iconColor: 'text-rose-400',     titleColor: 'text-slate-100',     itemBg: 'bg-slate-900/40', itemBorder: 'border-slate-800/60',     dot: 'bg-rose-400' },
    purple: { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400', titleColor: 'text-slate-100', itemBg: 'bg-slate-900/40', itemBorder: 'border-slate-800/60', dot: 'bg-purple-400' },
    cyan:   { bg: 'bg-cyan-500/10',     border: 'border-cyan-500/20',     iconBg: 'bg-cyan-500/10',   iconColor: 'text-cyan-400',   titleColor: 'text-slate-100',   itemBg: 'bg-slate-900/40', itemBorder: 'border-slate-800/60',   dot: 'bg-cyan-400' },
  };

  const t = themes[colorTheme] || themes.blue;

  if (!items || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-3xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl hover:border-slate-700 transition-all duration-300 relative overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${t.bg} -mr-10 -mt-10 pointer-events-none`}></div>
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2.5 ${t.iconBg} border ${t.border} rounded-xl shadow-sm`}>
          <Icon className={`h-4 w-4 ${t.iconColor}`} />
        </div>
        <h3 className={`text-base font-bold font-display ${t.titleColor}`}>{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, index) => {
          if (typeof item === 'object' && item.question) {
            return <FollowUpAccordion key={index} item={item} t={t} delay={delay + 0.05 * index} />;
          }
          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.05 * index }}
              className={`flex items-start gap-3 ${t.itemBg} p-3 rounded-xl border ${t.itemBorder} text-slate-300`}
            >
              <div className="mt-1.5 flex-shrink-0">
                <div className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
              </div>
              <span className="text-xs leading-relaxed">{item}</span>
            </motion.li>
          );
        })}
      </ul>
      </div>
    </motion.div>
  );
};

/* ─── Confidence Badge ─── */
const ConfidenceBadge = ({ level }) => {
  const config = {
    high:   { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: Shield, label: 'High Confidence' },
    medium: { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   icon: Shield, label: 'Medium Confidence' },
    low:    { bg: 'bg-rose-500/10',     border: 'border-rose-500/30',     text: 'text-rose-400',     icon: AlertTriangle, label: 'Low Confidence' },
  };
  const c = config[level?.toLowerCase()] || config.medium;
  const BadgeIcon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}
    >
      <BadgeIcon className="h-3.5 w-3.5" />
      <span className="font-semibold text-xs">{c.label}</span>
    </motion.div>
  );
};

/* ─── Hub Page (no appointmentId) ─── */
const InsightsHub = () => {
  const { role } = useAuth();
  const isDoctor = role === 'doctor';
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await api.get('/appointments/appointments/');
        setAppointments(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const statusColors = {
    scheduled: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    completed: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    cancelled: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg shadow-cyan-500/20 mb-4">
          <BrainCircuit className="h-7 w-7" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white">
          AI Health Insights Engine
        </h1>
        <p className="mt-2 text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Select an active appointment record to synthesize AI diagnostic summaries, clinical recommendations, and risk profiles.
        </p>
      </motion.div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading && (
        <div className="flex justify-center py-16">
          <div className="relative">
            <BrainCircuit className="h-12 w-12 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-20" />
          </div>
        </div>
      )}

      {!loading && appointments.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl"
        >
          <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200 mb-1 font-display">No Appointments Found</h3>
          <p className="text-xs text-slate-400">An active appointment is required to generate AI insights.</p>
          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-all text-xs font-bold shadow-lg shadow-cyan-500/20"
          >
            Go to Appointments
          </Link>
        </motion.div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {appointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/90 p-6 shadow-xl hover:border-slate-700 transition-all duration-300 cursor-pointer flex flex-col h-full"
                onClick={() => navigate(`/ai-insights/${apt.id}`)}
              >
                <div className="mb-4">
                  <h3 className="text-base font-bold font-display text-slate-100 mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {apt.reason && apt.reason.length > 5 ? apt.reason : 'General Clinical Consult'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <User className="h-3.5 w-3.5 text-cyan-400" />
                    {isDoctor ? `Patient: ${apt.patient_name || apt.patient}` : `Doctor: ${apt.doctor_name || apt.doctor}`}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    {formatDate(apt.appointment_date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border capitalize ${statusColors[apt.status] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {apt.status}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">ID #{apt.id}</span>
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold transition-colors bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl group-hover:bg-cyan-500/20">
                    <Sparkles className="h-3.5 w-3.5" />
                    Synthesize Insight
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

/* ─── Detail Page (with appointmentId) ─── */
const InsightDetail = ({ appointmentId }) => {
  const { role } = useAuth();
  const isDoctor = role === 'doctor';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analyzing Clinical Parameters...",
    "Reviewing Medical Vault Records...",
    "Cross-referencing Medical Guidelines...",
    "Synthesizing Diagnostic Recommendations...",
    "Finalizing AI Insight Report..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/ai-engine/appointment/${appointmentId}/generate-insight/`);
        setData(res.data);
      } catch (err) {
        const status = err.response?.status;
        if (status === 404 || status === 400) {
          setError("Could not generate insights for this appointment. Please ensure both a prescription and a medical report have been uploaded.");
        } else {
          setError("AI service temporarily unavailable. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInsight();
  }, [appointmentId]);

  if (loading) {
    const progress = ((loadingStep + 1) / loadingMessages.length) * 100;
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-8">
        <div className="flex flex-col items-center justify-center p-10 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl min-h-[380px] min-w-[380px]">
          <div className="relative">
            <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
            <BrainCircuit className="h-14 w-14 text-cyan-400 animate-pulse relative z-10" />
          </div>
          <h2 className="mt-6 text-base font-bold font-display text-slate-100">
            {loadingMessages[loadingStep]}
          </h2>
          {/* Progress bar */}
          <div className="w-64 mt-5">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[10px] text-slate-400 font-mono">Step {loadingStep + 1} of {loadingMessages.length}</p>
              <p className="text-[10px] text-slate-400 font-mono">{Math.round(progress)}%</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">Processing clinical NLP model...</p>
          <p className="mt-1 text-[10px] text-slate-500 font-mono">Powered by Gemini 2.5</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <Link
          to="/ai-insights"
          className="inline-flex items-center text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Insights Hub
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-rose-500/30 p-8 text-center shadow-2xl"
        >
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold font-display text-slate-100 mb-2">Insight Generation Incomplete</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-all text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              Upload Report
            </Link>
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:text-white transition-all text-xs font-bold"
            >
              View Appointments
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <Link
        to="/ai-insights"
        className="inline-flex items-center text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Insights Hub
      </Link>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg shadow-cyan-500/20">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">AI Health Insight Synthesis</h1>
              <p className="text-xs text-slate-400 font-mono">Appointment #{appointmentId}</p>
            </div>
          </div>
        </div>
        {data?.confidence_level && isDoctor && (
          <ConfidenceBadge level={data.confidence_level} />
        )}
      </motion.div>

      {data?.summary && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 p-8 text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Executive Clinical Summary</h2>
            </div>
            <p className="text-base md:text-lg leading-relaxed text-slate-200 font-normal">{data.summary}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InsightCard title="Key Findings" items={data?.key_findings} icon={Activity} colorTheme="blue" delay={0.1} />
        <InsightCard title="Medication Guidance" items={data?.medication_guidance} icon={Pill} colorTheme="purple" delay={0.2} />
        <InsightCard title="Recommendations" items={data?.recommendations} icon={CheckCircle2} colorTheme="emerald" delay={0.3} />
        <InsightCard title="Foods To Eat" items={data?.foods_to_eat} icon={Apple} colorTheme="emerald" delay={0.4} />
        <InsightCard title="Foods To Avoid" items={data?.foods_to_avoid} icon={Ban} colorTheme="red" delay={0.5} />
        <InsightCard title="Home Care Tips" items={data?.home_care_tips} icon={Home} colorTheme="cyan" delay={0.6} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard title="Risk Factors" items={data?.risk_factors} icon={AlertTriangle} colorTheme="amber" delay={0.7} />
        <InsightCard title="Follow-Up Questions" items={data?.follow_up_questions} icon={MessageCircleQuestion} colorTheme="blue" delay={0.8} />
      </div>
    </div>
  );
};

const AIInsights = () => {
  const { appointmentId } = useParams();
  if (!appointmentId) return <InsightsHub />;
  return <InsightDetail appointmentId={appointmentId} />;
};

export default AIInsights;
