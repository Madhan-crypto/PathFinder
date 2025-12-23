
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { CareerMatch, ScenarioStep, ScenarioFeedback } from '../types';

interface ScenarioArchitectProps {
  career: CareerMatch;
  onExit: () => void;
  onAchievement?: (achievement: string) => void;
}

const ScenarioArchitect: React.FC<ScenarioArchitectProps> = ({ career, onExit, onAchievement }) => {
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<ScenarioStep | null>(null);
  const [feedback, setFeedback] = useState<ScenarioFeedback | null>(null);
  const [history, setHistory] = useState<{ choice: string, feedback: ScenarioFeedback }[]>([]);
  const [turn, setTurn] = useState(1);

  const generateScenario = async () => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Architect an immersive, high-stakes workplace dilemma specifically for a ${career.title}. 
        Focus on deep interpersonal dynamics or professional ethics. 
        Context: The user is exploring this career path. 
        Turn number: ${turn}.
        Provide 3 evocative choices that reveal character.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scenario: { type: Type.STRING },
              choices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    impact: { type: Type.STRING }
                  },
                  required: ["text", "impact"]
                }
              }
            },
            required: ["scenario", "choices"]
          }
        }
      });
      const jsonStr = response.text || "{}";
      setCurrentStep(JSON.parse(jsonStr));
      setFeedback(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (choiceIdx: number) => {
    if (!currentStep) return;
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const choice = currentStep.choices[choiceIdx];
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Dilemma: "${currentStep.scenario}".
        Choice Made: "${choice.text}".
        Impact context: "${choice.impact}".
        Analyze how this action reflects Communication, Empathy, and Leadership as a ${career.title}.
        If scores are high (80+), suggest an achievement name like 'Master Negotiator' or 'Empathetic Lead'.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              consequence: { type: Type.STRING },
              skillAnalysis: {
                type: Type.OBJECT,
                properties: {
                  communication: { type: Type.NUMBER },
                  empathy: { type: Type.NUMBER },
                  leadership: { type: Type.NUMBER }
                },
                required: ["communication", "empathy", "leadership"]
              },
              advice: { type: Type.STRING },
              earnedAchievement: { type: Type.STRING }
            },
            required: ["consequence", "skillAnalysis", "advice"]
          }
        }
      });
      const jsonStr = response.text || "{}";
      const result = JSON.parse(jsonStr);
      setFeedback(result);
      setHistory(prev => [...prev, { choice: choice.text, feedback: result }]);
      
      if (result.earnedAchievement && onAchievement) {
        onAchievement(result.earnedAchievement);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateScenario();
  }, [career, turn]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 animate-pulse">
        <div className="relative">
          <div className="h-32 w-32 border-[12px] border-slate-100 border-t-violet-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fa-solid fa-terminal text-3xl text-violet-600 animate-bounce"></i>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-slate-800">Compiling Reality...</h3>
          <p className="text-slate-500 font-bold max-w-sm">Generating turn {turn} of your narrative journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-[3.5rem] shadow-[0_32px_128px_-16px_rgba(139,92,246,0.15)] border border-violet-50 overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 p-10 text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Soft Skill Simulation</span>
          <h2 className="text-4xl font-black tracking-tighter">Scenario Architect: {career.title}</h2>
        </div>
        <button 
          onClick={onExit} 
          className="relative z-10 h-14 w-14 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all group"
        >
          <i className="fa-solid fa-xmark text-2xl group-hover:rotate-90 transition-transform"></i>
        </button>
      </div>

      <div className="p-8 md:p-14">
        {!feedback ? (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 relative shadow-inner">
               <div className="absolute -top-6 left-12 h-12 w-12 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center text-violet-600 font-black">
                 {turn}
               </div>
               <p className="text-2xl text-slate-800 font-medium leading-relaxed italic">
                 "{currentStep?.scenario}"
               </p>
            </div>
            
            <div className="grid gap-6">
              {currentStep?.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(idx)}
                  className="w-full text-left p-8 rounded-3xl border-2 border-slate-100 bg-white hover:border-violet-500 hover:bg-violet-50/50 group transition-all duration-300 flex items-center gap-8 shadow-sm hover:shadow-xl hover:translate-x-2"
                >
                  <span className="h-14 w-14 flex-shrink-0 rounded-2xl bg-slate-50 text-slate-400 font-black text-xl flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all shadow-inner">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xl font-bold text-slate-700 group-hover:text-violet-900 leading-tight">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in zoom-in duration-500">
            {feedback.earnedAchievement && (
              <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-[2rem] flex items-center gap-6 animate-bounce">
                <div className="h-16 w-16 bg-amber-400 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">New Achievement Unlocked</h4>
                  <p className="text-2xl font-black text-amber-800">{feedback.earnedAchievement}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(feedback.skillAnalysis).map(([skill, value]) => (
                <div key={skill} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                     <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{skill}</span>
                     <span className="text-2xl font-black text-violet-600">{value}%</span>
                   </div>
                   <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-1000" 
                        style={{ width: `${value}%` }}
                      ></div>
                   </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
               <h3 className="text-4xl font-black text-slate-900 tracking-tight">Outcome Assessment</h3>
               <p className="text-slate-600 text-xl leading-relaxed font-medium bg-slate-50/50 p-8 rounded-[2rem] border-l-8 border-violet-500 shadow-inner">
                {feedback.consequence}
               </p>
            </div>

            <div className="p-8 bg-violet-50 rounded-3xl border border-violet-100 flex items-start gap-6">
               <i className="fa-solid fa-lightbulb text-violet-400 text-2xl mt-1"></i>
               <p className="text-violet-900 font-bold text-lg leading-relaxed italic">“{feedback.advice}”</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-slate-100">
              <button 
                onClick={() => { setTurn(t => t + 1); setFeedback(null); }}
                className="flex-grow py-6 bg-violet-600 text-white font-black text-lg rounded-3xl shadow-2xl shadow-violet-100 hover:bg-violet-700 transition-all hover:scale-[1.02]"
              >
                Proceed to Turn {turn + 1}
              </button>
              <button 
                onClick={onExit}
                className="px-12 py-6 text-slate-600 font-black text-lg hover:text-slate-900 transition-all hover:bg-slate-50 rounded-3xl"
              >
                End Simulation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioArchitect;
