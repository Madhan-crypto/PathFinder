
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { QuizStep, PsychometricScores, AIAnalysis, ReflectionData, CareerMatch } from './types';
import Quiz from './components/Quiz';
import Results from './components/Results';
import SelfReflection from './components/SelfReflection';
import ScenarioArchitect from './components/ScenarioArchitect';
import UserProfile from './components/UserProfile';
import { analyzeCareerPath } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<QuizStep>(QuizStep.START);
  const [scores, setScores] = useState<PsychometricScores | null>(null);
  const [reflection, setReflection] = useState<ReflectionData | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your profile...");
  const [activePanel, setActivePanel] = useState<'FRAMEWORK' | 'YOUTH_HUB' | 'RESOURCES' | null>(null);
  const [selectedCareerForGame, setSelectedCareerForGame] = useState<CareerMatch | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [savedCareers, setSavedCareers] = useState<CareerMatch[]>([]);
  const [userLocation, setUserLocation] = useState<string>('');
  
  const mainContentRef = useRef<HTMLElement>(null);

  // Initialize saved careers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pathfinder_saved_careers');
    if (saved) {
      try {
        setSavedCareers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved careers");
      }
    }
  }, []);

  // Persist saved careers
  useEffect(() => {
    localStorage.setItem('pathfinder_saved_careers', JSON.stringify(savedCareers));
  }, [savedCareers]);

  const startQuiz = () => setStep(QuizStep.QUIZ);

  // Attempt to get location early for job alerts
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
          const data = await res.json();
          setUserLocation(data.address.city || data.address.town || data.address.state || '');
        } catch (e) {
          console.warn("Could not reverse geocode location");
        }
      });
    }
  }, []);

  const handleQuizComplete = useCallback((finalScores: PsychometricScores) => {
    setScores(finalScores);
    setStep(QuizStep.REFLECTION);
  }, []);

  const handleReflectionComplete = useCallback(async (data: ReflectionData) => {
    setReflection(data);
    setStep(QuizStep.ANALYZING);
    setLoadingMessage("Synthesizing your narrative with psychometric data...");
    
    if (scores) {
      try {
        const result = await analyzeCareerPath(scores, data);
        setAnalysis(result);
        setStep(QuizStep.RESULTS);
      } catch (error) {
        console.error(error);
        alert("Something went wrong with the AI analysis. Please try again.");
        setStep(QuizStep.START);
      }
    }
  }, [scores]);

  const handlePlayScenario = (career: CareerMatch) => {
    setSelectedCareerForGame(career);
    setStep(QuizStep.SCENARIO_GAME);
  };

  const handleGameAchievement = (achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
    }
  };

  const toggleSaveCareer = (career: CareerMatch) => {
    setSavedCareers(prev => {
      const exists = prev.find(c => c.title === career.title);
      if (exists) {
        return prev.filter(c => c.title !== career.title);
      }
      return [...prev, career];
    });
  };

  const reset = () => {
    setStep(QuizStep.START);
    setScores(null);
    setReflection(null);
    setAnalysis(null);
    setActivePanel(null);
    setSelectedCareerForGame(null);
  };

  useEffect(() => {
    if (step !== QuizStep.START) {
      mainContentRef.current?.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  const getStatus = () => {
    switch(step) {
      case QuizStep.QUIZ: return "Defining Potential";
      case QuizStep.REFLECTION: return "Writing Narrative";
      case QuizStep.ANALYZING: return "Deep Market Search";
      case QuizStep.RESULTS: return "Future Architect";
      case QuizStep.SCENARIO_GAME: return "Training Soft Skills";
      default: return "Ready to Begin";
    }
  };

  return (
    <div className="min-h-screen pb-32 selection:bg-indigo-100 selection:text-indigo-900 relative bg-slate-50">
      {/* Informational Panels Overlay */}
      {activePanel && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full p-12 relative animate-in zoom-in duration-300 border border-indigo-50">
            <button 
              onClick={() => setActivePanel(null)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all group"
            >
              <i className="fa-solid fa-xmark text-slate-500 group-hover:rotate-90 transition-transform"></i>
            </button>

            {activePanel === 'FRAMEWORK' && (
              <div className="space-y-8">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
                  <i className="fa-solid fa-microscope"></i>
                </div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">The Science of Selection</h3>
                <p className="text-slate-600 text-xl leading-relaxed font-medium">
                  We move beyond simple "interest" surveys. Our engine maps your <b>Psychometric Profile</b> (RIASEC based) against <b>Semantic Personal Narratives</b>.
                </p>
                <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-indigo-500">
                  <p className="text-slate-800 font-bold italic">"It's not just about what you like to do, it's about how you approach problems in your own story."</p>
                </div>
              </div>
            )}

            {activePanel === 'YOUTH_HUB' && (
              <div className="space-y-8 text-center py-8">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-lg">
                  <i className="fa-solid fa-earth-americas animate-spin-slow"></i>
                </div>
                <h3 className="text-4xl font-black text-slate-900">Global Youth Hub</h3>
                <p className="text-slate-500 text-lg font-medium">Join 50k+ students building the next generation of career paths.</p>
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-emerald-600 font-black text-xl">{i*15}k+</span>
                    <span className="text-[10px] font-black uppercase text-slate-400">Mentors</span>
                  </div>)}
                </div>
                <button className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-700 transition-all">Request Early Access</button>
              </div>
            )}

            {activePanel === 'RESOURCES' && (
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-slate-900 mb-8">Free Student Resources</h3>
                {['Interview Prep Kit', 'Resume Optimizer', 'Soft Skill Bootcamp'].map(res => (
                  <div key={res} className="p-5 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-between hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <i className="fa-solid fa-download"></i>
                      </div>
                      <span className="font-bold text-slate-800">{res}</span>
                    </div>
                    <i className="fa-solid fa-arrow-right text-slate-300 group-hover:translate-x-1 transition-transform"></i>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating User Profile Component */}
      {(reflection || savedCareers.length > 0) && (
        <UserProfile 
          data={reflection || { name: 'Guest', struggles: '', testimonies: '', fears: '', goals: '' }} 
          scores={scores} 
          status={getStatus()} 
          achievements={achievements}
          savedCareers={savedCareers}
          onToggleSave={toggleSaveCareer}
        />
      )}

      <header className="p-8 flex items-center justify-between max-w-7xl mx-auto relative z-10">
        <div 
          className="flex items-center gap-3 font-black text-3xl tracking-tighter text-indigo-600 select-none cursor-pointer group" 
          onClick={reset}
        >
          <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200 group-hover:scale-110 transition-transform" aria-hidden="true">
            <i className="fa-solid fa-compass-drafting"></i>
          </div>
          <span className="hidden sm:inline">PATHFINDER<span className="text-slate-800">AI</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-12 text-slate-500 font-black uppercase tracking-[0.2em] text-[11px]">
          <button onClick={() => setActivePanel('FRAMEWORK')} className="hover:text-indigo-600 transition-colors py-2 border-b-2 border-transparent hover:border-indigo-600">Framework</button>
          <button onClick={() => setActivePanel('YOUTH_HUB')} className="hover:text-emerald-600 transition-colors py-2 border-b-2 border-transparent hover:border-emerald-600 flex items-center gap-2">
            Youth Hub <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] animate-pulse">Live</span>
          </button>
          <button onClick={() => setActivePanel('RESOURCES')} className="hover:text-indigo-600 transition-colors py-2 border-b-2 border-transparent hover:border-indigo-600">Resources</button>
        </nav>
      </header>

      <main id="main-content" ref={mainContentRef} tabIndex={-1} className="px-6 py-12 max-w-7xl mx-auto focus:outline-none relative">
        {step === QuizStep.START && (
          <section className="flex flex-col lg:flex-row items-center gap-20 animate-in slide-in-from-bottom duration-1000">
            <div className="lg:w-1/2 text-center lg:text-left space-y-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black tracking-widest uppercase border border-indigo-100">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
                Official Youth Platform 2025
              </div>
              <h1 className="text-6xl lg:text-[7.5rem] font-black text-slate-900 leading-[0.9] tracking-tight">
                Dream bigger. <br/><span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Plan smarter.</span>
              </h1>
              <p className="text-2xl text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                The only career guide that listens to your <b>personal story</b>. We use advanced psychometrics and real-time grounding to build your future.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <button 
                  onClick={startQuiz} 
                  className="group relative px-12 py-6 bg-indigo-600 text-white font-black text-xl rounded-3xl shadow-[0_20px_40px_-15px_rgba(79,70,229,0.5)] hover:bg-indigo-700 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
                >
                  Start My Journey
                  <i className="fa-solid fa-arrow-right ml-4 group-hover:translate-x-2 transition-transform"></i>
                </button>
                <div className="flex items-center gap-4 text-left">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="h-10 w-10 rounded-full border-2 border-white shadow-sm" alt="Student"/>)}
                  </div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest leading-tight">
                    Trusted by <br/><span className="text-indigo-600">50k+ Students</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200 rounded-full blur-[80px] opacity-30 animate-pulse"></div>
               <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-200 rounded-full blur-[100px] opacity-30 animate-pulse delay-700"></div>
               <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000" 
                  className="rounded-[4rem] shadow-2xl border-4 border-white relative z-10 hover:rotate-1 transition-transform duration-1000" 
                  alt="Students collaborating"
                />
            </div>
          </section>
        )}

        {step === QuizStep.QUIZ && <Quiz onComplete={handleQuizComplete} />}
        {step === QuizStep.REFLECTION && <SelfReflection onSubmit={handleReflectionComplete} onBack={() => setStep(QuizStep.QUIZ)} />}
        
        {step === QuizStep.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-40 text-center space-y-12">
            <div className="relative">
              <div className="h-40 w-40 border-[16px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-brain text-4xl text-indigo-600 animate-pulse"></i>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">{loadingMessage}</h2>
              <p className="text-xl text-slate-500 font-bold max-w-xl mx-auto">Gemini is searching 100+ sources for authentic career paths that match your narrative.</p>
            </div>
          </div>
        )}

        {step === QuizStep.RESULTS && analysis && scores && (
          <Results 
            analysis={analysis} 
            scores={scores} 
            onReset={reset} 
            onPlayScenario={handlePlayScenario}
            initialLocation={userLocation}
            savedCareers={savedCareers}
            onToggleSave={toggleSaveCareer}
          />
        )}

        {step === QuizStep.SCENARIO_GAME && selectedCareerForGame && (
          <ScenarioArchitect 
            career={selectedCareerForGame} 
            onExit={() => setStep(QuizStep.RESULTS)} 
            onAchievement={handleGameAchievement}
          />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-5 bg-white/70 backdrop-blur-2xl border-t border-slate-100 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between px-6 gap-4">
           <div className="flex items-center gap-4">
              <div className="flex h-3 w-3 bg-emerald-500 rounded-full"></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">System Status: Operational • v2.5.0</p>
           </div>
           <div className="flex items-center gap-10">
              <div className="hidden lg:flex items-center gap-3">
                 <i className="fa-solid fa-shield-halved text-indigo-500"></i>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End-to-End Privacy Guaranteed</span>
              </div>
              <div className="flex gap-6 text-slate-400 text-lg">
                <i className="fa-brands fa-x-twitter hover:text-slate-900 cursor-pointer transition-colors"></i>
                <i className="fa-brands fa-linkedin-in hover:text-indigo-600 cursor-pointer transition-colors"></i>
                <i className="fa-brands fa-github hover:text-slate-900 cursor-pointer transition-colors"></i>
              </div>
           </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
