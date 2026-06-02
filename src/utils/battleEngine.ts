import type { Question, Skill, BattleResult } from '../types';

interface BattleContext {
  playerHP: number;
  opponentHP: number;
  combo: number;
  energy: number;
  skillsUsed: string[];
  accuracyHits: number;
  totalQuestions: number;
  bestCombo: number;
  damageDealt: number;
}

export function calculateDamage(
  baseDamage: number,
  speedBonus: number,
  conceptBonus: number,
  combo: number,
  skillBonus: number,
  confidenceMultiplier: number = 1
): number {
  const comboBonus = Math.floor(combo * 12);
  let total = baseDamage + speedBonus + conceptBonus + comboBonus + skillBonus;
  total = Math.floor(total * confidenceMultiplier);
  return Math.max(40, total); // minimum damage
}

export function getSpeedBonus(timeTaken: number, timeLimit: number): number {
  if (timeTaken <= timeLimit * 0.4) return 45;
  if (timeTaken <= timeLimit * 0.6) return 30;
  if (timeTaken <= timeLimit * 0.85) return 15;
  return 5;
}

export function getConceptBonus(isConceptCorrect: boolean): number {
  return isConceptCorrect ? 65 : 0;
}

export function simulateOpponentAction(playerCorrect: boolean, opponentHP: number): { damageToPlayer: number; message: string } {
  if (playerCorrect) {
    return { damageToPlayer: 0, message: 'Lawan tidak sempat menyerang.' };
  }
  
  // Opponent counter attack
  const counterDamage = 75 + Math.floor(Math.random() * 40);
  return {
    damageToPlayer: Math.min(counterDamage, opponentHP),
    message: 'Lawan melakukan counter attack!'
  };
}

export function checkBattleEnd(playerHP: number, opponentHP: number): 'playerWin' | 'opponentWin' | 'continue' {
  if (playerHP <= 0) return 'opponentWin';
  if (opponentHP <= 0) return 'playerWin';
  return 'continue';
}

export function generateBattleQuestions(topicIds: string[], count: number = 8): Question[] {
  // In real impl would pull from mathContent, here simplified pool
  // For MVP we return a mixed set - in practice import from data
  return []; // Will be populated in component from available questions
}

export function calculateBattleResult(context: BattleContext, won: boolean, finalDamage?: number): BattleResult {
  const accuracy = context.totalQuestions > 0 
    ? Math.round((context.accuracyHits / context.totalQuestions) * 100) 
    : 70;

  const xpBase = won ? 140 : 45;
  const xpGained = xpBase + Math.floor(context.bestCombo * 8) + (accuracy > 85 ? 30 : 0);
  
  const coinsGained = won ? 95 : 25;

  let message = won 
    ? `Kemenangan gemilang! Kamu mengalahkan rival dengan ${context.bestCombo} combo terbaik.` 
    : `Kalah tipis. Kamu unggul di kecepatan tapi perlu perkuat konsep.`;

  if (finalDamage && finalDamage > 180) {
    message += ' Final Clash yang luar biasa!';
  }

  return {
    won,
    playerHP: context.playerHP,
    opponentHP: context.opponentHP,
    xpGained: Math.max(20, xpGained),
    coinsGained,
    accuracy,
    bestCombo: context.bestCombo,
    damageDealt: context.damageDealt,
    skillsUsed: context.skillsUsed,
    message
  };
}

export function applySkillDamage(skill: Skill | undefined, baseDamage: number, questionType: string): number {
  if (!skill) return baseDamage;
  
  let bonus = skill.damageBonus;
  
  // Topic synergy
  if (skill.topicId.includes('pecahan') && questionType === 'quick') bonus += 10;
  if (skill.topicId.includes('aljabar') && questionType === 'step') bonus += 15;
  
  return baseDamage + bonus;
}