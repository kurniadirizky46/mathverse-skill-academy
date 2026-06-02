import { Player, Rank, Achievement } from '../types';

const RANK_THRESHOLDS: { rank: Rank; minXP: number; minWins?: number }[] = [
  { rank: 'Bronze', minXP: 0 },
  { rank: 'Silver', minXP: 800, minWins: 3 },
  { rank: 'Gold', minXP: 2200, minWins: 8 },
  { rank: 'Platinum', minXP: 4500, minWins: 15 },
  { rank: 'Diamond', minXP: 8000, minWins: 25 },
  { rank: 'Master', minXP: 13000, minWins: 40 },
  { rank: 'Legend', minXP: 20000, minWins: 60 }
];

export function calculateXP(
  correct: boolean,
  speedBonus: boolean = false,
  conceptBonus: boolean = false,
  combo: number = 0,
  isLessonComplete: boolean = false,
  isBossWin: boolean = false,
  isBattleWin: boolean = false
): number {
  let xp = 0;
  if (correct) xp += 12;
  if (speedBonus) xp += 6;
  if (conceptBonus) xp += 18;
  if (combo >= 5) xp += 28;
  if (isLessonComplete) xp += 55;
  if (isBattleWin) xp += 135;
  if (isBossWin) xp += 220;
  return xp;
}

export function calculateCoins(correct: boolean, isWin: boolean, isBoss: boolean = false): number {
  let coins = correct ? 8 : 3;
  if (isWin) coins += 75;
  if (isBoss) coins += 140;
  return coins;
}

export function updateRank(currentXP: number, currentWins: number, currentRank: Rank): Rank {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    const threshold = RANK_THRESHOLDS[i];
    if (currentXP >= threshold.minXP && 
        (!threshold.minWins || currentWins >= threshold.minWins)) {
      return threshold.rank;
    }
  }
  return currentRank;
}

export function checkAndUnlockAchievements(
  player: Player,
  action: 'lesson' | 'battleWin' | 'bossWin' | 'conceptCorrect' | 'noMistakeBattle' | 'comeback'
): Achievement[] {
  // Simplified achievement unlock logic
  const newAchievements: Achievement[] = [];
  
  // In full impl would check all conditions against player stats
  // For MVP we return based on action triggers
  return newAchievements;
}

export function getRankProgress(xp: number, rank: Rank): { current: number; next: number; percent: number } {
  const currentIndex = RANK_THRESHOLDS.findIndex(r => r.rank === rank);
  const currentThreshold = RANK_THRESHOLDS[currentIndex];
  const nextThreshold = RANK_THRESHOLDS[currentIndex + 1] || { minXP: xp + 5000, rank: 'Legend' as Rank };

  const current = xp - currentThreshold.minXP;
  const needed = nextThreshold.minXP - currentThreshold.minXP;
  const percent = Math.min(100, Math.floor((current / needed) * 100));

  return { current, next: nextThreshold.minXP, percent };
}