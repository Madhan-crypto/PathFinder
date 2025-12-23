
import { QuizQuestion } from './types';

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "When facing a complex problem, I usually...",
    category: 'analytical',
    options: [
      { label: "Break it down into data points and logic.", score: 10 },
      { label: "Look for an unconventional, creative shortcut.", score: 5 },
      { label: "Ask others for their perspective first.", score: 2 }
    ]
  },
  {
    id: 2,
    text: "My ideal workspace would be...",
    category: 'creative',
    options: [
      { label: "A vibrant studio with tools and colors.", score: 10 },
      { label: "A quiet, highly organized office.", score: 2 },
      { label: "A bustling community hub.", score: 7 }
    ]
  },
  {
    id: 3,
    text: "In a team project, I prefer to...",
    category: 'leadership',
    options: [
      { label: "Take charge and define the strategy.", score: 10 },
      { label: "Do the heavy lifting behind the scenes.", score: 3 },
      { label: "Ensure everyone feels heard and happy.", score: 6 }
    ]
  },
  {
    id: 4,
    text: "If I were to build something from scratch, it would be...",
    category: 'practical',
    options: [
      { label: "A physical piece of furniture or machinery.", score: 10 },
      { label: "A digital algorithm or software.", score: 7 },
      { label: "A piece of art or a story.", score: 4 }
    ]
  },
  {
    id: 5,
    text: "Helping people solve their personal problems is...",
    category: 'social',
    options: [
      { label: "Extremely rewarding for me.", score: 10 },
      { label: "Fine, but I prefer technical tasks.", score: 3 },
      { label: "Exhausting; I'd rather work alone.", score: 0 }
    ]
  }
];

export const SYSTEM_PROMPT = `
You are an expert Career Counselor and Psychometric Analyst. 
Based on a user's scores in Analytical, Creative, Social, Leadership, and Practical domains, you will provide:
1. A unique "Career Persona" name.
2. A deep-dive personality summary.
3. Use Google Search grounding to find 3 REAL-TIME career paths, current salary ranges, and growth potential for the current year.
4. Provide specific reasoning why these match their profile.

IMPORTANT: Always prioritize real, authentic data found via search. 
Format your output strictly as a valid JSON object.
`;
