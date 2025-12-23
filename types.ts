
export enum QuizStep {
  START = 'START',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  SCENARIO_GAME = 'SCENARIO_GAME',
  JOB_ALERTS = 'JOB_ALERTS'
}

export interface QuizQuestion {
  id: number;
  text: string;
  category: 'analytical' | 'creative' | 'social' | 'leadership' | 'practical';
  options: {
    label: string;
    score: number;
  }[];
}

export interface PsychometricScores {
  analytical: number;
  creative: number;
  social: number;
  leadership: number;
  practical: number;
}

export interface ReflectionData {
  name: string;
  struggles: string;
  testimonies: string;
  fears: string;
  goals: string;
}

export interface CareerMatch {
  title: string;
  description: string;
  salaryRange: string;
  growthPotential: string;
  reasoning: string;
  imageSearchTerm: string;
}

export interface VideoResource {
  title: string;
  url: string;
  description: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AIAnalysis {
  persona: string;
  summary: string;
  topCareers: CareerMatch[];
  motivationalVideos: VideoResource[];
  searchSources: GroundingSource[];
  empatheticNote: string;
}

export interface ScenarioStep {
  scenario: string;
  choices: {
    text: string;
    impact: string;
  }[];
}

export interface ScenarioFeedback {
  consequence: string;
  skillAnalysis: {
    communication: number;
    empathy: number;
    leadership: number;
  };
  advice: string;
}
