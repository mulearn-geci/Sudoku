/**
 * SUDOKU - MODERATE CHALLENGE
 * Senior Game Developer Engine & Polish
 * Fixed Moderate Difficulty with Tactile Audio & Visual Polish
 */

(function () {
  'use strict';

  // ============================================================================
  // AUDIO SYNTHESIS ENGINE (Web Audio API - Zero Dependencies, 100% Offline)
  // ============================================================================
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('sudoku_sound_enabled') !== 'false';
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('sudoku_sound_enabled', this.enabled ? 'true' : 'false');
      return this.enabled;
    }

    playTone(freq, type = 'sine', duration = 0.12, gainLevel = 0.15) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio play error', e);
      }
    }

    playSelect() {
      this.playTone(320, 'sine', 0.05, 0.04);
    }

    playPlaceNumber() {
      this.playTone(520, 'triangle', 0.12, 0.12);
    }

    playNote() {
      this.playTone(880, 'sine', 0.04, 0.05);
    }

    playErase() {
      this.playTone(240, 'triangle', 0.1, 0.08);
    }

    playError() {
      this.playTone(180, 'sawtooth', 0.18, 0.12);
    }

    playVictory() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      // Ascending triumphant arpeggio: C4, E4, G4, B4, C5, E5, G5, C6
      const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.45, 0.18);
        }, idx * 95);
      });
    }
  }

  // ============================================================================
  // CONFETTI CANVAS ENGINE
  // ============================================================================
  class ConfettiEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    start() {
      this.stop();
      this.resize();
      this.particles = [];
      const colors = ['#38bdf8', '#818cf8', '#c084fc', '#34d399', '#fbbf24', '#f43f5e'];

      // Spawn 120 confetti particles
      for (let i = 0; i < 120; i++) {
        this.particles.push({
          x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
          y: this.canvas.height / 2 + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 16,
          vy: -Math.random() * 14 - 4,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          opacity: 1,
          decay: Math.random() * 0.004 + 0.002
        });
      }

      const loop = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let activeCount = 0;
        for (const p of this.particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.vx *= 0.985; // drag
          p.rotation += p.rotationSpeed;
          p.opacity -= p.decay;

          if (p.opacity > 0 && p.y < this.canvas.height + 50) {
            activeCount++;
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            this.ctx.restore();
          }
        }

        if (activeCount > 0) {
          this.animId = requestAnimationFrame(loop);
        } else {
          this.stop();
        }
      };

      this.animId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // ============================================================================
  // CURATED MODERATE PUZZLES BANK & PROCEDURAL GENERATOR
  // All puzzles have ~32 clues and mathematically verified unique solutions.
  // ============================================================================
  const CURATED_MODERATE_PUZZLES = [
    {
      puzzle: "003010256029700000001800704000080140002900000807004329000200483210000000030500600",
      solution: "783419256429765831651823794395682147142937568867154329576291483218346975934578612",
      clues: 32
    },
    {
      puzzle: "905708030300900000780030460400020003506100000000007806200090008800371090090000510",
      solution: "945768231362914785781235469478629153526183974139457826217596348854371692693842517",
      clues: 32
    },
    {
      puzzle: "500080010000001060168790320310070000704060003080040791000820106001004208000000000",
      solution: "543286917279431865168795324315978642794162583682543791457829136931654278826317459",
      clues: 32
    },
    {
      puzzle: "009740003500012600020390175700030000005080060090007000004050080200008436003200050",
      solution: "169745823537812649428396175742631598315489267896527314674153982251978436983264751",
      clues: 32
    },
    {
      puzzle: "800070064000006000650340000000000040502007600100400708700034819300850070498000003",
      solution: "813572964274196385659348127987613542542987631136425798765234819321859476498761253",
      clues: 32
    }
  ];

  // Algorithmic Moderate Generator for infinite variety
  function generateModeratePuzzle(targetClues = 32) {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));

    function isValid(b, row, col, num) {
      for (let i = 0; i < 9; i++) {
        if (b[row][i] === num && i !== col) return false;
        if (b[i][col] === num && i !== row) return false;
        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const boxCol = 3 * Math.floor(col / 3) + (i % 3);
        if (b[boxRow][boxCol] === num && (boxRow !== row || boxCol !== col)) return false;
      }
      return true;
    }

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function fill(r = 0, c = 0) {
      if (r === 9) return true;
      const nextR = c === 8 ? r + 1 : r;
      const nextC = c === 8 ? 0 : c + 1;
      const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (const num of nums) {
        if (isValid(board, r, c, num)) {
          board[r][c] = num;
          if (fill(nextR, nextC)) return true;
          board[r][c] = 0;
        }
      }
      return false;
    }
    fill();

    function countSolutions(b, limit = 2) {
      let count = 0;
      function solve(r = 0, c = 0) {
        if (r === 9) {
          count++;
          return;
        }
        const nextR = c === 8 ? r + 1 : r;
        const nextC = c === 8 ? 0 : c + 1;
        if (b[r][c] !== 0) solve(nextR, nextC);
        else {
          for (let num = 1; num <= 9; num++) {
            if (isValid(b, r, c, num)) {
              b[r][c] = num;
              solve(nextR, nextC);
              b[r][c] = 0;
              if (count >= limit) return;
            }
          }
        }
      }
      solve();
      return count;
    }

    const puzzle = board.map(r => [...r]);
    const positions = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) positions.push([r, c]);
    }
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    let clues = 81;
    for (const [r, c] of positions) {
      if (clues <= targetClues) break;
      const temp = puzzle[r][c];
      puzzle[r][c] = 0;
      const copy = puzzle.map(row => [...row]);
      if (countSolutions(copy, 2) !== 1) {
        puzzle[r][c] = temp;
      } else {
        clues--;
      }
    }

    return {
      puzzle: puzzle.map(r => r.join('')).join(''),
      solution: board.map(r => r.join('')).join(''),
      clues
    };
  }

  // ============================================================================
  // MAIN SUDOKU GAME STATE & LOGIC
  // ============================================================================
  class SudokuGame {
    constructor() {
      this.sound = new SoundManager();
      this.confetti = new ConfettiEngine('confetti-canvas');

      // Grid Data: 9x9 arrays
      this.initialGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
      this.currentGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
      this.solutionGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
      this.notesGrid = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));

      this.selectedCell = { row: -1, col: -1 };
      this.isNotesMode = false;
      this.history = [];
      this.redoStack = [];
      this.moves = 0;
      this.timerSeconds = 0;
      this.timerInterval = null;
      this.isGameStarted = false;
      this.isGameOver = false;

      this.dom = {
        board: document.getElementById('sudoku-board'),
        timer: document.getElementById('timer-display'),
        moves: document.getElementById('moves-display'),
        progress: document.getElementById('progress-display'),
        notesBtn: document.getElementById('notes-btn'),
        undoBtn: document.getElementById('undo-btn'),
        redoBtn: document.getElementById('redo-btn'),
        eraseBtn: document.getElementById('erase-btn'),
        restartBtn: document.getElementById('restart-btn'),
        soundToggleBtn: document.getElementById('sound-toggle-btn'),
        soundOnIcon: document.querySelector('.sound-on-icon'),
        soundOffIcon: document.querySelector('.sound-off-icon'),
        numpadBtns: document.querySelectorAll('.num-btn'),
        victoryModal: document.getElementById('victory-modal'),
        victoryTime: document.getElementById('victory-time'),
        victoryMoves: document.getElementById('victory-moves'),
        modalReviewBtn: document.getElementById('modal-review-btn'),
        modalPlayAgainBtn: document.getElementById('modal-play-again-btn'),
        resetModal: document.getElementById('reset-confirm-modal'),
        confirmResetBtn: document.getElementById('confirm-reset-btn'),
        confirmCancelBtn: document.getElementById('confirm-cancel-btn')
      };

      this.initBoardDOM();
      this.bindEvents();
      this.updateSoundIcons();
      this.startNewGame();
    }

    // Create 81 cell elements in DOM
    initBoardDOM() {
      this.dom.board.innerHTML = '';
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.row = r;
          cell.dataset.col = c;
          cell.setAttribute('role', 'gridcell');
          cell.setAttribute('tabindex', '0');
          cell.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}`);

          // Notes mini container
          const notesContainer = document.createElement('div');
          notesContainer.className = 'notes-grid';
          for (let n = 1; n <= 9; n++) {
            const noteItem = document.createElement('span');
            noteItem.className = `note-item note-${n}`;
            notesContainer.appendChild(noteItem);
          }
          cell.appendChild(notesContainer);

          this.dom.board.appendChild(cell);
        }
      }
    }

    // Pick puzzle and start
    startNewGame() {
      this.isGameOver = false;
      this.moves = 0;
      this.timerSeconds = 0;
      this.history = [];
      this.redoStack = [];
      this.selectedCell = { row: -1, col: -1 };
      this.clearIntervalTimer();
      this.isGameStarted = false;
      this.dom.victoryModal.classList.remove('active');
      this.confetti.stop();

      // Pick randomly from curated bank or generate a moderate puzzle
      let puzzleData;
      if (Math.random() < 0.6) {
        puzzleData = CURATED_MODERATE_PUZZLES[Math.floor(Math.random() * CURATED_MODERATE_PUZZLES.length)];
      } else {
        puzzleData = generateModeratePuzzle(32);
      }

      // Populate grids
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const idx = r * 9 + c;
          const pVal = parseInt(puzzleData.puzzle[idx], 10);
          const sVal = parseInt(puzzleData.solution[idx], 10);

          this.initialGrid[r][c] = pVal;
          this.currentGrid[r][c] = pVal;
          this.solutionGrid[r][c] = sVal;
          this.notesGrid[r][c] = new Set();
        }
      }

      this.updateTimerDisplay();
      this.updateMovesDisplay();
      this.renderFullBoard();
      this.updateNumpadCounts();
      this.updateHistoryButtons();
    }

    startTimer() {
      if (this.isGameStarted || this.isGameOver) return;
      this.isGameStarted = true;
      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
        this.updateTimerDisplay();
      }, 1000);
    }

    clearIntervalTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    updateTimerDisplay() {
      const mins = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
      const secs = (this.timerSeconds % 60).toString().padStart(2, '0');
      this.dom.timer.textContent = `${mins}:${secs}`;
    }

    updateMovesDisplay() {
      this.dom.moves.textContent = this.moves.toString();
    }

    // Render an individual cell
    renderCell(r, c) {
      const cellEl = this.dom.board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      if (!cellEl) return;

      const val = this.currentGrid[r][c];
      const isClue = this.initialGrid[r][c] !== 0;
      const notesContainer = cellEl.querySelector('.notes-grid');

      // Clear main number text node if present
      const textNodes = Array.from(cellEl.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
      textNodes.forEach(node => node.remove());

      cellEl.classList.remove('clue', 'player-entry');

      if (val !== 0) {
        notesContainer.style.display = 'none';
        const textNode = document.createTextNode(val.toString());
        cellEl.appendChild(textNode);
        if (isClue) {
          cellEl.classList.add('clue');
        } else {
          cellEl.classList.add('player-entry');
        }
      } else {
        notesContainer.style.display = 'grid';
        const notes = this.notesGrid[r][c];
        for (let n = 1; n <= 9; n++) {
          const noteItem = notesContainer.querySelector(`.note-${n}`);
          if (noteItem) {
            noteItem.textContent = notes.has(n) ? n.toString() : '';
          }
        }
      }
    }

    // Render entire 9x9 board
    renderFullBoard() {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          this.renderCell(r, c);
        }
      }
      this.updateHighlights();
      this.updateProgress();
    }

    // Highlight row, column, box, selected, and matching numbers
    updateHighlights() {
      const { row: selR, col: selC } = this.selectedCell;
      const selVal = (selR >= 0 && selC >= 0) ? this.currentGrid[selR][selC] : 0;

      const cells = this.dom.board.querySelectorAll('.cell');
      cells.forEach(cell => {
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        const cellVal = this.currentGrid[r][c];

        cell.classList.remove('selected', 'peer-highlight', 'match-highlight');

        if (selR === -1 || selC === -1) return;

        if (r === selR && c === selC) {
          cell.classList.add('selected');
        } else if (
          r === selR ||
          c === selC ||
          (Math.floor(r / 3) === Math.floor(selR / 3) && Math.floor(c / 3) === Math.floor(selC / 3))
        ) {
          cell.classList.add('peer-highlight');
        }

        if (selVal !== 0 && cellVal === selVal && !(r === selR && c === selC)) {
          cell.classList.add('match-highlight');
        }
      });
    }

    // Update remaining counters on keypad 1-9
    updateNumpadCounts() {
      const counts = Array(10).fill(0);
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const val = this.currentGrid[r][c];
          if (val >= 1 && val <= 9) {
            counts[val]++;
          }
        }
      }

      this.dom.numpadBtns.forEach(btn => {
        const num = parseInt(btn.dataset.number, 10);
        const placed = counts[num] || 0;
        const left = Math.max(0, 9 - placed);
        const countSpan = btn.querySelector('.num-count');

        if (left === 0) {
          countSpan.textContent = '✓ Done';
          btn.classList.add('completed');
        } else {
          countSpan.textContent = `${left} left`;
          btn.classList.remove('completed');
        }
      });
    }

    // Update progress percentage
    updateProgress() {
      let filled = 0;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (this.currentGrid[r][c] !== 0) filled++;
        }
      }
      const pct = Math.floor((filled / 81) * 100);
      this.dom.progress.textContent = `${pct}%`;
    }

    selectCell(r, c) {
      if (this.isGameOver) return;
      if (r < 0 || r > 8 || c < 0 || c > 8) return;

      this.selectedCell = { row: r, col: c };
      this.sound.playSelect();
      this.updateHighlights();
    }

    // Input digit or toggle note
    handleDigitInput(num) {
      if (this.isGameOver) return;
      const { row: r, col: c } = this.selectedCell;
      if (r === -1 || c === -1) return;

      // Given clues cannot be modified
      if (this.initialGrid[r][c] !== 0) return;

      this.startTimer();

      if (this.isNotesMode) {
        // Toggle note candidate
        const notes = this.notesGrid[r][c];
        const oldNotes = new Set(notes);
        if (notes.has(num)) {
          notes.delete(num);
        } else {
          notes.add(num);
        }
        this.pushHistory({
          type: 'note',
          row: r,
          col: c,
          oldNotes,
          newNotes: new Set(notes)
        });
        this.sound.playNote();
        this.renderCell(r, c);
      } else {
        // Normal digit placement
        const oldVal = this.currentGrid[r][c];
        if (oldVal === num) return; // Same number already

        const oldNotes = new Set(this.notesGrid[r][c]);

        // Place number
        this.currentGrid[r][c] = num;
        this.notesGrid[r][c].clear();
        this.moves++;
        this.updateMovesDisplay();

        // Auto remove this note from peers
        const peerChanges = [];
        for (let i = 0; i < 9; i++) {
          // Row peers
          if (i !== c && this.notesGrid[r][i].has(num)) {
            peerChanges.push({ r, c: i, notes: new Set(this.notesGrid[r][i]) });
            this.notesGrid[r][i].delete(num);
            this.renderCell(r, i);
          }
          // Col peers
          if (i !== r && this.notesGrid[i][c].has(num)) {
            peerChanges.push({ r: i, c, notes: new Set(this.notesGrid[i][c]) });
            this.notesGrid[i][c].delete(num);
            this.renderCell(i, c);
          }
        }
        // Box peers
        const boxR = 3 * Math.floor(r / 3);
        const boxC = 3 * Math.floor(c / 3);
        for (let br = 0; br < 3; br++) {
          for (let bc = 0; bc < 3; bc++) {
            const pr = boxR + br;
            const pc = boxC + bc;
            if ((pr !== r || pc !== c) && this.notesGrid[pr][pc].has(num)) {
              peerChanges.push({ r: pr, c: pc, notes: new Set(this.notesGrid[pr][pc]) });
              this.notesGrid[pr][pc].delete(num);
              this.renderCell(pr, pc);
            }
          }
        }

        this.pushHistory({
          type: 'value',
          row: r,
          col: c,
          oldValue: oldVal,
          newValue: num,
          oldNotes,
          peerChanges
        });

        this.sound.playPlaceNumber();
        this.renderCell(r, c);

        // Pop animation
        const cellEl = this.dom.board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cellEl) {
          cellEl.classList.remove('pop-animate');
          void cellEl.offsetWidth; // trigger reflow
          cellEl.classList.add('pop-animate');
        }

        this.updateHighlights();
        this.updateNumpadCounts();
        this.updateProgress();

        // Check victory
        this.checkWinCondition();
      }
    }

    // Erase cell content
    eraseSelectedCell() {
      if (this.isGameOver) return;
      const { row: r, col: c } = this.selectedCell;
      if (r === -1 || c === -1) return;
      if (this.initialGrid[r][c] !== 0) return;

      const oldVal = this.currentGrid[r][c];
      const oldNotes = new Set(this.notesGrid[r][c]);

      if (oldVal === 0 && oldNotes.size === 0) return;

      this.startTimer();
      this.currentGrid[r][c] = 0;
      this.notesGrid[r][c].clear();
      this.moves++;
      this.updateMovesDisplay();

      this.pushHistory({
        type: 'erase',
        row: r,
        col: c,
        oldValue: oldVal,
        newValue: 0,
        oldNotes
      });

      this.sound.playErase();
      this.renderCell(r, c);
      this.updateHighlights();
      this.updateNumpadCounts();
      this.updateProgress();
    }

    // Push action to history
    pushHistory(action) {
      this.history.push(action);
      this.redoStack = []; // Clear redo stack on new action
      this.updateHistoryButtons();
    }

    undo() {
      if (this.history.length === 0 || this.isGameOver) return;
      const action = this.history.pop();
      this.redoStack.push(action);

      const { row: r, col: c } = action;

      if (action.type === 'value' || action.type === 'erase') {
        this.currentGrid[r][c] = action.oldValue;
        this.notesGrid[r][c] = new Set(action.oldNotes);
        if (action.peerChanges) {
          action.peerChanges.forEach(pc => {
            this.notesGrid[pc.r][pc.c] = new Set(pc.notes);
            this.renderCell(pc.r, pc.c);
          });
        }
      } else if (action.type === 'note') {
        this.notesGrid[r][c] = new Set(action.oldNotes);
      }

      this.sound.playErase();
      this.renderCell(r, c);
      this.updateHighlights();
      this.updateNumpadCounts();
      this.updateProgress();
      this.updateHistoryButtons();
    }

    redo() {
      if (this.redoStack.length === 0 || this.isGameOver) return;
      const action = this.redoStack.pop();
      this.history.push(action);

      const { row: r, col: c } = action;

      if (action.type === 'value' || action.type === 'erase') {
        this.currentGrid[r][c] = action.newValue;
        this.notesGrid[r][c].clear();
        if (action.peerChanges && action.newValue !== 0) {
          action.peerChanges.forEach(pc => {
            this.notesGrid[pc.r][pc.c].delete(action.newValue);
            this.renderCell(pc.r, pc.c);
          });
        }
      } else if (action.type === 'note') {
        this.notesGrid[r][c] = new Set(action.newNotes);
      }

      this.sound.playPlaceNumber();
      this.renderCell(r, c);
      this.updateHighlights();
      this.updateNumpadCounts();
      this.updateProgress();
      this.updateHistoryButtons();
    }

    updateHistoryButtons() {
      this.dom.undoBtn.disabled = this.history.length === 0;
      this.dom.redoBtn.disabled = this.redoStack.length === 0;
    }

    toggleNotesMode() {
      this.isNotesMode = !this.isNotesMode;
      const pill = this.dom.notesBtn.querySelector('.notes-indicator-pill');
      if (this.isNotesMode) {
        this.dom.notesBtn.classList.add('active-notes');
        pill.textContent = 'ON';
      } else {
        this.dom.notesBtn.classList.remove('active-notes');
        pill.textContent = 'OFF';
      }
      this.sound.playNote();
    }

    // Reset current puzzle inputs
    resetCurrentPuzzle() {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          this.currentGrid[r][c] = this.initialGrid[r][c];
          this.notesGrid[r][c] = new Set();
        }
      }
      this.history = [];
      this.redoStack = [];
      this.moves = 0;
      this.timerSeconds = 0;
      this.clearIntervalTimer();
      this.isGameStarted = false;
      this.updateTimerDisplay();
      this.updateMovesDisplay();
      this.renderFullBoard();
      this.updateNumpadCounts();
      this.updateHistoryButtons();
      this.sound.playErase();
    }

    // Check if player solved the puzzle
    checkWinCondition() {
      // Check if all 81 cells are filled
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (this.currentGrid[r][c] === 0) return;
        }
      }

      // Check all cells against solution
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (this.currentGrid[r][c] !== this.solutionGrid[r][c]) {
            return; // Not yet completely solved
          }
        }
      }

      // VICTORY!
      this.isGameOver = true;
      this.clearIntervalTimer();
      this.sound.playVictory();
      this.confetti.start();

      // Populate victory stats
      const mins = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
      const secs = (this.timerSeconds % 60).toString().padStart(2, '0');
      this.dom.victoryTime.textContent = `${mins}:${secs}`;
      this.dom.victoryMoves.textContent = this.moves.toString();

      // Show victory modal after brief fanfare delay
      setTimeout(() => {
        this.dom.victoryModal.classList.add('active');
      }, 500);
    }

    updateSoundIcons() {
      if (this.sound.enabled) {
        this.dom.soundOnIcon.style.display = 'block';
        this.dom.soundOffIcon.style.display = 'none';
      } else {
        this.dom.soundOnIcon.style.display = 'none';
        this.dom.soundOffIcon.style.display = 'block';
      }
    }

    // Event Listeners setup
    bindEvents() {
      // Cell clicks
      this.dom.board.addEventListener('click', e => {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        this.selectCell(r, c);
      });

      // Numpad clicks
      this.dom.numpadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const num = parseInt(btn.dataset.number, 10);
          this.handleDigitInput(num);
        });
      });

      // Action buttons
      this.dom.notesBtn.addEventListener('click', () => this.toggleNotesMode());
      this.dom.eraseBtn.addEventListener('click', () => this.eraseSelectedCell());
      this.dom.undoBtn.addEventListener('click', () => this.undo());
      this.dom.redoBtn.addEventListener('click', () => this.redo());

      // Reset modal trigger
      this.dom.restartBtn.addEventListener('click', () => {
        this.dom.resetModal.classList.add('active');
      });

      this.dom.confirmCancelBtn.addEventListener('click', () => {
        this.dom.resetModal.classList.remove('active');
      });

      this.dom.confirmResetBtn.addEventListener('click', () => {
        this.dom.resetModal.classList.remove('active');
        this.resetCurrentPuzzle();
      });

      // Sound toggle
      this.dom.soundToggleBtn.addEventListener('click', () => {
        this.sound.toggle();
        this.updateSoundIcons();
      });

      // Victory Modal buttons
      this.dom.modalReviewBtn.addEventListener('click', () => {
        this.dom.victoryModal.classList.remove('active');
      });

      this.dom.modalPlayAgainBtn.addEventListener('click', () => {
        this.startNewGame();
      });

      // Keyboard navigation and shortcuts
      window.addEventListener('keydown', e => {
        // Ignore if typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Digits 1-9
        if (e.key >= '1' && e.key <= '9') {
          e.preventDefault();
          this.handleDigitInput(parseInt(e.key, 10));
          return;
        }

        // Notes toggle
        if (e.key === 'n' || e.key === 'N' || e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          this.toggleNotesMode();
          return;
        }

        // Erase
        if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          this.eraseSelectedCell();
          return;
        }

        // Undo / Redo
        if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
          e.preventDefault();
          if (e.shiftKey) {
            this.redo();
          } else {
            this.undo();
          }
          return;
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
          e.preventDefault();
          this.redo();
          return;
        }

        // Reset
        if (e.key === 'r' || e.key === 'R') {
          if (!this.dom.resetModal.classList.contains('active')) {
            this.dom.resetModal.classList.add('active');
          }
          return;
        }

        // Arrow navigation
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
          e.preventDefault();
          let { row: r, col: c } = this.selectedCell;
          if (r === -1 || c === -1) {
            this.selectCell(0, 0);
            return;
          }
          if (e.key === 'ArrowUp' || e.key === 'w') r = (r - 1 + 9) % 9;
          if (e.key === 'ArrowDown' || e.key === 's') r = (r + 1) % 9;
          if (e.key === 'ArrowLeft' || e.key === 'a') c = (c - 1 + 9) % 9;
          if (e.key === 'ArrowRight' || e.key === 'd') c = (c + 1) % 9;
          this.selectCell(r, c);
        }
      });
    }
  }

  // Initialize game on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    window.sudokuGame = new SudokuGame();
  });
})();
