
import React, { useState } from 'react';
import { AIAnalysis, PsychometricScores, CareerMatch } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import JobAlerts from './JobAlerts';

interface ResultsProps {
  analysis: AIAnalysis;
  scores: PsychometricScores;
  onReset: () => void;
  onPlayScenario: (career: CareerMatch) => void;
  initialLocation?: string;
  savedCareers: CareerMatch[];
  onToggleSave: (career: CareerMatch) => void;
}

const Results: React.FC<ResultsProps> = ({ 
  analysis, 
  scores, 
  onReset, 
  onPlayScenario, 
  initialLocation,
  savedCareers,
  onToggleSave
}) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [helpfulnessRating, setHelpfulnessRating] = useState(0);
  const [comments, setComments] = useState('');
  const [alertCareer, setAlertCareer] = useState<CareerMatch | null>(null);

  const chartData = [
    { subject: 'Analytical', A: scores.analytical, fullMark: 10 },
    { subject: 'Creative', A: scores.creative, fullMark: 10 },
    { subject: 'Social', A: scores.social, fullMark: 10 },
    { subject: 'Leadership', A: scores.leadership, fullMark: 10 },
    { subject: 'Practical', A: scores.practical, fullMark: 10 },
  ];

  const RatingStars = ({ rating, setRating, label }: { rating: number, setRating: (r: number) => void, label: string }) => (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
      <div className="flex gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-3xl transition-all duration-300 hover:scale-125 focus:outline-none ${
              star <= rating ? 'text-amber-400' : 'text-slate-100 hover:text-amber-200'
            }`}
          >
            <i className={`fa-solid fa-star`}></i>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-24 animate-in fade-in duration-1000 pb-32 relative">
      {alertCareer && (
        <JobAlerts 
          career={alertCareer} 
          onClose={() => setAlertCareer(null)} 
          defaultLocation={initialLocation} 
        />
      )}

      {/* Hero Result Section */}
      <section className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_32px_128px_-32px_rgba(79,70,229,0.15)] border border-indigo-50 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <div className="inline-block px-6 py-2 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black tracking-[0.3em] uppercase border border-indigo-100">
            Psychometric Profile Matched
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            The <span className="text-indigo-600">{analysis.persona}</span>
          </h1>
          <p className="text-2xl text-slate-500 leading-relaxed font-medium">
            {analysis.summary}
          </p>
          
          <div className="bg-slate-50 border-l-8 border-indigo-600 p-10 rounded-[2.5rem] shadow-inner relative">
            <i className="fa-solid fa-quote-left absolute top-4 left-4 text-4xl text-indigo-100"></i>
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Empathetic Analysis</h3>
            <p className="text-slate-700 italic font-bold text-xl leading-relaxed">
              "{analysis.empatheticNote}"
            </p>
          </div>

          <button 
            onClick={onReset} 
            className="group flex items-center gap-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-indigo-600 transition-all"
          >
            <i className="fa-solid fa-rotate-left group-hover:rotate-[-90deg] transition-transform duration-500 text-lg"></i>
            Reset Assessment
          </button>
        </div>

        <div className="h-[500px] w-full flex items-center justify-center bg-slate-50/50 rounded-[3.5rem] p-10 border border-slate-100 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent"></div>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900, textAnchor: 'middle' }} />
              <Radar 
                name="You" 
                dataKey="A" 
                stroke="#4f46e5" 
                strokeWidth={5} 
                fill="#4f46e5" 
                fillOpacity={0.3} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Career Alerts Section */}
      <section className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-20 w-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-4xl shadow-lg rotate-3">
              <i className="fa-solid fa-fire-flame-curved"></i>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Authentic Career Matches</h2>
            <p className="text-xl text-slate-500 font-bold">Real-time alerts generated from your narrative context.</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
             <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Searching Market 2025</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {analysis.topCareers.map((career, idx) => {
            const isSaved = savedCareers.some(c => c.title === career.title);
            return (
              <article key={idx} className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden hover:shadow-[0_48px_64px_-24px_rgba(0,0,0,0.12)] transition-all duration-700 flex flex-col group hover:translate-y-[-10px]">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800&seed=${career.imageSearchTerm}`} 
                    alt={career.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute top-6 right-6 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {career.growthPotential} Growth
                  </div>
                  <button 
                    onClick={() => onToggleSave(career)}
                    className={`absolute top-6 left-6 h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                      isSaved ? 'bg-pink-500 text-white shadow-pink-200 shadow-lg' : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-pink-500'
                    }`}
                  >
                    <i className={`fa-solid fa-heart ${isSaved ? 'animate-in zoom-in' : ''}`}></i>
                  </button>
                </div>
                <div className="p-10 flex-grow flex flex-col space-y-8">
                  <h3 className="text-3xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {career.title}
                  </h3>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setAlertCareer(career)}
                      className="flex-grow py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                    >
                      Set Alerts
                    </button>
                    <button 
                      onClick={() => onPlayScenario(career)}
                      className="flex-grow py-3 bg-violet-50 text-violet-600 border border-violet-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all active:scale-95"
                    >
                      Simulate Role
                    </button>
                  </div>

                  <p className="text-slate-600 font-medium leading-relaxed line-clamp-4">
                    {career.description}
                  </p>
                  
                  <div className="mt-auto pt-8 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Salary Range</span>
                      <span className="text-lg font-black text-slate-900">{career.salaryRange}</span>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">"{career.reasoning}"</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Feedback Section */}
      <section className="max-w-5xl mx-auto">
        <div className={`bg-white rounded-[4rem] shadow-2xl border border-slate-100 p-12 md:p-20 transition-all duration-700 ${feedbackSubmitted ? 'bg-indigo-50 border-indigo-200' : ''}`}>
          {!feedbackSubmitted ? (
            <div className="space-y-16">
              <header className="text-center space-y-4">
                <h2 className="text-5xl font-black text-slate-900 tracking-tight">Was this helpful?</h2>
                <p className="text-xl text-slate-500 font-bold">We refine our career algorithms based on your authentic feedback.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <RatingStars label="Algorithm Accuracy" rating={accuracyRating} setRating={setAccuracyRating} />
                <RatingStars label="Advice Quality" rating={helpfulnessRating} setRating={setHelpfulnessRating} />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share more details (Optional)</label>
                <textarea 
                  value={comments} 
                  onChange={e => setComments(e.target.value)}
                  placeholder="Tell us how we can make this more authentic for you..." 
                  className="w-full h-32 p-8 rounded-[2rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium text-lg"
                />
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => setFeedbackSubmitted(true)}
                  disabled={!accuracyRating || !helpfulnessRating}
                  className="px-16 py-6 bg-slate-900 text-white font-black text-lg rounded-3xl shadow-2xl hover:bg-indigo-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                >
                  Submit Review
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-indigo-200">
                <i className="fa-solid fa-heart animate-pulse"></i>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-black text-indigo-950">Insight Recorded!</h2>
                <p className="text-xl text-indigo-600 font-bold">Your feedback is helping us build a more equitable future for youth career guidance.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Motivational Media Section */}
      <section className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 space-y-20">
          <header className="text-center md:text-left space-y-4">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter">Deep Dive Resources</h2>
            <p className="text-slate-400 text-xl font-medium max-w-3xl">Chosen by Gemini to resonate with your personal story and specific ambitions.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {analysis.motivationalVideos.map((video, idx) => (
              <a 
                key={idx} 
                href={video.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-white/5 border border-white/10 p-10 rounded-[3rem] hover:bg-white/10 hover:border-indigo-500 transition-all block space-y-6"
              >
                <div className="h-48 bg-slate-800 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                   <div className="h-20 w-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center group-hover:scale-125 group-hover:bg-indigo-600 transition-all duration-500">
                      <i className="fa-solid fa-play text-3xl"></i>
                   </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-black group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">{video.title}</h4>
                  <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed">{video.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Grounding Sources */}
      {analysis.searchSources.length > 0 && (
        <section className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
             <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 border-2 border-slate-50 shadow-xl">
                <i className="fa-brands fa-google text-3xl"></i>
             </div>
             <div className="space-y-1">
                <h5 className="text-xl font-black text-slate-800">Verified Job Intelligence</h5>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Source: Live Search Grounding 2025</p>
             </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {analysis.searchSources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-black transition-all border border-slate-200 shadow-sm hover:shadow-indigo-100"
              >
                {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Results;
