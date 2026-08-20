import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, ArrowRight, Calendar, FileText, Pill, 
  BrainCircuit, ShieldCheck, Clock, Users, Shield, 
  Heart, Star, ChevronDown, CheckCircle2, ChevronRight,
  PlayCircle, MapPin, Phone, Search, Stethoscope, Mail, Newspaper, ExternalLink
} from 'lucide-react';
import NavbarPublic from '../components/NavbarPublic';
import api from '../api/axios';

const professionalImages = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1594824416752-d17dc7db4104?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300"
];

// Common Framer Motion Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
};

const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" },
  hover: { scale: 1.02, y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }
};

const pageTransition = {
  initial: { opacity: 0, filter: "blur(10px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(10px)" }
};

const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const controls = animate(count, value, { duration: 3, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
};

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (specialty) params.append('specialty', specialty);
    navigate(`/team?${params.toString()}`);
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-950">
      {/* Animated Floating Orbs & Grid Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full filter blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="absolute top-1/3 right-10 w-[28rem] h-[28rem] bg-blue-600/15 rounded-full filter blur-[120px]"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-12">
          
          <div className="lg:w-1/2 text-left">
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wide uppercase mb-6 shadow-lg shadow-cyan-500/5">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                The Premier Healthcare Intelligence Marketplace
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight mb-6 leading-tight">
                Find Specialists. <br/>
                Vault Records. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">AI Clinical Insights.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-base text-slate-400 mb-8 max-w-xl leading-relaxed font-normal">
                Book instantly with top board-certified specialists, access your encrypted health vault, and let our Clinical AI Engine parse your diagnostics in real time.
              </motion.p>
              
              <motion.div variants={fadeUp} className="bg-slate-900/80 backdrop-blur-2xl p-2.5 rounded-2xl shadow-2xl border border-slate-800/90 max-w-xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 relative z-10">
                  <div className="relative flex-grow flex items-center">
                    <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search specialists, symptoms, conditions..." 
                      className="w-full pl-10 pr-4 py-3 text-xs font-medium rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500/50 text-slate-100 placeholder-slate-500 bg-slate-950/60 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative sm:w-44 flex-shrink-0 flex items-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-2">
                    <Stethoscope className="absolute left-3.5 h-4 w-4 text-slate-400" />
                    <select 
                      className="w-full pl-9 pr-6 py-3 text-xs font-medium rounded-xl border-transparent focus:outline-none bg-transparent text-slate-300 appearance-none cursor-pointer"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    >
                      <option value="" className="bg-slate-900 text-slate-200">All Specialties</option>
                      <option value="cardiology" className="bg-slate-900 text-slate-200">Cardiology</option>
                      <option value="neurology" className="bg-slate-900 text-slate-200">Neurology</option>
                      <option value="pediatrics" className="bg-slate-900 text-slate-200">Pediatrics</option>
                      <option value="orthopedics" className="bg-slate-900 text-slate-200">Orthopedics</option>
                      <option value="general" className="bg-slate-900 text-slate-200">General</option>
                    </select>
                    <ChevronDown className="absolute right-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                  <button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex-shrink-0 flex items-center justify-center gap-2 mt-2 sm:mt-0 active:scale-95">
                    Search
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotateY: 6 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl h-[480px]"
            >
              <div className="relative h-full w-full overflow-hidden">
                <motion.img 
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1200" 
                  alt="AI Healthcare Platform" 
                  className="w-full h-full object-cover filter brightness-90 saturate-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              </div>
              
              <motion.div 
                 initial={{ y: 50, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.8 }}
                 className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100 font-display">Verified Medical Council</div>
                    <div className="text-[11px] text-slate-400">Board-certified clinical specialists</div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Specialties = () => {
  const navigate = useNavigate();
  const specs = [
    { name: 'Cardiology', icon: Heart, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { name: 'Neurology', icon: BrainCircuit, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { name: 'Pediatrics', icon: Users, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Orthopedics', icon: Activity, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { name: 'General Medicine', icon: Stethoscope, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { name: 'Diagnostics', icon: FileText, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  ];

  return (
    <div className="py-20 bg-slate-950 border-t border-slate-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-between items-end mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-2">Clinical Specialties</h2>
            <p className="text-xs text-slate-400">Discover top board-certified specialists across critical care fields.</p>
          </div>
          <Link to="/team" className="hidden sm:flex items-center text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
            View All Specialties <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </motion.div>
        
        <motion.div 
           variants={staggerContainer}
           initial="hidden"
           whileInView="show"
           viewport={{ once: true, margin: "-50px" }}
           className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {specs.map((s, i) => (
            <motion.button 
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/team?specialty=${s.name.toLowerCase()}`)}
              className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700 shadow-xl flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className={`h-12 w-12 rounded-xl border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-200 text-xs group-hover:text-cyan-400 transition-colors font-display">{s.name}</h3>
            </motion.button>
          ))}
        </motion.div>
        
        <Link to="/team" className="sm:hidden mt-6 flex items-center justify-center w-full bg-slate-900 border border-slate-800 py-3 rounded-xl text-cyan-400 text-xs font-bold">
          View All Specialties
        </Link>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    { title: "Appointment Scheduling", desc: "Book seamless virtual or in-person consultations with instant confirmation.", icon: Calendar, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { title: "Digital Prescriptions", desc: "Access high-security e-prescriptions directly from your encrypted clinical portal.", icon: Pill, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { title: "Medical Record Vault", desc: "Securely store and parse all lab results in a centralized HIPAA-grade vault.", icon: FileText, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { title: "Longitudinal Analytics", desc: "Track health trends with automated longitudinal charts and risk scores.", icon: Activity, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" }
  ];

  return (
    <div id="services" className="py-24 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">Next-Generation Clinical Suite</h2>
          <p className="text-sm text-slate-400">Everything required for friction-free healthcare management in one unified workspace.</p>
        </motion.div>
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f, i) => (
            <motion.div 
               key={i} 
               variants={fadeUp}
               whileHover={{ y: -5 }}
               className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/90 hover:border-slate-700 shadow-xl transition-all group"
            >
              <div className={`h-11 w-11 rounded-xl border flex items-center justify-center mb-5 ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-display text-slate-100 mb-2">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed text-xs">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800"
];

const FallbackMedicalImage = ({ index }) => {
  const imageUrl = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  
  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900">
      <motion.img 
        src={imageUrl} 
        alt="Healthcare"
        className="w-full h-full object-cover filter brightness-90 saturate-110"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 20 + (index % 5), repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

const ResearchHubPreview = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ai-engine/news/?category=All').then(res => {
      setArticles(res.data.slice(0, 3));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-24 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="flex justify-between items-end mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold mb-3 uppercase tracking-wider">
              <Newspaper className="h-3 w-3" /> Intelligence Feed
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-2">Research & Insights</h2>
            <p className="text-xs text-slate-400">AI-summarized peer-reviewed medical publications and clinical developments.</p>
          </div>
          <Link to="/blog" className="hidden sm:flex items-center text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl transition-all">
            Explore All Research <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <motion.div 
                 key={i} 
                 className="h-80 bg-slate-900/60 border border-slate-800 rounded-3xl"
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            ))}
          </div>
        ) : (
          <motion.div 
             variants={staggerContainer}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true }}
             className="grid md:grid-cols-3 gap-6"
          >
            {articles.map((article, i) => (
              <motion.div key={article.id} variants={fadeUp} whileHover={{ y: -6 }}>
                <Link to="/blog" className="block bg-slate-900/60 rounded-3xl border border-slate-800/90 overflow-hidden shadow-xl hover:border-slate-700 transition-all duration-300 flex flex-col h-80 group relative">
                  <div className="h-36 overflow-hidden bg-slate-950 relative z-10">
                    {article.thumbnail_url ? (
                      <>
                        <motion.img 
                           src={article.thumbnail_url} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      </>
                    ) : (
                      <FallbackMedicalImage index={i} />
                    )}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-cyan-400 rounded-lg border border-cyan-500/20">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow relative z-10">
                    <h3 className="font-bold font-display text-slate-100 text-sm mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors leading-snug">{article.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-grow leading-relaxed">
                      {article.short_description ? article.short_description.replace(/<[^>]+>/g, '') : 'Explore full peer-reviewed study details and AI clinical synthesis.'}
                    </p>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between mt-auto border-t border-slate-800/60 pt-3">
                      <span>{article.source}</span>
                      <span>{new Date(article.published_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const AIWorkflow = () => (
  <div id="ai-showcase" className="py-24 bg-slate-900 text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#3b82f6_1px,_transparent_1px)] [background-size:24px_24px]"></div>
    
    <motion.div 
      animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"
    />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold mb-6"
          >
            <BrainCircuit className="h-4 w-4" /> AI Healthcare Showcase
          </motion.div>
          <motion.h2 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
          >
            Clinical intelligence, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">delivered instantly.</span>
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-lg text-slate-300 mb-10 leading-relaxed"
          >
            Our proprietary AI pipeline ingests unstructured medical PDFs, extracts vital diagnostic parameters, and generates personalized, clinical-grade summaries before you even step into the doctor's office.
          </motion.p>
          
          <motion.div 
             variants={staggerContainer}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true }}
             className="space-y-6"
          >
            {[
              { title: "Upload Report", desc: "Securely vault your lab results." },
              { title: "AI Analysis", desc: "NLP models parse complex medical jargon." },
              { title: "Executive Summary", desc: "Get an instant, readable health overview." }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-4 items-center group">
                <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold group-hover:bg-cyan-500/20 transition-colors">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">{step.title}</h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <div className="lg:w-1/2 w-full">
           <motion.div 
              initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
              whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1.2 }}
              className="relative rounded-3xl bg-slate-800 p-8 shadow-2xl border border-slate-700"
              style={{ perspective: 1000 }}
           >
              <div className="relative z-10 space-y-4">
                <motion.div 
                   initial={{ x: 50, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.5 }}
                   className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-5 flex items-center gap-4"
                >
                   <div className="h-12 w-12 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><FileText /></div>
                   <div>
                      <div className="text-slate-200 font-bold">blood_test_results.pdf</div>
                      <div className="text-slate-400 text-sm">Analyzed in 1.2s</div>
                   </div>
                   <CheckCircle2 className="ml-auto text-emerald-400 h-6 w-6" />
                </motion.div>

                <div className="h-8 border-l-2 border-dashed border-slate-700 ml-11"></div>

                <motion.div 
                   initial={{ x: 50, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.8 }}
                   className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-6"
                >
                   <div className="flex items-center gap-2 text-cyan-400 font-bold mb-4">
                      <BrainCircuit className="h-5 w-5" /> Executive Summary
                   </div>
                   <div className="space-y-3">
                      <motion.div className="h-3 bg-slate-800 rounded w-full" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}></motion.div>
                      <motion.div className="h-3 bg-slate-800 rounded w-5/6" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}></motion.div>
                      <motion.div className="h-3 bg-slate-800 rounded w-4/6" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}></motion.div>
                   </div>
                   <div className="mt-6 flex gap-3">
                      <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30">HbA1c: Normal</div>
                      <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">Cholesterol: Elevated</div>
                   </div>
                </motion.div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  </div>
);

const TopDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors/profile/').then(res => {
      const docs = Array.isArray(res.data) ? res.data : res.data.results || [];
      setDoctors(docs.slice(0, 4));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-24 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">Distinguished Clinical Faculty</h2>
          <p className="text-sm text-slate-400">Renowned medical leaders and specialists available for immediate consult.</p>
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[1,2,3,4].map(i => (
               <motion.div 
                 key={i} 
                 className="h-96 bg-slate-900/60 border border-slate-800 rounded-3xl"
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
               />
             ))}
          </div>
        ) : doctors.length > 0 ? (
          <motion.div 
             variants={staggerContainer}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true }}
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {doctors.map((member, i) => (
              <motion.div 
                 key={member.id} 
                 variants={fadeUp}
                 whileHover={{ y: -6 }}
                 className="bg-slate-900/60 rounded-3xl border border-slate-800/90 overflow-hidden shadow-xl hover:border-slate-700 transition-all group"
              >
                <div className="h-60 overflow-hidden relative">
                  <motion.img 
                     src={professionalImages[i % professionalImages.length]} 
                     alt={`Dr. ${member.user_name}`} 
                     className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>
                <div className="p-5 text-center relative z-10">
                  <h3 className="text-base font-bold font-display text-slate-100 mb-1">Dr. {member.first_name ? `${member.first_name} ${member.last_name}` : member.user_name}</h3>
                  <p className="text-cyan-400 font-semibold text-xs mb-3">{member.specialization || "General Specialist"}</p>
                  <div className="w-8 h-0.5 bg-cyan-500/30 mx-auto rounded-full mb-3" />
                  <p className="text-slate-400 text-xs font-mono">{member.qualifications || "MD, Board Certified"}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10 text-slate-500 text-xs">No clinical faculty currently listed.</div>
        )}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="text-center mt-12"
        >
          <Link to="/team" className="inline-flex items-center justify-center rounded-xl bg-slate-900/80 border border-slate-800 px-7 py-3 text-xs font-bold text-slate-200 hover:text-white hover:border-cyan-500/50 transition-all shadow-lg active:scale-95">
            View Full Clinical Directory
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const AboutUs = () => (
  <div id="about" className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/80 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl">
        <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-3xl md:text-5xl font-extrabold font-display text-white mb-6 leading-tight"
        >
           Redefining Clinical Care Delivery.
        </motion.h2>
        <motion.p 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="text-slate-300 text-base md:text-lg leading-relaxed mb-10 font-normal"
        >
          HealthAI was engineered to eliminate medical administrative friction. By fusing hospital-grade diagnostic workflows with cutting-edge LLM parsing, we empower clinicians and patients with transparent, automated health management.
        </motion.p>
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.4 }}
           className="flex gap-10"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800">
            <div className="text-3xl md:text-4xl font-extrabold font-display text-cyan-400 mb-1">
               <AnimatedNumber value={500} />+
            </div>
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Patients Managed</div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800">
            <div className="text-3xl md:text-4xl font-extrabold font-display text-cyan-400 mb-1">
               <AnimatedNumber value={98} />%
            </div>
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Clinical Satisfaction</div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

const Timeline = () => {
  const steps = [
    { step: "01", title: "Secure Onboarding", desc: "Initialize your patient account with biometric & encrypted profile security.", align: "left" },
    { step: "02", title: "Automated Record Ingestion", desc: "Upload diagnostic PDFs. Clinical AI parses lab parameters & generates risk flags.", align: "right" },
    { step: "03", title: "Specialist Consultation", desc: "Book appointments with top specialists and receive structured e-care plans.", align: "left" },
    { step: "04", title: "Longitudinal Monitoring", desc: "Continuous biometric tracking, prescription auto-refills, and AI status alerts.", align: "right" }
  ];

  return (
    <div className="py-24 bg-slate-950 border-t border-slate-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">Structured Patient Journey</h2>
          <p className="text-sm text-slate-400">Step-by-step clinical workflow designed for continuous health optimization.</p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto relative">
          <motion.div 
             initial={{ height: 0 }}
             whileInView={{ height: "100%" }}
             viewport={{ once: true }}
             transition={{ duration: 2, ease: "easeInOut" }}
             className="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-indigo-500 rounded-full"
          />
          <div className="space-y-12">
            {steps.map((item, idx) => (
              <motion.div 
                 key={idx} 
                 initial={{ opacity: 0, x: item.align === 'left' ? 40 : -40 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ type: "spring", duration: 1 }}
                 className={`flex flex-col md:flex-row items-start md:items-center justify-between w-full ${item.align === 'left' ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="hidden md:block w-5/12"></div>
                <div className="z-20 relative md:static mb-4 md:mb-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-900 border-2 border-cyan-500/50 rounded-2xl shadow-lg shadow-cyan-500/20 text-cyan-400 font-bold text-xs font-mono">
                    {item.step}
                  </div>
                </div>
                <div className={`w-full pl-12 md:pl-0 md:w-5/12 ${item.align === 'left' ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div 
                     whileHover={{ y: -4 }}
                     className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl"
                  >
                    <h3 className="text-base font-bold font-display text-slate-100 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactUs = () => (
  <div id="contact" className="py-24 bg-slate-950 border-t border-slate-800/80">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-16">
        <motion.div 
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="lg:w-1/3"
        >
          <h2 className="text-3xl font-bold font-display text-white mb-4">Clinical Inquiries</h2>
          <p className="text-xs text-slate-400 mb-8 leading-relaxed">Questions about platform integration or enterprise clinic deployment? Our support team responds 24/7.</p>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="h-11 w-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all"><Phone className="h-5 w-5" /></div>
              <div>
                <div className="font-bold text-xs text-slate-200">Emergency & Line</div>
                <div className="text-xs text-slate-400 group-hover:text-cyan-400 transition-colors">+1 (800) 123-4567</div>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all"><Mail className="h-5 w-5" /></div>
              <div>
                <div className="font-bold text-xs text-slate-200">Clinical Desk</div>
                <div className="text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">support@healthai.com</div>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="h-11 w-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all"><MapPin className="h-5 w-5" /></div>
              <div>
                <div className="font-bold text-xs text-slate-200">Headquarters</div>
                <div className="text-xs text-slate-400 group-hover:text-purple-400 transition-colors">San Francisco, CA</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="lg:w-2/3"
        >
          <form className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">First Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-slate-600" placeholder="Jane" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Last Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-slate-600" placeholder="Doe" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-slate-600" placeholder="jane@clinic.org" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Message</label>
              <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-slate-600" placeholder="How can our clinical engineering team assist?"></textarea>
            </div>
            <div className="sm:col-span-2">
              <motion.button 
                 whileHover={{ scale: 1.01 }}
                 whileTap={{ scale: 0.99 }}
                 type="button" 
                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                Send Inquiry
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  </div>
);

const FAQAccordion = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-slate-800 rounded-2xl mb-4 bg-slate-900/60 backdrop-blur-xl overflow-hidden transition-all"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <span className="font-bold text-slate-200 text-xs font-display">{q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-slate-400 text-xs border-t border-slate-800/60 mt-1 leading-relaxed">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => (
  <div className="py-24 bg-slate-950 border-t border-slate-800/80">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">Frequently Asked Questions</h2>
        <p className="text-xs text-slate-400">Everything you need to know about HealthAI security, analysis, and consultations.</p>
      </motion.div>
      <FAQAccordion q="How does the AI Clinical Synthesis work?" a="Our engine ingests uploaded medical report PDFs using high-precision NLP models to extract vital diagnostic parameters, categorize risk levels, and output executive clinical summaries." />
      <FAQAccordion q="Is patient data stored with enterprise encryption?" a="Yes. HealthAI enforces strict data encryption at rest and in transit. Only authorized attending physicians and the patient retain record decryption keys." />
      <FAQAccordion q="Can digital e-prescriptions be downloaded directly?" a="Once issued by a board-certified physician, e-prescriptions are instantly available in your encrypted portal as printable PDFs." />
      <FAQAccordion q="Can both patients and doctors vault medical files?" a="Yes. Both patients and assigned care team members can upload lab results, diagnostic scans, and medical histories to the patient vault." />
      <FAQAccordion q="What is the precision level of AI risk scoring?" a="Our models are trained on validated clinical benchmark data. AI insights are provided with confidence metrics to assist professional medical evaluation." />
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-md shadow-cyan-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold font-display text-white tracking-tight">Health<span className="text-cyan-400">AI</span></span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Delivering next-generation, AI-powered healthcare management for clinics and patients globally.
          </p>
        </div>
        <div>
          <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider mb-6">Platform</h4>
          <ul className="space-y-3 text-xs text-slate-400">
            <li><Link to="/register" className="hover:text-cyan-400 transition-colors">For Patients</Link></li>
            <li><Link to="/register" className="hover:text-cyan-400 transition-colors">For Doctors</Link></li>
            <li><a href="#ai-showcase" className="hover:text-cyan-400 transition-colors">AI Engine</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider mb-6">Company</h4>
          <ul className="space-y-3 text-xs text-slate-400">
            <li><a href="#about" className="hover:text-cyan-400 transition-colors">About Us</a></li>
            <li><Link to="/team" className="hover:text-cyan-400 transition-colors">Our Specialists</Link></li>
            <li><Link to="/blog" className="hover:text-cyan-400 transition-colors">Research Hub</Link></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider mb-6">Legal</h4>
          <ul className="space-y-3 text-xs text-slate-400">
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">HIPAA Compliance</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-800/80 text-center flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-xs">© {new Date().getFullYear()} HealthAI Systems Inc. All rights reserved.</p>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
           Crafted with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for clinical excellence.
        </div>
      </div>
    </div>
  </footer>
);

const Home = () => {
  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-slate-950 font-sans selection:bg-cyan-500/20 selection:text-cyan-300"
    >
      <NavbarPublic />
      <main>
        <Hero />
        <Specialties />
        <Features />
        <ResearchHubPreview />
        <AIWorkflow />
        <TopDoctors />
        <AboutUs />
        <Timeline />
        <FAQ />
        <ContactUs />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Home;
