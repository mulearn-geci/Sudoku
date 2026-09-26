# 🧩 Sudoku - Moderate Challenge

A modern, high-polish Sudoku web game crafted with a cyber-zen aesthetic, tactile sound effects, and rewarding victory experience.

Designed strictly with **Moderate Difficulty** (~32 clues with a mathematically proven unique solution). There are **no settings, no difficulty toggles, and no theme pickers** — there is only one objective: solve the puzzle using pure deductive logic to unlock the **Victory Screen & Custom Message Box**.

---

## ✨ Features

- **🎯 Pure Moderate Difficulty**: Each puzzle is crafted with ~32 given clues, solvable purely through logical deduction (naked/hidden singles, pointing pairs, naked pairs) with zero guessing required.
- **🔒 Focused Gameplay (Zero Distractions)**: In-game settings, theme switchers, and difficulty changers are disabled.
- **🏆 Grand Victory Experience**:
  - Full-screen celebratory modal with confetti particle physics.
  - Procedural triumphant fanfare arpeggio using the Web Audio API.
  - Solved statistics: Completion Time, Total Moves, and Accuracy.
  - **Dedicated Custom Text Box**: A pre-styled, prominently featured container on the victory screen reserved for your custom message, riddle, coupon code, or prize announcement!
- **✏️ Interactive Notes / Pencil Mode**: Make candidate notes with a dedicated 3x3 subgrid per cell. Includes auto-cleanup of notes in peer cells when a digit is placed.
- **🔢 Tactile Keypad**: Responsive 1–9 keypad displaying real-time remaining counts for each number. Completed numbers are automatically badged.
- **🔊 Procedural Web Audio FX**: Built-in sound synthesis with zero external audio assets (zero latency, zero 404s, 100% offline).
- **⚡ Vercel Ready**: Preconfigured with `vercel.json` and optimized for instant, zero-config deployment.

---

## 🎁 How to Add Your Content to the Victory Text Box

When a player solves the puzzle, the victory screen appears featuring the **Special Message / Reward** container.

To add your own message, code, link, or text:

1. Open [`index.html`](index.html).
2. Locate the `<section id="victory-custom-box">` element (around line 170).
3. Replace the placeholder content inside `<div id="custom-message-content">`:

```html
<!-- ==================================================================== -->
<!-- CUSTOM VICTORY TEXT BOX                                              -->
<!-- Replace the content below with whatever you'd like to display!       -->
<!-- ==================================================================== -->
<section id="victory-custom-box" class="victory-custom-container" aria-label="Special Message">
  <div class="custom-box-header">
    <span class="custom-box-badge">SPECIAL MESSAGE / REWARD</span>
  </div>

  <div id="custom-message-content" class="custom-box-inner">
    <!-- PUT YOUR CUSTOM TEXT, CODE, OR LINK HERE: -->
    <h3>🎉 Secret Code: SUDOKU-MASTER-2026</h3>
    <p>Thank you for completing the challenge! Show this code to claim your prize.</p>
  </div>
</section>
```

---

## 🚀 How to Host on Vercel

### Option 1: Direct GitHub Import (Recommended)

1. Push this repository to your GitHub account (already linked to `https://github.com/mulearn-geci/Sudoku.git`).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Select your **`Sudoku`** repository from GitHub.
5. Leave the default settings (Framework: *Other*, Root Directory: `./`).
6. Click **Deploy**. Your Sudoku game will be live with an SSL URL in seconds!

### Option 2: Using the Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy directly from your terminal
vercel
```

---

## 💻 Local Development

You can run this project locally with any static web server:

```bash
# Using Node / npx
npm run dev

# Or with Python
python -m http.server 3000
```

Then visit `http://localhost:3000` in your browser.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `1` – `9` | Enter digit (or note if Notes mode is active) |
| `N` or `P` | Toggle Notes / Pencil mode |
| `Backspace` / `Del` | Erase cell |
| `Ctrl + Z` / `Cmd + Z` | Undo move |
| `Ctrl + Y` / `Cmd + Y` | Redo move |
| `Arrow Keys` / `W A S D` | Navigate board cells |
| `R` | Reset current puzzle inputs |

---

## 🛠️ Tech Stack

- **HTML5**: Semantic structure, accessibility (`role="grid"`), and SEO OpenGraph tags.
- **CSS3**: Vanilla CSS with custom properties, glassmorphism, flexbox/grid, and fluid typography.
- **JavaScript (ES6+)**: Backtracking solver, board validator, note management, procedural audio synthesis, and canvas confetti engine.
- **Hosting**: Vercel Static Edge.
