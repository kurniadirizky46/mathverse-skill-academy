import type { Skill } from '../types';

export const skills: Skill[] = [
  {
    id: 'quick-add',
    name: 'Quick Add',
    topicId: 'sd-bilangan',
    description: 'Bonus kecepatan untuk soal penjumlahan dan nilai tempat.',
    effect: '+15 damage pada soal operasi dasar & bilangan',
    damageBonus: 15,
    unlockRequirement: 'Selesaikan Concept Check Bilangan',
    level: 1,
    maxLevel: 3,
    icon: '⚡',
    rarity: 'Common'
  },
  {
    id: 'fraction-slash',
    name: 'Fraction Slash',
    topicId: 'sd-pecahan',
    description: 'Serangan kuat untuk semua soal pecahan.',
    effect: '+25% damage pada soal pecahan & konsep bagian',
    damageBonus: 25,
    unlockRequirement: 'Kalahkan Naga Pecahan (Boss)',
    level: 1,
    maxLevel: 3,
    icon: '🔪',
    rarity: 'Rare'
  },
  {
    id: 'multiply-strike',
    name: 'Multiply Strike',
    topicId: 'sd-operasi',
    description: 'Serangan cepat untuk operasi perkalian & pembagian.',
    effect: '+20 damage & +10% combo multiplier',
    damageBonus: 20,
    unlockRequirement: 'Selesaikan pelajaran Operasi Dasar',
    level: 1,
    maxLevel: 3,
    icon: '✖️',
    rarity: 'Common'
  },
  {
    id: 'balance-strike',
    name: 'Balance Strike',
    topicId: 'smp-aljabar',
    description: 'Bonus damage jika menjawab langkah penyelesaian persamaan dengan benar.',
    effect: '+30 damage + konsep bonus jika step order benar',
    damageBonus: 30,
    unlockRequirement: 'Kalahkan The Equation Keeper',
    level: 1,
    maxLevel: 3,
    icon: '⚖️',
    rarity: 'Epic'
  },
  {
    id: 'ratio-boost',
    name: 'Ratio Boost',
    topicId: 'smp-rasio',
    description: 'Meningkatkan damage pada soal perbandingan dan skala.',
    effect: '+22 damage pada soal rasio & story problem',
    damageBonus: 22,
    unlockRequirement: 'Selesaikan Concept Check Rasio',
    level: 1,
    maxLevel: 2,
    icon: '📊',
    rarity: 'Rare'
  },
  {
    id: 'parabola-strike',
    name: 'Parabola Strike',
    topicId: 'sma-kuadrat',
    description: 'Critical hit pada soal fungsi kuadrat dan grafik.',
    effect: 'Chance critical 25% + 40 damage pada soal kuadrat',
    damageBonus: 40,
    unlockRequirement: 'Kalahkan Parabola King',
    level: 1,
    maxLevel: 3,
    icon: '📉',
    rarity: 'Legendary'
  }
];

export const getSkillById = (id: string): Skill | undefined => skills.find(s => s.id === id);

export const getSkillsByTopic = (topicId: string): Skill[] => skills.filter(s => s.topicId === topicId);