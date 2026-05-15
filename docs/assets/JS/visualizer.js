/* ============================================================
   DSA Visualizer — Visualization Engine
   Trace player, array renderer, code highlighter, controls.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const engine = new VisualizationEngine();
  engine.init();
});

/* ══════════════════════════════════════════════════════════════
   VISUALIZATION ENGINE
   ══════════════════════════════════════════════════════════════ */
class VisualizationEngine {
  constructor() {
    // DOM references
    this.codeBody = document.getElementById('viz-code-body');
    this.canvas = document.getElementById('viz-canvas');
    this.varsGrid = document.getElementById('viz-vars-grid');
    this.stepText = document.getElementById('viz-step-text');
    this.progressBar = document.getElementById('viz-progress');
    this.stepCounter = document.getElementById('viz-step-counter');
    this.speedLabel = document.getElementById('viz-speed-label');
    this.playIcon = document.getElementById('play-icon');
    this.pauseIcon = document.getElementById('pause-icon');

    // State
    this.trace = [];
    this.currentStep = -1;
    this.isPlaying = false;
    this.speed = 1;
    this.playTimer = null;
    this.originalArray = [];
  }

  init() {
    this.loadMockData();
    this.renderCode();
    this.renderBars();
    this.updateStepCounter();
    this.bindControls();
    this.bindKeyboard();
  }

  /* ── Mock Trace Data (Phase 1) ─────────────────────────── */
  loadMockData() {
    this.code = [
      'void bubbleSort(int arr[], int n) {',
      '  for (int i = 0; i < n-1; i++) {',
      '    for (int j = 0; j < n-i-1; j++) {',
      '      if (arr[j] > arr[j+1]) {',
      '        swap(arr[j], arr[j+1]);',
      '      }',
      '    }',
      '  }',
      '}',
    ];

    this.originalArray = [64, 34, 25, 12, 22, 11, 90];

    // Build trace: each step is { line, action, indices, array, variables, description }
    this.trace = this.generateBubbleSortTrace([...this.originalArray]);
  }

  generateBubbleSortTrace(arr) {
    const trace = [];
    const n = arr.length;

    trace.push({
      line: 0, action: 'init', indices: [], array: [...arr],
      variables: { n: n },
      description: 'Starting Bubble Sort on the array.'
    });

    for (let i = 0; i < n - 1; i++) {
      trace.push({
        line: 1, action: 'loop-outer', indices: [], array: [...arr],
        variables: { i: i, n: n },
        description: `Outer loop: pass ${i + 1} of ${n - 1}.`
      });

      for (let j = 0; j < n - i - 1; j++) {
        // Compare
        trace.push({
          line: 3, action: 'compare', indices: [j, j + 1], array: [...arr],
          variables: { i: i, j: j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
          description: `Comparing arr[${j}] = <strong>${arr[j]}</strong> with arr[${j + 1}] = <strong>${arr[j + 1]}</strong>.`
        });

        if (arr[j] > arr[j + 1]) {
          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          trace.push({
            line: 4, action: 'swap', indices: [j, j + 1], array: [...arr],
            variables: { i: i, j: j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
            description: `Swapping arr[${j}] and arr[${j + 1}] → [${arr.join(', ')}]`
          });
        }
      }

      // Mark sorted element
      trace.push({
        line: 6, action: 'sorted', indices: [n - i - 1], array: [...arr],
        variables: { i: i },
        description: `Element at index ${n - i - 1} is now in its sorted position.`
      });
    }

    // Final sorted
    trace.push({
      line: 8, action: 'done', indices: [], array: [...arr],
      variables: {},
      description: 'Array is fully sorted! ✓'
    });

    return trace;
  }

  /* ── Render Code Panel ──────────────────────────────────── */
  renderCode() {
    if (!this.codeBody) return;
    this.codeBody.innerHTML = this.code.map((line, i) =>
      `<div class="viz-code-line" data-line="${i}">
        <span class="viz-code-line-num">${i + 1}</span>
        <span class="viz-code-line-content">${this.highlightSyntax(line)}</span>
      </div>`
    ).join('');
  }

  highlightSyntax(line) {
    const KEYWORDS = new Set(['void', 'int', 'for', 'if', 'return', 'break', 'continue', 'while', 'do', 'else', 'class', 'struct', 'bool', 'char', 'float', 'double', 'long', 'unsigned', 'const', 'static', 'sizeof', 'typedef', 'enum', 'switch', 'case', 'default', 'true', 'false', 'nullptr', 'NULL', 'include', 'using', 'namespace', 'std']);
    const FUNCTIONS = new Set(['swap', 'cout', 'cin', 'endl', 'printf', 'scanf', 'push', 'pop', 'push_back', 'sort', 'begin', 'end', 'size', 'length', 'main']);
    const tokens = [];
    let i = 0;

    while (i < line.length) {
      // Comments
      if (line[i] === '/' && line[i + 1] === '/') {
        tokens.push('<span class="syn-comment">' + this.esc(line.slice(i)) + '</span>');
        break;
      }
      // Strings
      if (line[i] === '"' || line[i] === "'") {
        const q = line[i];
        let str = q;
        i++;
        while (i < line.length && line[i] !== q) { str += line[i]; i++; }
        if (i < line.length) { str += line[i]; i++; }
        tokens.push('<span class="syn-string">' + this.esc(str) + '</span>');
        continue;
      }
      // Words (keywords, functions, identifiers)
      if (/[a-zA-Z_]/.test(line[i])) {
        let word = '';
        while (i < line.length && /[a-zA-Z_0-9]/.test(line[i])) { word += line[i]; i++; }
        if (KEYWORDS.has(word)) tokens.push('<span class="syn-keyword">' + word + '</span>');
        else if (FUNCTIONS.has(word)) tokens.push('<span class="syn-function">' + word + '</span>');
        else tokens.push(word);
        continue;
      }
      // Numbers
      if (/[0-9]/.test(line[i])) {
        let num = '';
        while (i < line.length && /[0-9.]/.test(line[i])) { num += line[i]; i++; }
        tokens.push('<span class="syn-number">' + num + '</span>');
        continue;
      }
      // Operators
      if ('<>=!&|+-*/%^~'.includes(line[i])) {
        let op = '';
        while (i < line.length && '<>=!&|+-*/%^~'.includes(line[i])) { op += line[i]; i++; }
        tokens.push('<span class="syn-operator">' + this.esc(op) + '</span>');
        continue;
      }
      // Brackets
      if ('()[]{}'.includes(line[i])) {
        tokens.push('<span class="syn-bracket">' + this.esc(line[i]) + '</span>');
        i++;
        continue;
      }
      // Semicolons, commas, dots — plain
      tokens.push(this.esc(line[i]));
      i++;
    }
    return tokens.join('');
  }

  esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ── Render Array Bars ──────────────────────────────────── */
  renderBars(array, highlights = {}) {
    if (!this.canvas) return;
    const arr = array || this.originalArray;
    const maxVal = Math.max(...arr);
    const barMaxHeight = 280;

    this.canvas.innerHTML = arr.map((val, i) => {
      const height = Math.max(20, (val / maxVal) * barMaxHeight);
      let stateClass = '';

      if (highlights.comparing && highlights.comparing.includes(i)) stateClass = 'comparing';
      if (highlights.swapping && highlights.swapping.includes(i)) stateClass = 'swapping';
      if (highlights.sorted && highlights.sorted.includes(i)) stateClass = 'sorted';
      if (highlights.active && highlights.active.includes(i)) stateClass = 'active';

      return `<div class="array-bar ${stateClass}" data-index="${i}">
        <span class="array-bar-value">${val}</span>
        <div class="array-bar-rect" style="height: ${height}px;"></div>
        <span class="array-bar-index">${i}</span>
      </div>`;
    }).join('');
  }

  /* ── Execute Step ───────────────────────────────────────── */
  goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.trace.length) return;

    this.currentStep = stepIndex;
    const step = this.trace[stepIndex];

    // Track all sorted indices up to this step
    const sortedIndices = new Set();
    for (let s = 0; s <= stepIndex; s++) {
      if (this.trace[s].action === 'sorted') {
        this.trace[s].indices.forEach(idx => sortedIndices.add(idx));
      }
    }
    if (step.action === 'done') {
      step.array.forEach((_, i) => sortedIndices.add(i));
    }

    // Build highlights
    const highlights = { sorted: [...sortedIndices] };
    if (step.action === 'compare') highlights.comparing = step.indices;
    if (step.action === 'swap') highlights.swapping = step.indices;

    // Update UI
    this.renderBars(step.array, highlights);
    this.highlightLine(step.line);
    this.updateVariables(step.variables);
    this.updateDescription(step.description);
    this.updateProgress();
    this.updateStepCounter();
  }

  highlightLine(lineIndex) {
    if (!this.codeBody) return;
    const lines = this.codeBody.querySelectorAll('.viz-code-line');
    lines.forEach(l => l.classList.remove('active'));
    if (lines[lineIndex]) {
      lines[lineIndex].classList.add('active');
      lines[lineIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  updateVariables(vars) {
    if (!this.varsGrid) return;
    if (!vars || Object.keys(vars).length === 0) {
      this.varsGrid.innerHTML = '<span style="color: var(--color-text-muted); font-size: 12px;">No variables in scope</span>';
      return;
    }
    this.varsGrid.innerHTML = Object.entries(vars).map(([name, val]) =>
      `<div class="viz-var">
        <span class="viz-var-name">${name}</span>
        <span class="viz-var-eq">=</span>
        <span class="viz-var-val">${val}</span>
      </div>`
    ).join('');
  }

  updateDescription(desc) {
    if (this.stepText) this.stepText.innerHTML = desc;
  }

  updateProgress() {
    if (!this.progressBar) return;
    const pct = this.trace.length > 1 ? (this.currentStep / (this.trace.length - 1)) * 100 : 0;
    this.progressBar.style.width = pct + '%';
  }

  updateStepCounter() {
    if (this.stepCounter) {
      this.stepCounter.textContent = `Step ${Math.max(0, this.currentStep + 1)} / ${this.trace.length}`;
    }
  }

  /* ── Playback Controls ─────────────────────────────────── */
  play() {
    if (this.currentStep >= this.trace.length - 1) {
      this.reset();
    }
    this.isPlaying = true;
    this.updatePlayButton();
    this.tick();
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.playTimer);
    this.updatePlayButton();
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  tick() {
    if (!this.isPlaying) return;
    if (this.currentStep >= this.trace.length - 1) {
      this.pause();
      return;
    }
    this.goToStep(this.currentStep + 1);
    const delay = 600 / this.speed;
    this.playTimer = setTimeout(() => this.tick(), delay);
  }

  stepForward() {
    this.pause();
    if (this.currentStep < this.trace.length - 1) {
      this.goToStep(this.currentStep + 1);
    }
  }

  stepBackward() {
    this.pause();
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1);
    }
  }

  reset() {
    this.pause();
    this.currentStep = -1;
    this.renderBars();
    if (this.codeBody) {
      this.codeBody.querySelectorAll('.viz-code-line').forEach(l => l.classList.remove('active'));
    }
    this.updateVariables({});
    this.updateDescription('Press <strong>Play</strong> to start the visualization, or use <strong>Step</strong> to advance one operation at a time.');
    if (this.progressBar) this.progressBar.style.width = '0%';
    this.updateStepCounter();
  }

  randomize() {
    this.pause();
    this.originalArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    this.trace = this.generateBubbleSortTrace([...this.originalArray]);
    this.currentStep = -1;
    this.renderBars();
    this.updateStepCounter();
    this.updateDescription('Array randomized! Press <strong>Play</strong> to sort.');
    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.codeBody) {
      this.codeBody.querySelectorAll('.viz-code-line').forEach(l => l.classList.remove('active'));
    }
    this.updateVariables({});
  }

  setSpeed(val) {
    this.speed = parseFloat(val);
    if (this.speedLabel) this.speedLabel.textContent = this.speed + 'x';
  }

  updatePlayButton() {
    if (this.playIcon) this.playIcon.style.display = this.isPlaying ? 'none' : 'block';
    if (this.pauseIcon) this.pauseIcon.style.display = this.isPlaying ? 'block' : 'none';
  }

  /* ── Bind UI Controls ───────────────────────────────────── */
  bindControls() {
    const btn = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => fn.call(this));
    };

    btn('viz-play', this.togglePlay);
    btn('viz-reset', this.reset);
    btn('viz-step-fwd', this.stepForward);
    btn('viz-step-back', this.stepBackward);
    btn('viz-randomize', this.randomize);

    const slider = document.getElementById('viz-speed-slider');
    if (slider) {
      slider.addEventListener('input', (e) => this.setSpeed(e.target.value));
    }
  }

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          this.togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.stepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.stepBackward();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          this.reset();
          break;
      }
    });
  }
}
