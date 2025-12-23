
import React, { useState, useEffect } from 'react';
import { CareerMatch } from '../types';

interface JobAlertsProps {
  career: CareerMatch;
  onClose: () => void;
  defaultLocation?: string;
}

const JobAlerts: React.FC<JobAlertsProps> = ({ career, onClose, defaultLocation }) => {
  const [preferences, setPreferences] = useState({
    location: defaultLocation || 'Remote',
    salary: career.salaryRange.split('-')[0].replace(/[^0-9kK$]/g, '').trim() || '$50k',
    frequency: 'Daily',
    keywords: career.title
  });
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const scanMessages = [
    "Connecting to global talent pools...",
    "Filtering for your narrative context...",
    "Matching salary benchmarks...",
    "Verifying growth potential..."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
  };

  useEffect(() => {
    if (isScanning && scanStep < scanMessages.length) {
      const timer = setTimeout(() => {
        setScanStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (isScanning && scanStep === scanMessages.length) {
      setSubmitted(true);
      setIsScanning(false);
    }
  }, [isScanning, scanStep]);

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[3.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] max-w-xl w-full p-12 relative animate-in zoom-in duration-300 border border-indigo-50">
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900 transition-all hover:scale-110">
          <i className="fa-solid fa-xmark text-3xl"></i>
        </button>

        {isScanning ? (
          <div className="py-20 flex flex-col items-center text-center space-y-10 animate-in fade-in duration-500">
             <div className="relative h-32 w-32">
                <div className="absolute inset-0 border-[10px] border-slate-50 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <i className="fa-solid fa-satellite-dish text-3xl text-indigo-600 animate-bounce"></i>
                </div>
             </div>
             <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900">Scanning Market</h3>
                <p className="text-indigo-600 font-black uppercase text-xs tracking-widest h-4">{scanMessages[scanStep] || "Finalizing..."}</p>
             </div>
          </div>
        ) : !submitted ? (
          <form onSubmit={handleSubmit} className="space-y-10">
            <header className="space-y-4">
              <div className="h-20 w-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl shadow-inner border border-indigo-100">
                <i className="fa-solid fa-envelope-open-text"></i>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Set Career Alerts</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">We'll alert you the moment an authentic <b>{career.title}</b> role opens up that fits your profile.</p>
            </header>

            <div className="grid gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Target Keywords</label>
                <input 
                  value={preferences.keywords}
                  onChange={(e) => setPreferences({...preferences, keywords: e.target.value})}
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-black text-slate-800"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Location</label>
                  <div className="relative">
                    <i className="fa-solid fa-location-dot absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                    <input 
                      value={preferences.location}
                      onChange={(e) => setPreferences({...preferences, location: e.target.value})}
                      className="w-full p-5 pl-12 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Min Salary</label>
                  <div className="relative">
                    <i className="fa-solid fa-dollar-sign absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                    <input 
                      value={preferences.salary}
                      onChange={(e) => setPreferences({...preferences, salary: e.target.value})}
                      className="w-full p-5 pl-12 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-6 bg-indigo-600 text-white font-black text-lg rounded-3xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Activate My Feed
            </button>
          </form>
        ) : (
          <div className="text-center py-10 space-y-10 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-lg rotate-3">
               <i className="fa-solid fa-check-double"></i>
             </div>
             <div className="space-y-3">
                <h3 className="text-4xl font-black text-slate-900">Alerts Live!</h3>
                <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto">Expect your first curated alert for <b>{preferences.keywords}</b> in {preferences.location} within 24 hours.</p>
             </div>
             <button 
                onClick={onClose} 
                className="px-12 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all hover:scale-105"
              >
                Return to Dashboard
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAlerts;
