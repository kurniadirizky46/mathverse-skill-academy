import React, { useState, useEffect } from 'react';
import { 
  Player, Topic, Skill, Boss, Rival, Question, ConceptQuestion, 
  BattleState, ConceptStage, BattleResult, Achievement, DailyMission 
} from './types';
import { topics, getTopicById } from './data/mathContent';
import { skills, getSkillById } from './data/skills';
import { bosses, getBossById } from './data/bosses';
import { rivals } from './data/rivals';
import { 
  calculateDamage, getSpeedBonus, getConceptBonus, 
  simulateOpponentAction, checkBattleEnd, calculateBattleResult, applySkillDamage 
} from './utils/battleEngine';
import { calculateXP, calculateCoins, updateRank, getRankProgress } from './utils/rewardEngine';
import { recommendNextLesson, getWeakTopics } from './utils/adaptiveEngine';

// Default Player
const DEFAULT_PLAYER: Player = {
  name: "Player",
  avatar: "🧙‍♂️",
  level: 1,
  xp: 0,
  coins: 120,
  rank: "Bronze",
  hpBase: 1000,
  unlockedSkills: ["quick-add"],
  completedLessons: [],
  masteredTopics: [],
  battleStats: {
    wins: 0,
    losses: 0,
    winStreak: 0,
    bestCombo: 0,
    averageAccuracy: 78,
    averageSpeed: 9.4
  },
  mastery: {
    'sd-bilangan': 65,
    'sd-pecahan': 40,
    'sd-operasi': 55,
    'smp-aljabar': 25,
    'smp-rasio': 30,
    'sma-kuadrat': 10
  }
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-step', name: 'First Step', description: 'Menyelesaikan lesson pertama', icon: '🌟', unlocked: false, condition: 'lesson' },
  { id: 'fraction-master', name: 'Fraction Master', description: 'Menguasai pecahan', icon: '🔪', unlocked: false, condition: 'boss' },
  { id: 'algebra-hunter', name: 'Algebra Hunter', description: 'Membuka skill aljabar', icon: '⚖️', unlocked: false, condition: 'skill' },
  { id: 'boss-slayer', name: 'Boss Slayer', description: 'Mengalahkan boss pertama', icon: '🐉', unlocked: false, condition: 'boss' },
  { id: 'speed-solver', name: 'Speed Solver', description: 'Menjawab 10 soal cepat', icon: '⚡', unlocked: false, condition: 'practice' },
  { id: 'no-mistake', name: 'No Mistake', description: 'Menang battle tanpa salah', icon: '🛡️', unlocked: false, condition: 'battle' },
  { id: 'comeback-king', name: 'Comeback King', description: 'Menang battle saat HP < 25%', icon: '🔥', unlocked: false, condition: 'battle' },
];

type Page = 
  | 'home' | 'dashboard' | 'worldmap' | 'skilltree' | 'learn' | 'practice' 
  | 'battle' | 'boss' | 'leaderboard' | 'profile' | 'achievements' | 'settings';

const MathVerseApp: React.FC = () => {
  // ==================== STATE ====================
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [player, setPlayer] = useState<Player>(DEFAULT_PLAYER);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  
  // Learn Mode State
  const [selectedTopicId, setSelectedTopicId] = useState<string>('sd-pecahan');
  const [conceptStage, setConceptStage] = useState<ConceptStage>('intro');
  const [conceptAnswers, setConceptAnswers] = useState<Record<string, string>>({});
  
  // Practice Mode
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceCombo, setPracticeCombo] = useState(0);
  
  // Battle State
  const [battleState, setBattleState] = useState<BattleState>('intro');
  const [playerHP, setPlayerHP] = useState(1000);
  const [opponentHP, setOpponentHP] = useState(1000);
  const [combo, setCombo] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [currentBattleQuestion, setCurrentBattleQuestion] = useState<Question | null>(null);
  const [battleQuestions, setBattleQuestions] = useState<Question[]>([]);
  const [battleIndex, setBattleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [confidence, setConfidence] = useState<'Safe' | 'Confident' | 'All-In'>('Confident');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [damagePopups, setDamagePopups] = useState<{id: number, damage: number, isCrit: boolean, x: number}[]>([]);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [opponentName, setOpponentName] = useState('Raka');
  const [skillsUsedInBattle, setSkillsUsedInBattle] = useState<string[]>([]);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [finalClashActive, setFinalClashActive] = useState(false);
  
  // Boss State
  const [selectedBossId, setSelectedBossId] = useState<string>('boss-pecahan');
  const [bossHP, setBossHP] = useState(2200);
  const [bossPhase, setBossPhase] = useState(1);
  const [bossResult, setBossResult] = useState<{ won: boolean; message: string } | null>(null);
  
  // UI State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'xp' | 'coin' | 'unlock' } | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  // ==================== PERSISTENCE ====================
  useEffect(() => {
    const savedPlayer = localStorage.getItem('mathverse_player');
    if (savedPlayer) {
      try {
        const parsed = JSON.parse(savedPlayer);
        setPlayer({ ...DEFAULT_PLAYER, ...parsed });
      } catch (e) { console.warn('Failed to load player'); }
    }
    
    const savedAch = localStorage.getItem('mathverse_achievements');
    if (savedAch) {
      try { setAchievements(JSON.parse(savedAch)); } catch (e) {}
    }
  }, []);

  const savePlayer = (newPlayer: Player) => {
    setPlayer(newPlayer);
    localStorage.setItem('mathverse_player', JSON.stringify(newPlayer));
  };

  const saveAchievements = (newAch: Achievement[]) => {
    setAchievements(newAch);
    localStorage.setItem('mathverse_achievements', JSON.stringify(newAch));
  };

  // ==================== HELPERS ====================
  const showToast = (message: string, type: 'success' | 'xp' | 'coin' | 'unlock' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2400);
  };

  const addXPAndCoins = (xp: number, coins: number, reason: string) => {
    const newXP = player.xp + xp;
    const newCoins = player.coins + coins;
    
    const newRank = updateRank(newXP, player.battleStats.wins, player.rank);
    const leveledUp = Math.floor(newXP / 450) + 1 > player.level;
    
    const updated: Player = {
      ...player,
      xp: newXP,
      coins: newCoins,
      level: leveledUp ? player.level + 1 : player.level,
      rank: newRank
    };
    
    savePlayer(updated);
    
    if (xp > 0) showToast(`+${xp} XP • ${reason}`, 'xp');
    if (coins > 0) showToast(`+${coins} Coin`, 'coin');
    
    if (leveledUp) showToast(`Level Up! Sekarang Level ${updated.level}`, 'unlock');
    if (newRank !== player.rank) showToast(`Rank naik ke ${newRank}!`, 'unlock');
  };

  const unlockSkill = (skillId: string) => {
    if (player.unlockedSkills.includes(skillId)) return;
    
    const updated = {
      ...player,
      unlockedSkills: [...player.unlockedSkills, skillId]
    };
    savePlayer(updated);
    
    const skill = getSkillById(skillId);
    showToast(`Skill Terbuka: ${skill?.name || skillId}!`, 'unlock');
    
    // Bonus XP
    addXPAndCoins(95, 45, 'Membuka skill baru');
  };

  const completeLesson = (topicId: string) => {
    if (player.completedLessons.includes(topicId)) return;
    
    const topic = getTopicById(topicId);
    const skillToUnlock = topic?.unlockSkillId;
    
    const updated: Player = {
      ...player,
      completedLessons: [...player.completedLessons, topicId],
      masteredTopics: [...player.masteredTopics, topicId]
    };
    
    // Increase mastery
    if (updated.mastery[topicId] !== undefined) {
      updated.mastery[topicId] = Math.min(100, (updated.mastery[topicId] || 0) + 35);
    }
    
    savePlayer(updated);
    addXPAndCoins(55, 22, 'Menyelesaikan lesson');
    
    if (skillToUnlock) {
      setTimeout(() => unlockSkill(skillToUnlock), 650);
    }
    
    // Check achievements
    checkAchievementUnlock('lesson');
  };

  const checkAchievementUnlock = (trigger: string) => {
    const newAch = [...achievements];
    let changed = false;
    
    newAch.forEach((ach, idx) => {
      if (ach.unlocked) return;
      
      let shouldUnlock = false;
      
      if (trigger === 'lesson' && ach.id === 'first-step' && player.completedLessons.length >= 1) shouldUnlock = true;
      if (trigger === 'boss' && ach.id === 'boss-slayer' && player.battleStats.wins >= 1) shouldUnlock = true;
      if (trigger === 'battle' && ach.id === 'no-mistake' && player.battleStats.winStreak >= 1) shouldUnlock = true;
      
      if (shouldUnlock) {
        newAch[idx] = { ...ach, unlocked: true };
        changed = true;
        showToast(`Achievement Unlocked: ${ach.name}`, 'unlock');
      }
    });
    
    if (changed) saveAchievements(newAch);
  };

  // ==================== NAVIGATION ====================
  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    // Reset battle/boss states when leaving
    if (page !== 'battle') {
      resetBattleState();
    }
    if (page !== 'boss') {
      setBossResult(null);
    }
  };

  // ==================== LEARN / CONCEPT MODE ====================
  const startLearnMode = (topicId: string) => {
    setSelectedTopicId(topicId);
    setConceptStage('intro');
    setConceptAnswers({});
    navigateTo('learn');
  };

  const advanceConceptStage = () => {
    const topic = getTopicById(selectedTopicId);
    if (!topic) return;

    if (conceptStage === 'intro') {
      setConceptStage('guided');
    } else if (conceptStage === 'guided') {
      setConceptStage('check');
    } else if (conceptStage === 'check') {
      // Check if concept question answered correctly
      const cq = topic.conceptQuestions[0];
      const userAnswer = conceptAnswers[cq?.id || ''];
      
      if (cq && userAnswer === cq.correctAnswer) {
        setConceptStage('unlock');
        completeLesson(selectedTopicId);
      } else {
        showToast('Jawaban konsep belum tepat. Coba lagi!', 'success');
        // Allow retry or show explanation
      }
    } else if (conceptStage === 'unlock') {
      navigateTo('worldmap');
    }
  };

  const handleConceptAnswer = (qId: string, answer: string) => {
    setConceptAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  // ==================== PRACTICE MODE ====================
  const startPractice = (topicId: string, mode: 'speed' | 'concept' = 'speed') => {
    const topic = getTopicById(topicId);
    if (!topic) return;

    const qs = [...topic.questions].sort(() => 0.5 - Math.random()).slice(0, 5);
    setPracticeQuestions(qs);
    setCurrentPracticeIndex(0);
    setPracticeScore(0);
    setPracticeCombo(0);
    navigateTo('practice');
  };

  const submitPracticeAnswer = (answer: string) => {
    const currentQ = practiceQuestions[currentPracticeIndex];
    if (!currentQ) return;

    const isCorrect = answer === currentQ.correctAnswer;
    
    if (isCorrect) {
      const newScore = practiceScore + 1;
      const newCombo = practiceCombo + 1;
      setPracticeScore(newScore);
      setPracticeCombo(newCombo);
      
      if (newCombo >= 3) {
        showToast(`Combo x${newCombo}!`, 'success');
      }
    } else {
      setPracticeCombo(0);
    }

    // Next question or finish
    if (currentPracticeIndex < practiceQuestions.length - 1) {
      setCurrentPracticeIndex(currentPracticeIndex + 1);
    } else {
      // Finish practice
      const accuracy = Math.round((practiceScore / practiceQuestions.length) * 100);
      const xpGain = Math.floor(12 * (practiceScore / practiceQuestions.length) + (practiceCombo > 3 ? 15 : 0));
      
      addXPAndCoins(xpGain, 12, 'Practice selesai');
      
      showToast(`Practice selesai! Akurasi ${accuracy}%`, 'success');
      
      setTimeout(() => {
        navigateTo('dashboard');
        setPracticeQuestions([]);
      }, 1800);
    }
  };

  // ==================== BATTLE ARENA (CORE FEATURE) ====================
  const resetBattleState = () => {
    setBattleState('intro');
    setPlayerHP(1000);
    setOpponentHP(1000);
    setCombo(0);
    setEnergy(0);
    setBattleIndex(0);
    setSelectedAnswer('');
    setBattleLog([]);
    setDamagePopups([]);
    setBattleResult(null);
    setSkillsUsedInBattle([]);
    setActiveSkill(null);
    setFinalClashActive(false);
    setIsAnswering(false);
  };

  const startBattle = (opponent: string = 'Raka') => {
    setOpponentName(opponent);
    resetBattleState();
    
    // Prepare 7-8 mixed questions from available topics
    const availableQs = topics.flatMap(t => t.questions);
    const shuffled = [...availableQs].sort(() => Math.random() - 0.5).slice(0, 7);
    setBattleQuestions(shuffled);
    
    const firstQ = shuffled[0];
    setCurrentBattleQuestion(firstQ);
    setBattleState('question');
    setBattleLog([`Pertarungan dimulai! Lawan: ${opponent}`]);
    
    navigateTo('battle');
  };

  const submitBattleAnswer = (answer: string) => {
    if (!currentBattleQuestion || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(answer);
    
    const isCorrect = answer === currentBattleQuestion.correctAnswer;
    const timeTaken = 8; // simulated for MVP - in real would track timer
    const timeLimit = currentBattleQuestion.timeLimit || 15;
    
    const speedB = getSpeedBonus(timeTaken, timeLimit);
    const conceptB = getConceptBonus(currentBattleQuestion.type === 'concept' && isCorrect);
    
    let baseDmg = 95;
    let skillBonus = 0;
    
    // Apply active skill if compatible
    if (activeSkill) {
      skillBonus = applySkillDamage(activeSkill, 0, currentBattleQuestion.type) - 0;
      setSkillsUsedInBattle(prev => [...prev, activeSkill.id]);
    }
    
    const confMultiplier = confidence === 'Safe' ? 1 : confidence === 'Confident' ? 1.45 : 2.3;
    
    const finalDamage = calculateDamage(baseDmg, speedB, conceptB, combo, skillBonus, confMultiplier);
    
    const newLog = [...battleLog];
    
    if (isCorrect) {
      // Player damages opponent
      const newOppHP = Math.max(0, opponentHP - finalDamage);
      setOpponentHP(newOppHP);
      
      // Damage popup
      const popupId = Date.now();
      setDamagePopups(prev => [...prev, { 
        id: popupId, 
        damage: finalDamage, 
        isCrit: finalDamage > 160, 
        x: 65 + Math.random() * 15 
      }]);
      setTimeout(() => {
        setDamagePopups(prev => prev.filter(p => p.id !== popupId));
      }, 650);
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      setEnergy(Math.min(100, energy + 12 + (newCombo > 3 ? 8 : 0)));
      
      newLog.push(`✅ Benar! +${finalDamage} damage ke lawan. Combo x${newCombo}`);
      
      if (newCombo === 5) newLog.push('🔥 COMBO 5! Energy meningkat tajam.');
      
      // Check for final clash
      if (newOppHP <= 0 || (battleIndex >= battleQuestions.length - 2 && newOppHP < 420)) {
        triggerFinalClash(newOppHP);
        return;
      }
      
      setBattleLog(newLog);
      
      // Next question
      setTimeout(() => {
        const nextIdx = battleIndex + 1;
        if (nextIdx < battleQuestions.length) {
          setBattleIndex(nextIdx);
          setCurrentBattleQuestion(battleQuestions[nextIdx]);
          setBattleState('question');
          setSelectedAnswer('');
          setActiveSkill(null);
        } else {
          endBattle(true);
        }
        setIsAnswering(false);
      }, 920);
      
    } else {
      // Wrong answer - opponent counters
      setCombo(0);
      setEnergy(Math.max(0, energy - 15));
      
      const counter = simulateOpponentAction(false, opponentHP);
      const newPlayerHP = Math.max(0, playerHP - counter.damageToPlayer);
      setPlayerHP(newPlayerHP);
      
      newLog.push(`❌ Salah. ${counter.message} (-${counter.damageToPlayer} HP)`);
      setBattleLog(newLog);
      
      if (newPlayerHP <= 0) {
        setTimeout(() => endBattle(false), 650);
        return;
      }
      
      setTimeout(() => {
        const nextIdx = battleIndex + 1;
        if (nextIdx < battleQuestions.length) {
          setBattleIndex(nextIdx);
          setCurrentBattleQuestion(battleQuestions[nextIdx]);
          setBattleState('question');
          setSelectedAnswer('');
          setActiveSkill(null);
        } else {
          endBattle(playerHP > opponentHP);
        }
        setIsAnswering(false);
      }, 1050);
    }
  };

  const triggerFinalClash = (currentOppHP: number) => {
    setFinalClashActive(true);
    setBattleState('finalClash');
    setBattleLog(prev => [...prev, '⚔️ FINAL CLASH! Soal penentu kemenangan!']);
    
    // Use last hard question or create one
    const finalQ = battleQuestions[battleQuestions.length - 1] || battleQuestions[0];
    setCurrentBattleQuestion(finalQ);
  };

  const submitFinalClash = (answer: string) => {
    if (!currentBattleQuestion) return;
    
    const isCorrect = answer === currentBattleQuestion.correctAnswer;
    const finalDmg = isCorrect ? 280 + Math.floor(Math.random() * 90) : 60;
    
    if (isCorrect) {
      const newOpp = Math.max(0, opponentHP - finalDmg);
      setOpponentHP(newOpp);
      setBattleLog(prev => [...prev, `💥 FINAL CLASH BERHASIL! +${finalDmg} damage`]);
      
      setTimeout(() => {
        endBattle(true, finalDmg);
      }, 800);
    } else {
      const newP = Math.max(0, playerHP - 95);
      setPlayerHP(newP);
      setBattleLog(prev => [...prev, `Final Clash gagal. Kamu masih bertahan.`]);
      
      setTimeout(() => {
        endBattle(playerHP > opponentHP, finalDmg);
      }, 800);
    }
  };

  const endBattle = (won: boolean, finalDmg?: number) => {
    const context = {
      playerHP,
      opponentHP: won ? 0 : opponentHP,
      combo,
      energy,
      skillsUsed: skillsUsedInBattle,
      accuracyHits: battleIndex + (won ? 1 : 0),
      totalQuestions: battleQuestions.length,
      bestCombo: Math.max(combo, player.battleStats.bestCombo),
      damageDealt: 420 + (finalDmg || 0)
    };
    
    const result = calculateBattleResult(context, won, finalDmg);
    setBattleResult(result);
    setBattleState('result');
    setShowResultModal(true);
    
    // Update player stats
    const newStats = { ...player.battleStats };
    if (won) {
      newStats.wins += 1;
      newStats.winStreak += 1;
      newStats.bestCombo = Math.max(newStats.bestCombo, combo);
    } else {
      newStats.losses += 1;
      newStats.winStreak = 0;
    }
    
    // Update accuracy average (simple)
    newStats.averageAccuracy = Math.round((newStats.averageAccuracy * 0.7) + (result.accuracy * 0.3));
    
    const updatedPlayer: Player = {
      ...player,
      battleStats: newStats
    };
    
    // Rewards
    const xpGain = result.xpGained;
    const coinGain = result.coinsGained;
    
    const finalPlayer = {
      ...updatedPlayer,
      xp: updatedPlayer.xp + xpGain,
      coins: updatedPlayer.coins + coinGain
    };
    
    // Rank update
    const newRank = updateRank(finalPlayer.xp, finalPlayer.battleStats.wins, finalPlayer.rank);
    finalPlayer.rank = newRank;
    
    savePlayer(finalPlayer);
    
    if (won) {
      checkAchievementUnlock('battle');
      if (combo >= 5) showToast('Combo Master!', 'unlock');
    }
    
    showToast(won ? 'Kemenangan!' : 'Pertarungan selesai', won ? 'success' : 'xp');
  };

  const activateSkillInBattle = (skill: Skill) => {
    if (!player.unlockedSkills.includes(skill.id) || energy < 35) {
      showToast('Energy tidak cukup atau skill terkunci', 'success');
      return;
    }
    setActiveSkill(skill);
    setEnergy(prev => Math.max(0, prev - 35));
    showToast(`${skill.name} aktif!`, 'unlock');
  };

  const rematchBattle = () => {
    setShowResultModal(false);
    startBattle(opponentName);
  };

  // ==================== BOSS CHALLENGE ====================
  const startBoss = (bossId: string) => {
    const boss = getBossById(bossId);
    if (!boss) return;
    
    setSelectedBossId(bossId);
    setBossHP(boss.hp);
    setBossPhase(1);
    setBossResult(null);
    navigateTo('boss');
  };

  const submitBossAnswer = (answer: string, isFinisher: boolean = false) => {
    const boss = getBossById(selectedBossId);
    if (!boss) return;
    
    const topic = getTopicById(boss.topicId);
    if (!topic) return;
    
    const phaseQ = topic.bossPhases.find(p => p.phase === bossPhase);
    if (!phaseQ) return;
    
    const correct = answer === phaseQ.correctAnswer;
    
    if (correct) {
      if (isFinisher || bossPhase === boss.phases) {
        // Boss defeated
        const newHP = 0;
        setBossHP(newHP);
        
        addXPAndCoins(boss.rewardXP, boss.rewardCoins, `Mengalahkan ${boss.name}`);
        
        // Unlock related skill
        if (boss.topicId === 'sd-pecahan') unlockSkill('fraction-slash');
        if (boss.topicId === 'smp-aljabar') unlockSkill('balance-strike');
        
        setBossResult({ won: true, message: `Kamu mengalahkan ${boss.name}! Skill baru terbuka.` });
        checkAchievementUnlock('boss');
        
        setTimeout(() => {
          navigateTo('achievements');
        }, 2200);
      } else {
        // Advance phase
        const newPhase = bossPhase + 1;
        setBossPhase(newPhase);
        const dmg = 180 + (bossPhase * 40);
        setBossHP(prev => Math.max(120, prev - dmg));
        showToast(`Phase ${newPhase} dibuka!`, 'success');
      }
    } else {
      // Wrong on finisher - regen
      if (isFinisher) {
        setBossHP(prev => Math.min(boss.hp, prev + Math.floor(boss.hp * 0.18)));
        showToast('Jawaban finisher salah. Boss regenerasi!', 'success');
      } else {
        showToast('Jawaban salah. Coba lagi phase ini.', 'success');
      }
    }
  };

  // ==================== SKILL TREE ====================
  const upgradeSkill = (skillId: string) => {
    const skill = getSkillById(skillId);
    if (!skill || !player.unlockedSkills.includes(skillId)) return;
    
    // Simple level up (MVP)
    addXPAndCoins(40, 15, 'Upgrade skill');
    showToast(`${skill.name} ditingkatkan!`, 'unlock');
  };

  // ==================== RENDER HELPERS ====================
  const renderNav = () => (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#a855f7] flex items-center justify-center text-white font-bold text-xl">M</div>
            <div>
              <div className="font-display text-2xl tracking-tighter text-white">MATHVERSE</div>
              <div className="text-[10px] text-[#67e8f9] -mt-1">SKILL ACADEMY</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm overflow-x-auto pb-1">
          {[
            { id: 'home', label: 'Home' },
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'worldmap', label: 'World Map' },
            { id: 'skilltree', label: 'Skill Tree' },
            { id: 'battle', label: 'Battle' },
            { id: 'boss', label: 'Boss' },
            { id: 'leaderboard', label: 'Rank' },
            { id: 'profile', label: 'Profile' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id as Page)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                currentPage === item.id 
                  ? 'nav-active text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
            <span className="text-[#facc15]">🪙</span>
            <span className="font-mono text-white font-semibold">{player.coins}</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/60">Lv.{player.level} • {player.rank}</div>
            <div className="text-xs text-[#00f0ff] font-mono">{player.xp} XP</div>
          </div>
          <button onClick={() => navigateTo('settings')} className="text-white/60 hover:text-white p-1">⚙️</button>
        </div>
      </div>
    </nav>
  );

  const renderHome = () => (
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 text-[#67e8f9] text-sm mb-4">EDUCATIONAL RPG • BATTLE ARENA</div>
        <h1 className="font-display text-7xl tracking-tighter text-white mb-2">MATHVERSE</h1>
        <p className="text-2xl text-[#a855f7]">SKILL ACADEMY</p>
        <p className="mt-3 text-lg text-white/70 max-w-md mx-auto">"Pahami konsepnya, buka skillnya, kalahkan rivalmu."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button onClick={() => navigateTo('worldmap')} className="math-card group glass p-6 rounded-3xl text-left border border-white/10 hover:border-[#00f0ff]/40">
          <div className="text-4xl mb-3">🌍</div>
          <div className="font-semibold text-xl text-white group-hover:text-[#00f0ff]">Mulai Belajar</div>
          <div className="text-white/60 mt-1">Jelajahi World Map &amp; buka konsep baru</div>
        </button>
        
        <button onClick={() => startBattle()} className="math-card group glass p-6 rounded-3xl text-left border border-white/10 hover:border-[#a855f7]/40">
          <div className="text-4xl mb-3">⚔️</div>
          <div className="font-semibold text-xl text-white group-hover:text-[#a855f7]">Masuk Arena</div>
          <div className="text-white/60 mt-1">Ranked Math Duel • Lawan AI rival</div>
        </button>
        
        <button onClick={() => startBoss('boss-pecahan')} className="math-card group glass p-6 rounded-3xl text-left border border-white/10 hover:border-[#facc15]/40">
          <div className="text-4xl mb-3">🐉</div>
          <div className="font-semibold text-xl text-white group-hover:text-[#facc15]">Lawan Boss</div>
          <div className="text-white/60 mt-1">Boss Challenge multi-fase • Hadiah besar</div>
        </button>
      </div>

      {/* Player Summary Card */}
      <div className="glass rounded-3xl p-8 mb-8 border border-white/10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-4">
              <div className="text-6xl">{player.avatar}</div>
              <div>
                <div className="text-3xl font-semibold text-white">{player.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`rank-badge ${player.rank === 'Bronze' ? 'bg-orange-900/70 text-orange-300' : 'bg-white/10 text-white'}`}>{player.rank}</span>
                  <span className="text-white/60">Level {player.level}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-white/50">WIN STREAK</div>
            <div className="text-4xl font-mono text-[#facc15]">{player.battleStats.winStreak}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-white/60 text-xs">XP / NEXT</div>
            <div className="font-mono text-2xl text-white">{player.xp}</div>
            <div className="h-1.5 bg-white/10 rounded mt-2 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#00f0ff] to-[#a855f7]" style={{ width: `${getRankProgress(player.xp, player.rank).percent}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-white/60 text-xs">BATTLE RECORD</div>
            <div className="font-mono text-2xl text-white">{player.battleStats.wins}<span className="text-white/40">/{player.battleStats.losses}</span></div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-white/60 text-xs">SKILL TERBUKA</div>
            <div className="font-mono text-2xl text-white">{player.unlockedSkills.length}<span className="text-white/40">/6</span></div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-white/60 text-xs">ACCURACY</div>
            <div className="font-mono text-2xl text-white">{player.battleStats.averageAccuracy}<span className="text-xs text-white/50">%</span></div>
          </div>
        </div>
      </div>

      {/* Daily Mission & Rival Alert */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-6 border border-white/10">
          <div className="uppercase tracking-[1.5px] text-xs text-[#67e8f9] mb-3">DAILY MISSION</div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center"><span>Selesaikan 5 soal pecahan</span><span className="text-emerald-400">3/5</span></div>
            <div className="flex justify-between items-center"><span>Menang 1 battle</span><span className="text-emerald-400">1/1 ✓</span></div>
            <div className="flex justify-between items-center"><span>Kalahkan 1 mini boss</span><span className="text-white/40">0/1</span></div>
          </div>
          <button className="mt-4 text-xs px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/5">Klaim Reward Harian</button>
        </div>

        <div className="glass rounded-3xl p-6 border border-white/10">
          <div className="uppercase tracking-[1.5px] text-xs text-[#facc15] mb-3">RIVAL ALERT</div>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🧑‍🚀</div>
            <div className="flex-1">
              <div className="font-semibold">Raka naik ke <span className="text-[#facc15]">Gold</span></div>
              <div className="text-sm text-white/70">Skor duel: Raka 3 - Kamu 2 • Kelemahanmu: Rasio</div>
            </div>
            <button onClick={() => startBattle('Raka')} className="px-5 py-2 text-sm rounded-2xl bg-white text-[#0a0f2e] font-semibold active:scale-[0.985]">Rematch</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard, WorldMap, SkillTree, etc. abbreviated for length but functional
  const renderDashboard = () => (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="font-display text-4xl text-white mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-2 glass rounded-3xl p-8">
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-white/60 text-sm">OVERALL MASTERY</div>
              <div className="text-5xl font-semibold text-white tracking-tighter">{Math.round(Object.values(player.mastery).reduce((a,b)=>a+b,0) / Object.keys(player.mastery).length)}<span className="text-3xl text-white/40">%</span></div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/50">NEXT RECOMMENDED</div>
              <button onClick={() => startLearnMode(recommendNextLesson(player, player.completedLessons))} className="mt-1 px-5 py-2 text-sm rounded-2xl bg-[#00f0ff] text-[#0a0f2e] font-semibold">Lanjutkan Belajar →</button>
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.entries(player.mastery).map(([topicId, pct]) => {
              const t = getTopicById(topicId);
              return (
                <div key={topicId} className="flex items-center gap-4">
                  <div className="w-36 text-sm text-white/80 truncate">{t?.title || topicId}</div>
                  <div className="flex-1 h-2 bg-white/10 rounded">
                    <div className="h-2 rounded bg-gradient-to-r from-[#67e8f9] to-[#a855f7]" style={{width: `${pct}%`}} />
                  </div>
                  <div className="w-9 text-right font-mono text-xs text-white/70">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-3xl p-8 flex flex-col">
          <div className="text-white/60 text-sm mb-2">WEAK TOPICS</div>
          <div className="flex-1">
            {getWeakTopics(player).map(w => (
              <div key={w} className="py-2 px-3 bg-white/5 rounded-xl mb-2 text-sm flex justify-between">
                <span>{getTopicById(w)?.title}</span>
                <button onClick={() => startLearnMode(w)} className="text-[#00f0ff] text-xs">Latih</button>
              </div>
            ))}
          </div>
          <button onClick={() => navigateTo('worldmap')} className="mt-auto py-3 text-sm rounded-2xl border border-white/20">Buka World Map</button>
        </div>
      </div>
    </div>
  );

  const renderWorldMap = () => (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="font-display text-4xl tracking-tight text-white mb-2">World Map</h2>
      <p className="text-white/60 mb-8">Pilih zona untuk mulai perjalanan belajarmu</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Foundation World */}
        <div className="glass rounded-3xl p-7 border border-white/10">
          <div className="uppercase text-xs tracking-widest text-[#67e8f9] mb-1">FOUNDATION WORLD</div>
          <div className="text-2xl font-semibold text-white mb-4">SD • Kelas 4-6</div>
          
          {topics.filter(t => t.schoolLevel === 'SD').map(topic => (
            <div key={topic.id} className="math-card mb-3 p-4 rounded-2xl bg-white/5 flex justify-between items-center group cursor-pointer" onClick={() => startLearnMode(topic.id)}>
              <div>
                <div className="font-medium text-white group-hover:text-[#00f0ff]">{topic.title}</div>
                <div className="text-xs text-white/50">{topic.description.substring(0,60)}...</div>
              </div>
              <div className="text-right">
                {player.completedLessons.includes(topic.id) ? 
                  <span className="text-emerald-400 text-xs">✓ MASTERED</span> : 
                  <button className="text-xs px-4 py-1 rounded-full bg-white/10 group-hover:bg-[#00f0ff] group-hover:text-black transition">Mulai</button>
                }
              </div>
            </div>
          ))}
        </div>

        {/* Logic World */}
        <div className="glass rounded-3xl p-7 border border-white/10">
          <div className="uppercase text-xs tracking-widest text-[#a855f7] mb-1">LOGIC WORLD</div>
          <div className="text-2xl font-semibold text-white mb-4">SMP • Kelas 7-9</div>
          
          {topics.filter(t => t.schoolLevel === 'SMP').map(topic => (
            <div key={topic.id} className="math-card mb-3 p-4 rounded-2xl bg-white/5 flex justify-between items-center group cursor-pointer" onClick={() => startLearnMode(topic.id)}>
              <div>
                <div className="font-medium text-white group-hover:text-[#a855f7]">{topic.title}</div>
                <div className="text-xs text-white/50">{topic.description.substring(0,55)}...</div>
              </div>
              <button className="text-xs px-4 py-1 rounded-full bg-white/10 group-hover:bg-[#a855f7] group-hover:text-white transition">Mulai</button>
            </div>
          ))}
        </div>

        {/* Advanced */}
        <div className="glass rounded-3xl p-7 border border-white/10">
          <div className="uppercase text-xs tracking-widest text-[#facc15] mb-1">ADVANCED ACADEMY</div>
          <div className="text-2xl font-semibold text-white mb-4">SMA • Kelas 10-12</div>
          
          {topics.filter(t => t.schoolLevel === 'SMA').map(topic => (
            <div key={topic.id} className="math-card mb-3 p-4 rounded-2xl bg-white/5 flex justify-between items-center group cursor-pointer" onClick={() => startLearnMode(topic.id)}>
              <div>
                <div className="font-medium text-white group-hover:text-[#facc15]">{topic.title}</div>
                <div className="text-xs text-white/50">{topic.description.substring(0,55)}...</div>
              </div>
              <button className="text-xs px-4 py-1 rounded-full bg-white/10 group-hover:bg-[#facc15] group-hover:text-black transition">Mulai</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSkillTree = () => (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="font-display text-4xl text-white mb-2">Skill Tree</h2>
      <p className="text-white/60 mb-8">Skill terbuka setelah kamu memahami konsep. Gunakan di Battle &amp; Boss.</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map(skill => {
          const isUnlocked = player.unlockedSkills.includes(skill.id);
          const topic = getTopicById(skill.topicId);
          
          return (
            <div key={skill.id} className={`math-card glass rounded-3xl p-6 border ${isUnlocked ? 'border-[#00f0ff]/30' : 'border-white/10 locked-skill'}`}>
              <div className="flex justify-between">
                <div className="text-5xl mb-4">{skill.icon}</div>
                <div className={`text-xs px-3 h-fit py-0.5 rounded-full ${skill.rarity === 'Legendary' ? 'bg-[#facc15] text-black' : skill.rarity === 'Epic' ? 'bg-purple-500/80' : 'bg-white/10'}`}>{skill.rarity}</div>
              </div>
              
              <div className="font-semibold text-xl text-white mb-1">{skill.name}</div>
              <div className="text-xs text-white/50 mb-3">{topic?.title}</div>
              
              <div className="text-sm text-white/80 mb-4 min-h-[52px]">{skill.effect}</div>
              
              {isUnlocked ? (
                <div className="flex gap-2">
                  <button onClick={() => upgradeSkill(skill.id)} className="flex-1 py-2.5 text-sm rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/5">Upgrade Lv.{skill.level}</button>
                  <div className="px-4 py-2.5 text-xs rounded-2xl bg-emerald-900/60 text-emerald-300 flex items-center">READY</div>
                </div>
              ) : (
                <div className="text-xs px-4 py-3 rounded-2xl bg-white/5 text-white/50 text-center">🔒 {skill.unlockRequirement}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Learn Concept Mode - Full 4 stages
  const renderLearnMode = () => {
    const topic = getTopicById(selectedTopicId);
    if (!topic) return <div>Topic not found</div>;
    
    const cq = topic.conceptQuestions[0];

    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigateTo('worldmap')} className="text-sm text-white/60 mb-4 flex items-center gap-1">← Kembali ke World Map</button>
        
        <div className="mb-6">
          <div className="uppercase tracking-widest text-xs text-[#67e8f9]">{topic.schoolLevel} • {topic.worldName}</div>
          <h2 className="font-display text-4xl text-white">{topic.title}</h2>
        </div>

        {/* Progress Steps */}
        <div className="flex gap-2 mb-8">
          {(['intro','guided','check','unlock'] as const).map((st, idx) => (
            <div key={idx} className={`flex-1 h-1.5 rounded ${conceptStage === st || (['guided','check','unlock'].indexOf(conceptStage) > idx) ? 'bg-[#00f0ff]' : 'bg-white/10'}`} />
          ))}
        </div>

        {conceptStage === 'intro' && (
          <div className="glass rounded-3xl p-9">
            <div className="text-[#67e8f9] text-sm mb-2">CONCEPT INTRO</div>
            <h3 className="text-3xl font-semibold text-white mb-6">Apa itu {topic.title}?</h3>
            
            <div className="prose prose-invert max-w-none text-white/90">
              <p className="text-lg">{topic.conceptExplanation}</p>
              <div className="my-8 p-6 bg-white/5 rounded-2xl border-l-4 border-[#00f0ff]">
                <div className="font-medium text-[#67e8f9] mb-2">ANALOGI VISUAL</div>
                <p>{topic.visualAnalogy}</p>
              </div>
            </div>
            
            <button onClick={advanceConceptStage} className="mt-8 w-full py-4 rounded-2xl bg-white text-[#0a0f2e] font-semibold text-lg active:scale-[0.985]">Lanjut ke Guided Practice →</button>
          </div>
        )}

        {conceptStage === 'guided' && (
          <div className="glass rounded-3xl p-9">
            <div className="text-[#a855f7] text-sm mb-2">GUIDED PRACTICE</div>
            <h3 className="text-2xl font-semibold mb-6">Mari kita selesaikan bersama</h3>
            
            <div className="space-y-4 text-white/90">
              <p>Ikuti langkah-langkah penyelesaian di bawah ini. Pahami setiap langkahnya.</p>
              <div className="bg-white/5 p-6 rounded-2xl font-mono text-sm">Contoh: 2x + 6 = 14 → Kurangi 6 di kedua sisi → 2x = 8 → x = 4</div>
            </div>
            
            <button onClick={advanceConceptStage} className="mt-8 w-full py-4 rounded-2xl bg-white text-[#0a0f2e] font-semibold">Saya paham konsepnya → Concept Check</button>
          </div>
        )}

        {conceptStage === 'check' && cq && (
          <div className="glass rounded-3xl p-9">
            <div className="text-[#facc15] text-sm mb-2">CONCEPT CHECK</div>
            <h3 className="text-2xl font-semibold mb-6">Jawab pertanyaan pemahaman ini</h3>
            
            <div className="text-xl leading-tight mb-8 text-white">{cq.question}</div>
            
            <div className="space-y-3">
              {cq.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleConceptAnswer(cq.id, opt)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${conceptAnswers[cq.id] === opt ? 'border-[#00f0ff] bg-[#00f0ff]/10' : 'border-white/15 hover:bg-white/5'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            
            <button 
              onClick={advanceConceptStage} 
              disabled={!conceptAnswers[cq.id]}
              className="mt-8 w-full py-4 rounded-2xl bg-[#00f0ff] disabled:bg-white/10 disabled:text-white/40 text-[#0a0f2e] font-semibold text-lg"
            >
              Periksa Jawaban
            </button>
            
            {conceptAnswers[cq.id] && conceptAnswers[cq.id] !== cq.correctAnswer && (
              <div className="mt-4 text-sm text-rose-400">Jawaban belum tepat. Coba pilih yang lain atau lihat penjelasan setelah benar.</div>
            )}
          </div>
        )}

        {conceptStage === 'unlock' && (
          <div className="glass rounded-3xl p-9 text-center">
            <div className="text-7xl mb-6">🎉</div>
            <div className="text-[#facc15] tracking-[3px] text-sm mb-2">SKILL UNLOCKED</div>
            <h3 className="text-4xl font-semibold text-white mb-3">{getSkillById(topic.unlockSkillId)?.name}</h3>
            <p className="max-w-xs mx-auto text-white/70 mb-8">{getSkillById(topic.unlockSkillId)?.effect}</p>
            
            <button onClick={() => navigateTo('skilltree')} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white font-semibold">Lihat Skill Tree</button>
          </div>
        )}
      </div>
    );
  };

  const renderPractice = () => {
    if (practiceQuestions.length === 0) return <div className="p-10 text-center">Memuat practice...</div>;
    
    const q = practiceQuestions[currentPracticeIndex];
    
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between text-sm mb-4 text-white/60">
          <div>Speed Practice • Soal {currentPracticeIndex + 1}/{practiceQuestions.length}</div>
          <div>Combo: <span className="font-mono text-[#facc15]">{practiceCombo}x</span></div>
        </div>
        
        <div className="glass rounded-3xl p-9">
          <div className="text-xl leading-tight mb-8">{q.question}</div>
          
          <div className="grid grid-cols-1 gap-3">
            {q.options?.map((opt, i) => (
              <button key={i} onClick={() => submitPracticeAnswer(opt)} className="math-btn text-left p-5 rounded-2xl border border-white/15 hover:bg-[#00f0ff]/10 active:bg-white/5 transition">
                {opt}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-xs text-center text-white/40">Jawab cepat untuk combo dan XP bonus</div>
      </div>
    );
  };

  // ==================== BATTLE RENDER (VERY IMPORTANT) ====================
  const renderBattle = () => {
    if (battleState === 'intro') {
      return (
        <div className="max-w-md mx-auto pt-16 text-center px-6">
          <div className="text-6xl mb-4">⚔️</div>
          <h2 className="font-display text-5xl tracking-tighter">RANKED MATH DUEL</h2>
          <p className="text-white/60 mt-2 mb-8">Lawan {opponentName}. Jawab benar = serang. Salah = kena counter.</p>
          
          <button onClick={() => { setBattleState('question'); }} className="px-14 py-4 rounded-2xl bg-white text-[#0a0f2e] font-bold text-lg active:scale-[0.985]">MULAI PERTARUNGAN</button>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* HP Bars */}
        <div className="flex justify-between items-end mb-3 px-2">
          <div className="w-[42%]">
            <div className="flex justify-between text-xs mb-1.5 px-1">
              <div className="flex items-center gap-2"><span className="text-xl">{player.avatar}</span> <span className="font-semibold">Kamu</span></div>
              <div className="font-mono text-[#facc15]">{playerHP} HP</div>
            </div>
            <div className="h-3 bg-white/10 rounded overflow-hidden"><div className="hp-bar h-3 bg-emerald-400" style={{width: `${(playerHP/1000)*100}%`}} /></div>
          </div>
          
          <div className="text-center px-4">
            <div className="text-xs text-white/50">VS</div>
            <div className="text-2xl">🧑‍🚀</div>
          </div>
          
          <div className="w-[42%] text-right">
            <div className="flex justify-between text-xs mb-1.5 px-1">
              <div className="font-mono text-[#facc15]">{opponentHP} HP</div>
              <div className="font-semibold">{opponentName}</div>
            </div>
            <div className="h-3 bg-white/10 rounded overflow-hidden"><div className="hp-bar h-3 bg-rose-400" style={{width: `${(opponentHP/1000)*100}%`}} /></div>
          </div>
        </div>

        {/* Combo + Energy */}
        <div className="flex justify-center gap-8 mb-5">
          <div className="text-center">
            <div className="text-xs text-white/50">COMBO</div>
            <div className={`font-mono text-4xl font-bold tracking-tighter ${combo >= 5 ? 'text-[#facc15] combo-pulse' : 'text-white'}`}>{combo}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/50">ENERGY</div>
            <div className="font-mono text-4xl font-bold tracking-tighter text-[#67e8f9]">{energy}</div>
          </div>
        </div>

        {/* Question Area */}
        {currentBattleQuestion && battleState !== 'result' && (
          <div className="glass rounded-3xl p-8 max-w-3xl mx-auto mb-6">
            <div className="flex justify-between text-xs mb-3 text-white/50">
              <div>{currentBattleQuestion.type.toUpperCase()} • {currentBattleQuestion.conceptTag}</div>
              <div>⏱ {currentBattleQuestion.timeLimit}s</div>
            </div>
            
            <div className="text-2xl leading-tight mb-7 text-white">{currentBattleQuestion.question}</div>
            
            {/* Confidence Bet */}
            <div className="mb-6">
              <div className="text-xs text-white/50 mb-2">CONFIDENCE BET</div>
              <div className="flex gap-2">
                {(['Safe', 'Confident', 'All-In'] as const).map(c => (
                  <button key={c} onClick={() => setConfidence(c)} className={`flex-1 py-2 rounded-2xl text-sm font-medium transition ${confidence === c ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10'}`}>
                    {c} {c === 'Confident' && '×1.45'} {c === 'All-In' && '×2.3'}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentBattleQuestion.options?.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={isAnswering || battleState === 'finalClash'}
                  onClick={() => battleState === 'finalClash' ? submitFinalClash(opt) : submitBattleAnswer(opt)}
                  className="math-btn text-left px-6 py-4 rounded-2xl border border-white/15 hover:border-white/40 active:bg-white/5 disabled:opacity-60 text-lg"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skill Buttons */}
        {battleState === 'question' && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="text-xs px-2 text-white/50 mb-2">SKILL AKTIF (Energy ≥ 35)</div>
            <div className="flex flex-wrap gap-2">
              {player.unlockedSkills.map(sid => {
                const sk = getSkillById(sid);
                if (!sk) return null;
                return (
                  <button key={sid} onClick={() => activateSkillInBattle(sk)} disabled={energy < 35} className="px-5 py-2 text-sm rounded-2xl border border-white/20 disabled:opacity-40 flex items-center gap-2 active:bg-white/5">
                    <span>{sk.icon}</span> {sk.name}
                  </button>
                );
              })}
              {activeSkill && <div className="px-4 py-2 text-xs rounded-2xl bg-[#a855f7]/30 text-[#a855f7] flex items-center">+{activeSkill.damageBonus} DMG aktif</div>}
            </div>
          </div>
        )}

        {/* Battle Log */}
        <div className="max-w-3xl mx-auto">
          <div className="battle-log h-28 overflow-auto text-xs font-mono bg-black/30 rounded-2xl p-4 text-white/70 border border-white/10">
            {battleLog.map((log, i) => <div key={i} className="mb-0.5">{log}</div>)}
          </div>
        </div>

        {/* Damage Popups */}
        {damagePopups.map(p => (
          <div key={p.id} className="damage-popup text-3xl font-bold text-rose-400" style={{ left: `${p.x}%`, top: '38%' }}>
            -{p.damage} {p.isCrit && 'CRIT!'}
          </div>
        ))}

        {/* Result Modal */}
        {showResultModal && battleResult && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-6">
            <div className="glass max-w-md w-full rounded-3xl p-8 text-center">
              <div className={`text-6xl mb-4 ${battleResult.won ? 'victory-glow' : ''}`}>{battleResult.won ? '🏆' : '💪'}</div>
              <div className="text-3xl font-semibold mb-1">{battleResult.won ? 'KEMENANGAN!' : 'PERTARUNGAN SELESAI'}</div>
              <div className="text-white/70 mb-6">{battleResult.message}</div>
              
              <div className="grid grid-cols-3 gap-3 text-sm mb-8">
                <div><div className="text-white/50">XP</div><div className="font-mono text-xl text-[#67e8f9]">+{battleResult.xpGained}</div></div>
                <div><div className="text-white/50">COIN</div><div className="font-mono text-xl text-[#facc15]">+{battleResult.coinsGained}</div></div>
                <div><div className="text-white/50">ACCURACY</div><div className="font-mono text-xl">{battleResult.accuracy}%</div></div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={rematchBattle} className="flex-1 py-3.5 rounded-2xl border border-white/30 active:bg-white/5">Rematch</button>
                <button onClick={() => { setShowResultModal(false); navigateTo('dashboard'); }} className="flex-1 py-3.5 rounded-2xl bg-white text-black font-semibold">Kembali ke Dashboard</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBoss = () => {
    const boss = getBossById(selectedBossId);
    if (!boss) return null;
    const topic = getTopicById(boss.topicId);
    const phaseQ = topic?.bossPhases.find(p => p.phase === bossPhase);

    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <div className="text-7xl mb-2">{boss.icon}</div>
          <div className="text-[#facc15] tracking-[2px] text-sm">BOSS CHALLENGE • PHASE {bossPhase}/{boss.phases}</div>
          <h2 className="font-display text-5xl tracking-tighter text-white">{boss.name}</h2>
          <div className="text-white/60 mt-1">{boss.description}</div>
        </div>

        {/* Boss HP */}
        <div className="mb-8">
          <div className="flex justify-between text-xs px-1 mb-1.5 text-white/60">
            <div>BOSS HP</div><div className="font-mono">{bossHP} / {boss.hp}</div>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden"><div className="hp-bar h-4 bg-gradient-to-r from-rose-500 to-orange-400 transition-all" style={{width: `${(bossHP / boss.hp) * 100}%`}} /></div>
        </div>

        {bossResult ? (
          <div className="glass text-center p-10 rounded-3xl">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-3xl font-semibold mb-2 text-white">Boss Defeated!</div>
            <div>{bossResult.message}</div>
            <button onClick={() => navigateTo('achievements')} className="mt-8 px-8 py-3 rounded-2xl bg-white text-black">Lihat Achievement</button>
          </div>
        ) : phaseQ ? (
          <div className="glass rounded-3xl p-8">
            <div className="uppercase text-xs tracking-widest text-rose-400 mb-3">PHASE {bossPhase} • {phaseQ.isFinisher ? 'FINISHER CONCEPT' : 'CHALLENGE'}</div>
            <div className="text-2xl leading-snug mb-8 text-white">{phaseQ.question}</div>
            
            <div className="space-y-3">
              {phaseQ.options.map((opt, idx) => (
                <button key={idx} onClick={() => submitBossAnswer(opt, !!phaseQ.isFinisher)} className="math-btn w-full text-left px-6 py-4 rounded-2xl border border-white/15 hover:bg-white/5 active:bg-white/10">
                  {opt}
                </button>
              ))}
            </div>
            
            <div className="mt-6 text-xs text-center text-white/50">Jawab benar untuk mengurangi HP boss. Finisher phase butuh pemahaman konsep mendalam.</div>
          </div>
        ) : null}

        <div className="mt-6 text-center text-xs text-white/40">Kelemahan boss: {boss.weakness.join(' • ')}</div>
      </div>
    );
  };

  const renderLeaderboard = () => (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="font-display text-4xl mb-6">Leaderboard Lokal</h2>
      <div className="glass rounded-3xl overflow-hidden">
        {[...rivals, { id: 'player', name: player.name, rank: player.rank, avatar: player.avatar, winsAgainstPlayer: 0, lossesAgainstPlayer: 0, specialty: 'Math Master', weakness: '-' } as any]
          .sort((a,b) => (b.rank === 'Platinum' ? 3 : b.rank === 'Gold' ? 2 : 1) - (a.rank === 'Platinum' ? 3 : a.rank === 'Gold' ? 2 : 1))
          .map((r, idx) => (
            <div key={idx} className={`flex items-center justify-between px-6 py-4 border-b border-white/10 last:border-none ${r.id === 'player' ? 'bg-white/5' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="text-3xl w-9">{r.avatar || '👤'}</div>
                <div>
                  <div className="font-semibold">{r.name} {r.id === 'player' && <span className="text-xs text-white/50">(Kamu)</span>}</div>
                  <div className="text-xs text-white/50">{r.specialty}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`rank-badge inline-block ${r.rank === 'Gold' ? 'bg-yellow-600/70 text-yellow-200' : 'bg-white/10'}`}>{r.rank}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-md mx-auto px-6 py-8 text-center">
      <div className="text-[120px] mb-2 leading-none">{player.avatar}</div>
      <input value={player.name} onChange={(e) => savePlayer({...player, name: e.target.value})} className="bg-transparent text-center text-3xl font-semibold outline-none border-b border-white/20 focus:border-white/60" />
      
      <div className="mt-6 inline-flex items-center gap-2">
        <span className={`rank-badge text-base px-5 py-1 ${player.rank === 'Bronze' ? 'bg-orange-900 text-orange-300' : ''}`}>{player.rank}</span>
        <span className="text-white/60">Level {player.level}</span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
        <div className="glass p-5 rounded-2xl"><div className="text-white/50 text-xs">BATTLE WINS</div><div className="text-3xl font-mono mt-1">{player.battleStats.wins}</div></div>
        <div className="glass p-5 rounded-2xl"><div className="text-white/50 text-xs">BEST COMBO</div><div className="text-3xl font-mono mt-1">{player.battleStats.bestCombo}</div></div>
      </div>

      <div className="mt-8">
        <div className="text-xs text-white/50 mb-3">PILIH AVATAR</div>
        <div className="flex justify-center gap-4 text-4xl">
          {['🧙‍♂️','🦸‍♂️','👩‍🔬','🧑‍🚀','🥷','🤖'].map(av => (
            <button key={av} onClick={() => savePlayer({...player, avatar: av})} className={`p-1 rounded-2xl transition ${player.avatar === av ? 'ring-2 ring-[#00f0ff]' : 'opacity-70 hover:opacity-100'}`}>{av}</button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="font-display text-4xl mb-8">Achievements</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map(ach => (
          <div key={ach.id} className={`glass p-6 rounded-3xl flex gap-5 items-start ${ach.unlocked ? 'border border-[#facc15]/40' : 'opacity-60'}`}>
            <div className="text-5xl flex-shrink-0 mt-1">{ach.icon}</div>
            <div>
              <div className="font-semibold text-lg text-white">{ach.name}</div>
              <div className="text-white/70 text-sm mt-1">{ach.description}</div>
              {!ach.unlocked && <div className="text-xs mt-3 text-white/40">Belum terbuka</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-md mx-auto px-6 py-10">
      <h2 className="font-display text-3xl mb-8">Settings</h2>
      
      <div className="space-y-3">
        <button onClick={() => {
          if (confirm('Reset semua progress?')) {
            localStorage.clear();
            window.location.reload();
          }
        }} className="w-full py-4 text-left px-6 rounded-2xl glass hover:bg-white/5">Reset Semua Progress</button>
        
        <button onClick={() => navigateTo('home')} className="w-full py-4 text-left px-6 rounded-2xl glass hover:bg-white/5">Kembali ke Home</button>
      </div>
      
      <div className="mt-10 text-xs text-center text-white/40">MATHVERSE Skill Academy • MVP v1.0 • Data disimpan di browser kamu</div>
    </div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="game-bg text-white min-h-screen pb-12">
      {renderNav()}
      
      {currentPage === 'home' && renderHome()}
      {currentPage === 'dashboard' && renderDashboard()}
      {currentPage === 'worldmap' && renderWorldMap()}
      {currentPage === 'skilltree' && renderSkillTree()}
      {currentPage === 'learn' && renderLearnMode()}
      {currentPage === 'practice' && renderPractice()}
      {currentPage === 'battle' && renderBattle()}
      {currentPage === 'boss' && renderBoss()}
      {currentPage === 'leaderboard' && renderLeaderboard()}
      {currentPage === 'profile' && renderProfile()}
      {currentPage === 'achievements' && renderAchievements()}
      {currentPage === 'settings' && renderSettings()}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-3xl glass text-sm flex items-center gap-2 border border-white/10">
          {toast.type === 'xp' && '✨'} 
          {toast.type === 'coin' && '🪙'} 
          {toast.type === 'unlock' && '🎁'} 
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default MathVerseApp;