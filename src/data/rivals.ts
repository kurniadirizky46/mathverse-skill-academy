import { Rival } from '../types';

export const rivals: Rival[] = [
  {
    id: 'rival-raka',
    name: 'Raka',
    rank: 'Gold',
    specialty: 'Pecahan & Rasio',
    weakness: 'Konsep Aljabar',
    avatar: '🧑‍🚀',
    winsAgainstPlayer: 3,
    lossesAgainstPlayer: 2
  },
  {
    id: 'rival-sinta',
    name: 'Sinta',
    rank: 'Silver',
    specialty: 'Operasi Cepat',
    weakness: 'Soal Cerita',
    avatar: '👩‍🔬',
    winsAgainstPlayer: 1,
    lossesAgainstPlayer: 4
  },
  {
    id: 'rival-bima',
    name: 'Bima',
    rank: 'Platinum',
    specialty: 'Fungsi Kuadrat',
    weakness: 'Konsep Dasar',
    avatar: '🦸‍♂️',
    winsAgainstPlayer: 2,
    lossesAgainstPlayer: 1
  }
];

export const getRivalById = (id: string): Rival | undefined => rivals.find(r => r.id === id);