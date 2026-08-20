import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, BrainCircuit, Calendar, User, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import NavbarPublic from '../components/NavbarPublic';
import ErrorBanner from '../components/ErrorBanner';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await api.get('/ai-engine/news/');
        setArticles(res.data);
      } catch (err) {
        setError('Failed to fetch medical articles.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleAnalyze = async (article) => {
    setSelectedArticle(article);
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const res = await api.post(`/ai-engine/news/${article.id}/analyze/`);
      setAnalysis(res.data);
    } catch (err) {
      setError('Failed to analyze article with AI.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      <NavbarPublic />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
            <BrainCircuit className="h-3.5 w-3.5" /> Generative Clinical Literature Analysis
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Medical Intelligence & Research Hub
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Peer-reviewed breakthroughs, clinical trial breakdowns, and AI-synthesized executive summaries.
          </p>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading research publications...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {articles.map((art) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {art.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{art.published_date}</span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-white mb-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {art.short_description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">By {art.author}</span>
                  <button
                    onClick={() => handleAnalyze(art)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/10 hover:opacity-90 transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Synthesize Summary
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* AI Article Analysis Drawer/Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                      AI Article Synthesis
                    </span>
                    <h2 className="text-lg font-bold font-display text-white mt-2">
                      {selectedArticle.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-slate-400 hover:text-white text-sm font-bold p-1"
                  >
                    ✕
                  </button>
                </div>

                {analyzing ? (
                  <div className="text-center py-12 space-y-3">
                    <BrainCircuit className="h-10 w-10 text-cyan-400 animate-pulse mx-auto" />
                    <p className="text-xs text-slate-400">Synthesizing clinical trial findings & medical implications...</p>
                  </div>
                ) : analysis ? (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">Executive Summary</h4>
                      <p className="text-slate-200 leading-relaxed">{analysis.executive_summary}</p>
                    </div>

                    {analysis.key_findings && analysis.key_findings.length > 0 && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                        <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Key Findings</h4>
                        <ul className="list-disc pl-4 text-slate-300 space-y-1">
                          {analysis.key_findings.map((kf, i) => (
                            <li key={i}>{kf}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <h4 className="font-bold text-purple-400 uppercase tracking-wider text-[10px]">Why This Matters</h4>
                      <p className="text-slate-300 leading-relaxed">{analysis.why_this_matters}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <h4 className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">Doctor Perspective</h4>
                      <p className="text-slate-300 leading-relaxed">{analysis.doctor_perspective}</p>
                    </div>
                  </div>
                ) : null}

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                  >
                    Close Synthesis
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Blog;
