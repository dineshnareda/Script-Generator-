export type Platform = 'Instagram' | 'YouTube Shorts';
export type Tone = 'Funny' | 'Emotional' | 'Motivational' | 'Storytelling' | 'Shocking';
export type Language = 'Hindi' | 'English' | 'Hinglish';
export type Duration = '15 sec' | '30 sec' | '60 sec';
export type ContentType = 'Story' | 'Facts' | 'Motivation' | 'Comedy' | 'Educational';
export type HookType = 'Question' | 'Shock' | 'Relatable' | 'Bold';
export type Theme = 'light' | 'dark' | 'emerald' | 'sunset' | 'midnight';

export interface ScriptInput {
  topic: string;
  platform: Platform;
  tone: Tone;
  audience?: string;
  language: Language;
  duration: Duration;
  contentType: ContentType;
  hookType: HookType;
}

export interface ScriptOutput {
  hook: string;
  script: string;
  titles: string[];
  cta: string;
  keywords: string[];
  hashtags: string[];
}

export interface SavedScript {
  id: string;
  timestamp: number;
  input: ScriptInput;
  output: ScriptOutput;
}

export interface User {
  id: string;
  name: string;
  email: string;
  authMode: 'password' | 'otp';
  profilePic?: string;
  theme: Theme;
}

export type AppView = 'generator' | 'history' | 'auth' | 'profile' | 'settings';
