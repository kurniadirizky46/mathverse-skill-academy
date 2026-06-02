# MATHVERSE: SKILL ACADEMY

**Pahami konsepnya, buka skillnya, kalahkan rivalmu.**

Educational RPG + Math Battle Arena web game untuk siswa SD, SMP, dan SMA. Dibangun sebagai modern, kompetitif, dan edukatif menggunakan React + TypeScript + Tailwind.

## Fitur Utama (MVP Lengkap & Playable)

✅ Home/Landing dengan player summary, daily mission, rival alert  
✅ Dashboard statistik + adaptive recommendation  
✅ World Map (SD / SMP / SMA zones)  
✅ Learn Concept Mode (4 tahap lengkap + Concept Check)  
✅ Practice Mode dengan combo  
✅ **Battle Arena** — HP, Combo, Energy, Confidence Bet, Skill activation, Final Clash, damage animation  
✅ **Boss Challenge** multi-phase + finisher concept  
✅ Skill Tree + unlock dari pemahaman konsep  
✅ Leaderboard, Profile (avatar switch), Achievements  
✅ Full LocalStorage persistence + Reset progress  
✅ Responsive futuristic neon glassmorphism UI  

Semua 20 minimum playable requirements terpenuhi.

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka browser di `http://localhost:5173`

---

## Cara Deploy ke Online (Vercel) - Paling Mudah

Game ini **sudah siap deploy** ke Vercel, Netlify, atau platform static hosting lainnya.

### Langkah Deploy ke Vercel (Gratis & Cepat)

1. **Buat akun Vercel**
   - Buka: [https://vercel.com](https://vercel.com)
   - Login menggunakan **GitHub**

2. **Upload Project ke GitHub**
   - Buat repository baru di GitHub dengan nama `mathverse-skill-academy`
   - Upload semua file dari folder ini ke repository tersebut

3. **Deploy ke Vercel**
   - Di Vercel, klik **"Add New Project"**
   - Pilih repository GitHub kamu (`mathverse-skill-academy`)
   - Vercel akan otomatis mendeteksi Vite React
   - Klik **Deploy**

4. Selesai!  
   Vercel akan memberikan URL gratis seperti:
   - `https://mathverse-skill-academy.vercel.app`

### Catatan Penting:
- Game ini **static** (tidak butuh backend)
- Semua progress disimpan di browser (LocalStorage)
- Tailwind menggunakan CDN (ringan)
- Cocok di-deploy di Vercel / Netlify / GitHub Pages

---

## Struktur Folder

```
C:\game_grok\
├── src/
│   ├── App.tsx
│   ├── data/
│   ├── utils/
│   └── types/
├── public/
├── vercel.json          ← Sudah disediakan
├── package.json
├── vite.config.ts
└── index.html
```

## Struktur Proyek

```
src/
├── App.tsx              # Semua game logic & UI (SPA)
├── types/index.ts
├── data/
│   ├── mathContent.ts   # Topics + questions + boss phases
│   ├── skills.ts
│   ├── bosses.ts
│   └── rivals.ts
├── utils/
│   ├── battleEngine.ts
│   ├── rewardEngine.ts
│   └── adaptiveEngine.ts
```

## Cara Menambah Materi / Skill / Boss

Edit file di folder `src/data/`. Ikuti interface yang sudah ada di `types/index.ts`.

## Catatan

- Tailwind via CDN (stabil di environment tanpa install tambahan)
- Siap dikembangkan ke backend, multiplayer, teacher dashboard
- Tidak ada dark pattern, bullying, atau monetisasi
- Cocok untuk anak sekolah & kompetisi sehat

Dibuat sebagai proyek edukatif lengkap.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
