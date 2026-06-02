import { Boss } from '../types';

export const bosses: Boss[] = [
  {
    id: 'boss-pecahan',
    name: 'Naga Pecahan',
    topicId: 'sd-pecahan',
    description: 'Penjaga gerbang pecahan. Ia membelah dan menggabungkan pecahan dengan licik.',
    hp: 2200,
    phases: 3,
    weakness: ['Pecahan senilai', 'Operasi pecahan', 'Penyebut sama'],
    skills: ['Split Fraction', 'Denominator Trap'],
    rewardXP: 250,
    rewardCoins: 180,
    rewardBadge: 'Fraction Master',
    icon: '🐉'
  },
  {
    id: 'boss-aljabar',
    name: 'The Equation Keeper',
    topicId: 'smp-aljabar',
    description: 'Penjaga keseimbangan. Ia menguji pemahamanmu tentang timbangan persamaan.',
    hp: 2800,
    phases: 3,
    weakness: ['Keseimbangan persamaan', 'Isolasi variabel', 'Operasi kedua sisi'],
    skills: ['Variable Trap', 'Balance Break'],
    rewardXP: 320,
    rewardCoins: 220,
    rewardBadge: 'Algebra Hunter',
    icon: '🛡️'
  },
  {
    id: 'boss-kuadrat',
    name: 'Parabola King',
    topicId: 'sma-kuadrat',
    description: 'Raja kurva. Ia menguji pemahamanmu tentang puncak, akar, dan arah parabola.',
    hp: 3500,
    phases: 3,
    weakness: ['Arah parabola', 'Diskriminan', 'Titik puncak'],
    skills: ['Curve Trap', 'Vertex Lock'],
    rewardXP: 450,
    rewardCoins: 300,
    rewardBadge: 'Parabola Slayer',
    icon: '👑'
  }
];

export const getBossById = (id: string): Boss | undefined => bosses.find(b => b.id === id);