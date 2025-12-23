
import React, { useState } from 'react';
import { ReflectionData, PsychometricScores, CareerMatch } from '../types';

interface UserProfileProps {
  data: ReflectionData;
  scores: PsychometricScores | null;
  status: string;
  achievements?: string[];
  savedCareers?: CareerMatch[];
  onToggleSave?: (career: CareerMatch) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  data, 
  scores, 
  status, 
  achievements = [], 
  savedCareers = [],
  onToggleSave
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'saved'>('stats');

  if (!data.name) return null;

  return (
    <div className="fixed bottom-24 left-10 z-[150] animate-in slide-in-from-left duration-700">
      {/* Expanded Profile View / Dashboard */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-6 w-96 bg-white rounded-[2.5rem] p-10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.2)] border border-indigo-50 animate-in slide-in-from-bottom-4 zoom-in duration-300 max-h-[70vh] flex flex-col">
          <header className="mb-6 space-y-1">
             <h4 className="text-2xl font-black text-slate-900 tracking-tight">{data.name}</h4>
             <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em]">{status}</p>
          </header>

          {/* Dashboard Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('stats')}
              className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'stats' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              My Stats
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeTab === 'saved' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Saved Paths
              {savedCareers.length > 0 && (
                <span className="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-md text-[8px]">{savedCareers.length}</span>
              )}
            </button>
          </div>

          <div className="overflow-y-auto flex-grow pr-2 space-y-10 custom-scrollbar">
            {activeTab === 'stats' ? (
              <>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Matrix</span>
                  <div className="grid grid-cols-5 gap-2 h-16 items-end">
                    {scores && Object.entries(scores).map(([k, v]) => (
                      <div key={k} className="flex flex-col items-center gap-2 group relative">
                        <div 
                          className="w-full bg-indigo-600 rounded-lg transition-all duration-1000 shadow-sm" 
                          style={{ height: `${(v as number) * 6}px` }}
                        ></div>
                        <span className="text-[8px] font-black text-slate-400 uppercase">{k.charAt(0)}</span>
                        <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {k}: {v}/10
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soft Skill Medals</span>
                  <div className="flex flex-wrap gap-2">
                    {achievements.length > 0 ? (
                      achievements.map((ach, idx) => (
                        <div key={idx} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg border border-amber-100 flex items-center gap-2 animate-in zoom-in">
                          <i className="fa-solid fa-award"></i>
                          {ach}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-bold text-slate-400 italic">No medals earned yet. Play Scenario Architect!</p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">North Star Goal</span>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                    "{data.goals || "Finding my path..."}"
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {savedCareers.length > 0 ? (
                  savedCareers.map((career, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between animate-in slide-in-from-right duration-300 group">
                      <div className="flex items-center gap-3">
                         <img 
                           src={`https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=100&seed=${career.imageSearchTerm}`} 
                           className="h-10 w-10 rounded-xl object-cover" 
                           alt=""
                         />
                         <div>
                           <h5 className="text-xs font-black text-slate-900">{career.title}</h5>
                           <p className="text-[10px] font-bold text-indigo-500 uppercase">{career.growthPotential} Growth</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => onToggleSave?.(career)}
                        className="h-8 w-8 rounded-lg bg-white text-slate-300 hover:text-pink-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <i className="fa-solid fa-heart-crack"></i>
                    </div>
                    <p className="text-xs font-bold text-slate-400">No saved careers yet.</p>
                    <p className="text-[10px] text-slate-300 mt-1">Heart a career card to save it here!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-5 p-3 pr-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 border-2 ${
          isOpen ? 'bg-indigo-600 border-indigo-500 text-white scale-105' : 'bg-white/90 backdrop-blur-xl border-indigo-50 text-slate-900 hover:scale-105'
        }`}
      >
        <div className={`h-14 w-14 rounded-full flex items-center justify-center text-xl font-black shadow-lg transition-all ${
          isOpen ? 'bg-white text-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
        }`}>
          {data.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left">
          <p className={`text-sm font-black transition-colors ${isOpen ? 'text-white' : 'text-slate-900'}`}>{data.name}</p>
          <div className="flex items-center gap-2">
            <p className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isOpen ? 'text-indigo-200' : 'text-indigo-500'}`}>
              {isOpen ? 'Close Dashboard' : 'View Dashboard'}
            </p>
            {savedCareers.length > 0 && !isOpen && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-pink-500"></span>
            )}
          </div>
        </div>
        <i className={`fa-solid fa-chevron-up transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
