import { Player } from '../types';

export function getWeakTopics(player: Player): string[] {
  const weak: string[] = [];
  Object.entries(player.mastery).forEach(([topic, percent]) => {
    if (percent < 55) weak.push(topic);
  });
  return weak.length > 0 ? weak : ['sd-pecahan'];
}

export function recommendNextLesson(player: Player, completed: string[]): string {
  const weak = getWeakTopics(player);
  if (weak.length > 0) return weak[0];
  
  // Simple progression
  if (!completed.includes('sd-bilangan')) return 'sd-bilangan';
  if (!completed.includes('sd-pecahan')) return 'sd-pecahan';
  if (!completed.includes('smp-aljabar')) return 'smp-aljabar';
  return 'sma-kuadrat';
}

export function adjustDifficulty(accuracy: number): 1 | 2 | 3 | 4 | 5 {
  if (accuracy > 88) return 4;
  if (accuracy > 75) return 3;
  if (accuracy < 55) return 1;
  return 2;
}

export function trackMistake(topicId: string, player: Player): Player {
  // In full version would update mastery down
  const newMastery = { ...player.mastery };
  if (newMastery[topicId] !== undefined) {
    newMastery[topicId] = Math.max(10, newMastery[topicId] - 8);
  }
  return { ...player, mastery: newMastery };
}