// MATHVERSE: SKILL ACADEMY - Core TypeScript Definitions

export type SchoolLevel = 'SD' | 'SMP' | 'SMA';

export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Legend';

export type SkillRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export type QuestionType = 'quick' | 'concept' | 'step' | 'error' | 'story' | 'final';

export type BattleState = 'intro' | 'question' | 'answerSubmitted' | 'damageCalculation' | 'skillActivation' | 'opponentTurn' | 'finalClash' | 'result';

export type ConceptStage = 'intro' | 'guided' | 'check' | 'unlock';

export interface Player {
  name: string;
  avatar: string; // emoji or key
  level: number;
  xp: number;
  coins: number;
  rank: Rank;
  hpBase: number;
  unlockedSkills: string[]; // skill ids
  completedLessons: string[]; // topic ids
  masteredTopics: string[];
  battleStats: {
    wins: number;
    losses: number;
    winStreak: number;
    bestCombo: number;
    averageAccuracy: number;
    averageSpeed: number; // seconds per answer
  };
  mastery: {
    [key: string]: number; // topicId -> 0-100 mastery %
  };
}

export interface Topic {
  id: string;
  title: string;
  schoolLevel: SchoolLevel;
  worldName: string;
  description: string;
  conceptExplanation: string;
  visualAnalogy: string;
  prerequisiteTopicIds: string[];
  unlockSkillId: string;
  questions: Question[];
  conceptQuestions: ConceptQuestion[];
  bossPhases: BossPhaseQuestion[];
}

export interface Question {
  id: string;
  topicId: string;
  schoolLevel: SchoolLevel;
  type: QuestionType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  conceptTag: string;
  timeLimit: number; // seconds
}

export interface ConceptQuestion {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  feedback: string;
}

export interface BossPhaseQuestion {
  phase: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  isFinisher?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  topicId: string;
  description: string;
  effect: string;
  damageBonus: number;
  unlockRequirement: string; // description
  level: number;
  maxLevel: number;
  icon: string;
  rarity: SkillRarity;
}

export interface Boss {
  id: string;
  name: string;
  topicId: string;
  description: string;
  hp: number;
  phases: number;
  weakness: string[];
  skills: string[];
  rewardXP: number;
  rewardCoins: number;
  rewardBadge: string;
  icon: string;
}

export interface Rival {
  id: string;
  name: string;
  rank: Rank;
  specialty: string;
  weakness: string;
  avatar: string;
  winsAgainstPlayer: number;
  lossesAgainstPlayer: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  condition: string;
}

export interface BattleResult {
  won: boolean;
  playerHP: number;
  opponentHP: number;
  xpGained: number;
  coinsGained: number;
  accuracy: number;
  bestCombo: number;
  damageDealt: number;
  skillsUsed: string[];
  message: string;
}

export interface DailyMission {
  id: string;
  description: string;
  progress: number;
  target: number;
  rewardXP: number;
  completed: boolean;
}