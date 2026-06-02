import type { Topic, Question, ConceptQuestion, BossPhaseQuestion } from '../types';

// Comprehensive but focused math content for MATHVERSE
// SD, SMP, SMA topics with concept learning + battle ready questions

export const topics: Topic[] = [
  // ========== SD ==========
  {
    id: 'sd-bilangan',
    title: 'Bilangan dan Nilai Tempat',
    schoolLevel: 'SD',
    worldName: 'Foundation World',
    description: 'Memahami nilai tempat satuan, puluhan, ratusan, dan ribuan.',
    conceptExplanation: 'Setiap angka memiliki nilai berdasarkan posisinya. Angka 5 di posisi puluhan bernilai 50.',
    visualAnalogy: 'Bayangkan seperti rak buku: rak paling kanan adalah satuan (1 buku), rak berikutnya puluhan (10 buku).',
    prerequisiteTopicIds: [],
    unlockSkillId: 'quick-add',
    questions: [
      {
        id: 'q-sd-bil-1',
        topicId: 'sd-bilangan',
        schoolLevel: 'SD',
        type: 'quick',
        difficulty: 1,
        question: 'Berapakah nilai tempat angka 7 pada bilangan 4.732?',
        options: ['7', '70', '700', '7000'],
        correctAnswer: '700',
        explanation: 'Angka 7 berada di posisi ratusan, sehingga nilainya 700.',
        conceptTag: 'nilai-tempat',
        timeLimit: 15
      },
      {
        id: 'q-sd-bil-2',
        topicId: 'sd-bilangan',
        schoolLevel: 'SD',
        type: 'quick',
        difficulty: 2,
        question: 'Ubah 3 ribu + 5 ratus + 2 puluh + 9 menjadi angka!',
        options: ['3529', '30529', '35290', '3259'],
        correctAnswer: '3529',
        explanation: '3.000 + 500 + 20 + 9 = 3.529',
        conceptTag: 'nilai-tempat',
        timeLimit: 12
      }
    ],
    conceptQuestions: [
      {
        id: 'cq-sd-bil-1',
        topicId: 'sd-bilangan',
        question: 'Mengapa angka 0 penting dalam bilangan seperti 102?',
        options: [
          'Karena membuat bilangan lebih panjang',
          'Karena menunjukkan tidak ada nilai di posisi puluhan',
          'Karena selalu harus ada di tengah',
          'Karena membuat bilangan genap'
        ],
        correctAnswer: 'Karena menunjukkan tidak ada nilai di posisi puluhan',
        explanation: 'Angka 0 adalah placeholder penting untuk menjaga nilai tempat.',
        feedback: 'Tepat! Tanpa 0, 12 akan terbaca sebagai dua belas, bukan seratus dua.'
      }
    ],
    bossPhases: [
      { phase: 1, question: 'Apa nilai tempat 5 pada 2.534?', options: ['5', '50', '500', '5000'], correctAnswer: '500', explanation: 'Posisi ratusan.', isFinisher: false },
      { phase: 2, question: 'Tulis 4 ribu 7 ratus 3 puluh 1 dalam angka.', options: ['4731', '7431', '47031', '431'], correctAnswer: '4731', explanation: '4.000 + 700 + 30 + 1 = 4.731', isFinisher: false },
      { phase: 3, question: 'Manakah yang benar tentang nilai tempat?', options: ['Angka di kiri selalu lebih kecil', 'Posisi menentukan nilai sebenarnya', 'Hanya angka 1-9 punya nilai', 'Nilai tempat hanya untuk ribuan'], correctAnswer: 'Posisi menentukan nilai sebenarnya', explanation: 'Nilai tempat bergantung posisi digit.', isFinisher: true }
    ]
  },
  {
    id: 'sd-pecahan',
    title: 'Pecahan Dasar',
    schoolLevel: 'SD',
    worldName: 'Foundation World',
    description: 'Memahami konsep pecahan sebagai bagian dari keseluruhan.',
    conceptExplanation: 'Pecahan menunjukkan bagian dari satu keseluruhan. Penyebut adalah jumlah bagian, pembilang adalah bagian yang diambil.',
    visualAnalogy: 'Seperti pizza! Jika pizza dibagi 4 sama besar, 1/4 adalah satu potong.',
    prerequisiteTopicIds: ['sd-bilangan'],
    unlockSkillId: 'fraction-slash',
    questions: [
      {
        id: 'q-sd-pec-1',
        topicId: 'sd-pecahan',
        schoolLevel: 'SD',
        type: 'quick',
        difficulty: 2,
        question: 'Berapakah 1/4 dari 20?',
        options: ['4', '5', '8', '10'],
        correctAnswer: '5',
        explanation: '20 ÷ 4 = 5. Satu bagian dari empat bagian sama adalah 5.',
        conceptTag: 'pecahan-dasar',
        timeLimit: 12
      },
      {
        id: 'q-sd-pec-2',
        topicId: 'sd-pecahan',
        schoolLevel: 'SD',
        type: 'concept',
        difficulty: 3,
        question: 'Manakah pecahan yang lebih besar: 2/5 atau 3/7?',
        options: ['2/5', '3/7', 'Sama besar', 'Tidak bisa dibandingkan'],
        correctAnswer: '3/7',
        explanation: '2/5 = 0.4, 3/7 ≈ 0.428. 3/7 lebih besar.',
        conceptTag: 'pecahan-senilai',
        timeLimit: 20
      }
    ],
    conceptQuestions: [
      {
        id: 'cq-sd-pec-1',
        topicId: 'sd-pecahan',
        question: 'Apa yang terjadi jika penyebut pecahan adalah 0?',
        options: [
          'Pecahan menjadi sangat besar',
          'Pecahan tidak terdefinisi (tidak boleh)',
          'Pecahan sama dengan 0',
          'Pembilang harus ikut 0'
        ],
        correctAnswer: 'Pecahan tidak terdefinisi (tidak boleh)',
        explanation: 'Membagi dengan nol tidak diperbolehkan dalam matematika.',
        feedback: 'Benar! Penyebut 0 membuat operasi tidak valid, seperti membagi pizza menjadi 0 bagian.'
      }
    ],
    bossPhases: [
      { phase: 1, question: 'Apa arti dari 3/4?', options: ['3 bagian dari 4', '4 bagian dari 3', '3 + 4', '3 - 4'], correctAnswer: '3 bagian dari 4', explanation: 'Pembilang 3, penyebut 4.', isFinisher: false },
      { phase: 2, question: 'Hitung: 1/2 + 1/4 = ?', options: ['2/6', '3/4', '1/3', '2/4'], correctAnswer: '3/4', explanation: '1/2=2/4, +1/4=3/4', isFinisher: false },
      { phase: 3, question: 'Mengapa 2/4 = 1/2?', options: ['Karena keduanya setengah', 'Karena bisa disederhanakan', 'Karena penyebut genap', 'Karena pembilang sama'], correctAnswer: 'Karena bisa disederhanakan', explanation: 'Bagi pembilang dan penyebut dengan 2.', isFinisher: true }
    ]
  },
  {
    id: 'sd-operasi',
    title: 'Operasi Dasar (Penjumlahan & Perkalian)',
    schoolLevel: 'SD',
    worldName: 'Foundation World',
    description: 'Menguasai penjumlahan, pengurangan, perkalian, dan pembagian cepat.',
    conceptExplanation: 'Operasi dasar adalah fondasi semua matematika. Perkalian adalah penjumlahan berulang.',
    visualAnalogy: 'Perkalian seperti barisan tentara: 6 baris × 7 kolom = 42 prajurit.',
    prerequisiteTopicIds: ['sd-bilangan'],
    unlockSkillId: 'multiply-strike',
    questions: [
      {
        id: 'q-sd-op-1',
        topicId: 'sd-operasi',
        schoolLevel: 'SD',
        type: 'quick',
        difficulty: 1,
        question: '45 + 28 = ?',
        options: ['63', '73', '83', '53'],
        correctAnswer: '73',
        explanation: '45 + 20 = 65, +8 = 73.',
        conceptTag: 'penjumlahan',
        timeLimit: 8
      },
      {
        id: 'q-sd-op-2',
        topicId: 'sd-operasi',
        schoolLevel: 'SD',
        type: 'quick',
        difficulty: 2,
        question: '7 × 8 = ?',
        options: ['48', '56', '64', '72'],
        correctAnswer: '56',
        explanation: '7 × 8 = 56 (tabel perkalian).',
        conceptTag: 'perkalian',
        timeLimit: 6
      }
    ],
    conceptQuestions: [
      {
        id: 'cq-sd-op-1',
        topicId: 'sd-operasi',
        question: 'Mengapa 8 × 0 = 0?',
        options: [
          'Karena 8 tidak punya pasangan',
          'Karena mengalikan dengan nol berarti tidak ada kelompok',
          'Karena hasilnya selalu 8',
          'Karena kesalahan penulisan'
        ],
        correctAnswer: 'Karena mengalikan dengan nol berarti tidak ada kelompok',
        explanation: '0 kelompok dari 8 sama dengan tidak ada apa-apa.',
        feedback: 'Pintar! Ini seperti membagikan 8 permen ke 0 teman — semua permen tetap di tanganmu, tapi jumlah yang dibagikan 0.'
      }
    ],
    bossPhases: [
      { phase: 1, question: '72 - 35 = ?', options: ['27', '37', '47', '17'], correctAnswer: '37', explanation: '72-30=42, -5=37.', isFinisher: false },
      { phase: 2, question: '9 × 6 = ?', options: ['45', '54', '63', '72'], correctAnswer: '54', explanation: '9×6=54.', isFinisher: false },
      { phase: 3, question: 'Apa arti dari pembagian 24 ÷ 6?', options: ['Berapa kali 6 ditambah', 'Berapa kelompok 6 dalam 24', 'Hasil kali 24 dan 6', 'Selisih 24 dan 6'], correctAnswer: 'Berapa kelompok 6 dalam 24', explanation: 'Pembagian adalah mencari berapa kelompok.', isFinisher: true }
    ]
  },

  // ========== SMP ==========
  {
    id: 'smp-aljabar',
    title: 'Aljabar Dasar & Persamaan Linear',
    schoolLevel: 'SMP',
    worldName: 'Logic World',
    description: 'Menyelesaikan persamaan linear satu variabel dengan menyeimbangkan kedua sisi.',
    conceptExplanation: 'Persamaan seperti timbangan. Apa pun yang kamu lakukan di satu sisi, harus dilakukan juga di sisi lain agar tetap seimbang.',
    visualAnalogy: 'Seperti timbangan adil: jika kamu tambah 5 kg di kiri, kamu harus tambah 5 kg di kanan.',
    prerequisiteTopicIds: ['sd-operasi'],
    unlockSkillId: 'balance-strike',
    questions: [
      {
        id: 'q-smp-alj-1',
        topicId: 'smp-aljabar',
        schoolLevel: 'SMP',
        type: 'step',
        difficulty: 3,
        question: 'Selesaikan: 2x + 7 = 19',
        options: ['x = 4', 'x = 6', 'x = 12', 'x = 5'],
        correctAnswer: 'x = 6',
        explanation: 'Kurangi 7 dari kedua sisi → 2x = 12 → x = 6.',
        conceptTag: 'persamaan-linear',
        timeLimit: 25
      }
    ],
    conceptQuestions: [
      {
        id: 'cq-smp-alj-1',
        topicId: 'smp-aljabar',
        question: 'Mengapa dalam 2x + 6 = 14, angka 6 harus dikurangi dari KEDUA sisi?',
        options: [
          'Karena angka positif harus menjadi negatif',
          'Karena kedua sisi persamaan harus tetap seimbang',
          'Karena x selalu harus dibagi dulu',
          'Karena 6 lebih kecil dari 14'
        ],
        correctAnswer: 'Karena kedua sisi persamaan harus tetap seimbang',
        explanation: 'Persamaan bekerja seperti timbangan. Kedua sisi harus tetap seimbang.',
        feedback: 'Benar sekali! Jika hanya kurangi di satu sisi, timbangan miring dan persamaan rusak.'
      }
    ],
    bossPhases: [
      { phase: 1, question: 'Apa yang harus dilakukan agar 3x = 12 menjadi x = 4?', options: ['Tambah 3 di kedua sisi', 'Bagi kedua sisi dengan 3', 'Kurangi 3 di kiri saja', 'Kalikan dengan 3'], correctAnswer: 'Bagi kedua sisi dengan 3', explanation: 'Isolasi variabel dengan operasi yang sama.', isFinisher: false },
      { phase: 2, question: 'Selesaikan 4x - 9 = 23', options: ['x=8', 'x=4', 'x=32', 'x=5'], correctAnswer: 'x=8', explanation: '4x = 32, x=8', isFinisher: false },
      { phase: 3, question: 'Kapan persamaan 5x + 2 = 5x + 2 selalu benar?', options: ['Selalu identitas', 'Tidak pernah', 'Hanya untuk x=0', 'Hanya x positif'], correctAnswer: 'Selalu identitas', explanation: 'Kedua sisi sama persis.', isFinisher: true }
    ]
  },
  {
    id: 'smp-rasio',
    title: 'Rasio dan Perbandingan',
    schoolLevel: 'SMP',
    worldName: 'Logic World',
    description: 'Memahami perbandingan dua besaran dan skala.',
    conceptExplanation: 'Rasio adalah perbandingan dua jumlah. Dapat disederhanakan seperti pecahan.',
    visualAnalogy: 'Seperti resep kue: 2 cangkir tepung : 1 cangkir gula = 2:1',
    prerequisiteTopicIds: ['sd-pecahan'],
    unlockSkillId: 'ratio-boost',
    questions: [
      {
        id: 'q-smp-ras-1',
        topicId: 'smp-rasio',
        schoolLevel: 'SMP',
        type: 'quick',
        difficulty: 2,
        question: 'Jika perbandingan guru:siswa = 1:25, berapa guru untuk 150 siswa?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '6',
        explanation: '150 ÷ 25 = 6 guru.',
        conceptTag: 'rasio',
        timeLimit: 15
      }
    ],
    conceptQuestions: [
      {
        id: 'cq-smp-ras-1',
        topicId: 'smp-rasio',
        question: 'Apa arti dari rasio 3:4 yang disederhanakan?',
        options: [
          '3 bagian berbanding 4 bagian',
          'Total ada 7 bagian',
          'Keduanya sama',
          '3 lebih besar dari 4'
        ],
        correctAnswer: '3 bagian berbanding 4 bagian',
        explanation: 'Rasio 3:4 berarti untuk setiap 3 unit pertama ada 4 unit kedua.',
        feedback: 'Bagus! Seperti 3 merah : 4 biru dalam kotak 7 bagian.'
      }
    ],
    bossPhases: [
      { phase: 1, question: 'Sederhanakan rasio 12:18', options: ['6:9', '2:3', '4:6', '3:4'], correctAnswer: '2:3', explanation: 'Bagi dengan 6.', isFinisher: false },
      { phase: 2, question: 'Jika a:b = 2:5 dan a=14, berapa b?', options: ['25', '35', '70', '5'], correctAnswer: '35', explanation: '14/2 = 7, 7×5=35.', isFinisher: false },
      { phase: 3, question: 'Mengapa rasio harus disederhanakan?', options: ['Agar lebih mudah dibaca', 'Karena itu aturan', 'Agar nilainya berubah', 'Tidak perlu'], correctAnswer: 'Agar lebih mudah dibaca', explanation: 'Bentuk sederhana lebih jelas.', isFinisher: true }
    ]
  },

  // ========== SMA ==========
  {
    id: 'sma-kuadrat',
    title: 'Fungsi Kuadrat',
    schoolLevel: 'SMA',
    worldName: 'Advanced Academy',
    description: 'Memahami grafik parabola, titik puncak, akar-akar, dan diskriminan.',
    conceptExplanation: 'Fungsi kuadrat menghasilkan grafik parabola. Bentuk standar y = ax² + bx + c. Tanda a menentukan arah buka parabola.',
    visualAnalogy: 'Bayangkan lemparan bola ke atas — lintasannya membentuk parabola.',
    prerequisiteTopicIds: ['smp-aljabar'],
    unlockSkillId: 'parabola-strike',
    questions: [
      {
        id: 'q-sma-kua-1',
        topicId: 'sma-kuadrat',
        schoolLevel: 'SMA',
        type: 'concept',
        difficulty: 4,
        question: 'Jika a > 0 pada y = ax² + bx + c, ke arah mana parabola terbuka?',
        options: ['Ke atas', 'Ke bawah', 'Ke kiri', 'Ke kanan'],
        correctAnswer: 'Ke atas',
        explanation: 'Koefisien a positif membuat parabola terbuka ke atas (minimum).',
        conceptTag: 'fungsi-kuadrat',
        timeLimit: 18
      }
    ],
    conceptQuestions: [
      {
        id: 'cq-sma-kua-1',
        topicId: 'sma-kuadrat',
        question: 'Apa arti dari diskriminan D = b² - 4ac positif, nol, dan negatif?',
        options: [
          'D>0: 2 akar nyata, D=0: 1 akar, D<0: tidak ada akar nyata',
          'D>0: tidak ada akar, D=0: 2 akar, D<0: 1 akar',
          'Semua D memberi 2 akar',
          'D hanya untuk menghitung luas'
        ],
        correctAnswer: 'D>0: 2 akar nyata, D=0: 1 akar, D<0: tidak ada akar nyata',
        explanation: 'Diskriminan menentukan jumlah dan jenis akar persamaan kuadrat.',
        feedback: 'Excellent! D>0 berarti parabola memotong sumbu x dua kali.'
      }
    ],
    bossPhases: [
      { phase: 1, question: 'Tentukan arah parabola y = -2x² + 4x + 1', options: ['Ke atas', 'Ke bawah', 'Ke kanan', 'Ke kiri'], correctAnswer: 'Ke bawah', explanation: 'a = -2 < 0.', isFinisher: false },
      { phase: 2, question: 'Hitung diskriminan y = x² - 5x + 6', options: ['1', '25', '36', '0'], correctAnswer: '1', explanation: 'b²-4ac = 25-24=1 >0, dua akar.', isFinisher: false },
      { phase: 3, question: 'Kapan fungsi kuadrat tidak memiliki akar nyata?', options: ['Diskriminan negatif', 'a=0', 'b=0', 'c negatif'], correctAnswer: 'Diskriminan negatif', explanation: 'Parabola tidak memotong sumbu x.', isFinisher: true }
    ]
  }
];

export const getTopicById = (id: string): Topic | undefined => topics.find(t => t.id === id);

export const getQuestionsByTopic = (topicId: string): Question[] => {
  const topic = getTopicById(topicId);
  return topic ? topic.questions : [];
};

export const getAllQuestions = (): Question[] => topics.flatMap(t => t.questions);