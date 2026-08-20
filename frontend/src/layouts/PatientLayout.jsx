import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HealthChatbot from '../components/HealthChatbot';
import { LayoutDashboard, Calendar, FileText, Pill, BrainCircuit } from 'lucide-react';

const patientLinks = [
  { name: 'Dashboard', href: '/patient-dashboard', icon: LayoutDashboard },
  { name: 'My Appointments', href: '/appointments', icon: Calendar },
  { name: 'My Reports', href: '/reports', icon: FileText },
  { name: 'Prescriptions', href: '/prescriptions', icon: Pill },
  { name: 'AI Insights', href: '/ai-insights', icon: BrainCircuit },
];

const PatientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 relative">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar links={patientLinks} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-30">
        <Sidebar links={patientLinks} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
        {/* Floating Health Assistant Chatbot Widget */}
        <HealthChatbot />
      </div>
    </div>
  );
};

export default PatientLayout;
