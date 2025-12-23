
import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../constants';
import { PsychometricScores } from '../types';

interface QuizProps {
  onComplete: (scores: PsychometricScores) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userScores, setUserScores] = useState<PsychometricScores>({
    analytical: 0,
    creative: 0,
    social: 0,
    leadership: 0,
    practical: 0
  });

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleOptionClick = (score: number) => {
    const updatedScores = {
      ...userScores,
      [currentQuestion.category]: userScores[currentQuestion.category] + score
    };
    setUserScores(updatedScores);

    // Trigger micro-animation for progress update
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete(updatedScores);
    }
  };

  const progress = Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100);

  // Dynamic progress bar colors based on completion percentage
  const getProgressColor = () => {
    if (progress < 30) return 'bg-indigo-600';
    if (progress < 70) return 'bg-violet-600';
    return 'bg-emerald-500';
  };

  const getShadowColor = () => {
    if (progress < 30) return 'rgba(79, 70, 229, 0.4)';
    if (progress < 70) return 'rgba(124, 58, 237, 0.4)';
    return 'rgba(16, 185, 129, 0.4)';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 bg-white rounded-[2rem] shadow-2xl border border-indigo-50 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      
      <div className="mb-12 relative">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]" id="quiz-progress-label">
              Assessment Phase
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black transition-all duration-300 ${isAnimating ? 'scale-110 text-indigo-600' : 'text-slate-900'}`}>
                {currentQuestionIndex + 1}
              </span>
              <span className="text-slate-300 font-bold">/ {QUESTIONS.length}</span>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`text-2xl font-black transition-all duration-500 flex items-center gap-1 ${progress === 100 ? 'text-emerald-500' : 'text-slate-800'}`}>
              {progress}%
              {progress === 100 && <i className="fa-solid fa-check-circle text-sm animate-bounce"></i>}
            </span>
          </div>
        </div>

        {/* Enhanced Progress Bar Container */}
        <div 
          className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-1 shadow-inner relative"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-labelledby="quiz-progress-label"
        >
          {/* Main Progress Bar */}
          <div 
            className={`h-full rounded-full transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) relative ${getProgressColor()}`} 
            style={{ 
              width: `${progress}%`,
              boxShadow: `0 0 20px ${getShadowColor()}`
            }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-[shimmer_2s_infinite]"></div>
            
            {/* Pulsing indicator at the tip */}
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg scale-125 ${getProgressColor()} animate-pulse`}></div>
          </div>
        </div>
      </div>

      <div className="relative mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
          {currentQuestion.text}
        </h2>
        <div className="mt-4 w-12 h-1.5 bg-indigo-600 rounded-full"></div>
      </div>

      <div className="grid gap-4" role="radiogroup" aria-labelledby="quiz-progress-label">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(option.score)}
            className="w-full text-left p-6 rounded-2xl border-2 border-slate-100 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 hover:translate-y-[-2px] focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 group flex justify-between items-center relative overflow-hidden active:scale-[0.98]"
          >
            {/* Subtle number indicator */}
            <div className="flex items-center gap-5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-400 text-xs font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-slate-800 font-bold text-lg group-hover:text-indigo-900 transition-colors duration-300">
                {option.label}
              </span>
            </div>
            
            <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300 text-indigo-600">
              <i className="fa-solid fa-circle-check text-xl" aria-hidden="true"></i>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Quiz;
