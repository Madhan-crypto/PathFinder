
import React, { useState } from 'react';
import { ReflectionData } from '../types';

interface SelfReflectionProps {
  onSubmit: (data: ReflectionData) => void;
  onBack: () => void;
}

const SelfReflection: React.FC<SelfReflectionProps> = ({ onSubmit, onBack }) => {
  const [data, setData] = useState<ReflectionData>({
    name: '',
    struggles: '',
    testimonies: '',
    fears: '',
    goals: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const inputClasses = "w-full p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none font-bold transition-all";
  const textareaClasses = "w-full h-32 p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none resize-none font-medium transition-all shadow-sm";

  return (
    <div className="max-w-3xl mx-auto p-8 md:p-12 bg-white rounded-[2.5rem] shadow-2xl border border-indigo-50 animate-in fade-in slide-in-from-right duration-500">
      <header className="mb-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black mb-4 tracking-widest uppercase">
          Phase 2: Personal Narrative
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Tell us your story</h2>
        <p className="text-slate-600 font-medium leading-relaxed">Help us personalize your journey.</p>
      </header>

      <div className="space-y-8">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-black text-slate-800 uppercase tracking-wider">Your Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={data.name}
            onChange={handleChange}
            placeholder="What should we call you?"
            className={inputClasses}
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="struggles" className="block text-sm font-black text-slate-800 uppercase tracking-wider">Current Struggles & Threats</label>
          <textarea
            id="struggles"
            name="struggles"
            value={data.struggles}
            onChange={handleChange}
            placeholder="What challenges are you currently facing?"
            className={textareaClasses}
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="goals" className="block text-sm font-black text-slate-800 uppercase tracking-wider">Ultimate Career Goals</label>
          <textarea
            id="goals"
            name="goals"
            value={data.goals}
            onChange={handleChange}
            placeholder="What's your dream role?"
            className={textareaClasses}
          />
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-100">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-8 py-4 text-slate-600 font-bold hover:text-slate-900 transition-colors rounded-xl"
        >
          Back to Quiz
        </button>
        <button
          onClick={() => onSubmit(data)}
          disabled={!data.name.trim()}
          className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-30 transition-all"
        >
          Analyze My Future
        </button>
      </div>
    </div>
  );
};

export default SelfReflection;
