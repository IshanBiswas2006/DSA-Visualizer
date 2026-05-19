/* ============================================================
   DSA Visualizer — Visualization Engine
   Trace player, array renderer, code highlighter, controls, step audio.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const engine = new VisualizationEngine();
  engine.init();
});

class VisualizationEngine {
  constructor() {
    this.codeBody = document.getElementById('viz-code-body');
    this.canvas = document.getElementById('viz-canvas');
    this.varsGrid = document.getElementById('viz-vars-grid');
    this.stepText = document.getElementById('viz-step-text');
    this.stepDescription = document.getElementById('viz-description');
    this.progressBar = document.getElementById('viz-progress');
    this.stepCounter = document.getElementById('viz-step-counter');
    this.speedLabel = document.getElementById('viz-speed-label');
    this.playIcon = document.getElementById('play-icon');
    this.pauseIcon = document.getElementById('pause-icon');
    this.soundToggle = document.getElementById('viz-sound-toggle');
    this.dropdownEl = document.getElementById('algo-dropdown');
    this.dropdownTrigger = document.getElementById('algo-dropdown-trigger');
    this.dropdownLabel = document.getElementById('algo-dropdown-label');
    this.dropdownHeader = document.getElementById('algo-dropdown-header');
    this.dropdownList = document.getElementById('algo-dropdown-list');
    this.categoryBadge = document.getElementById('viz-category-badge');
    this.fileNameEl = document.getElementById('viz-file-name');
    this.trace = [];
    this.currentStep = -1;
    this.isPlaying = false;
    this.speed = 1;
    this.playTimer = null;
    this.originalArray = [];
    this.currentCategory = 'sorting';
    this.currentAlgo = 'bubble-sort';
    this.searchTarget = null;
    this.audio = new StepAudioEngine();
  }

  init() {
    this.parseURL();
    this.loadAlgorithm();
    this.renderCode();
    this.renderBars();
    this.updateStepCounter();
    this.bindControls();
    this.bindKeyboard();
    this.initDropdown();
    this.updateSoundToggleUI();
  }

  parseURL() {
    const p = new URLSearchParams(window.location.search);
    const cat = p.get('cat');
    if (cat && (ALGO_REGISTRY[cat] || getRegistryCategory(cat))) {
      this.currentCategory = ALGO_REGISTRY[cat] ? cat : getRegistryCategory(cat);
    }
    const algo = p.get('algo');
    if (algo) { this.currentAlgo = algo; }
    else {
      const reg = ALGO_REGISTRY[this.currentCategory];
      if (reg && reg.algorithms.length) this.currentAlgo = reg.algorithms[0].slug;
    }
  }

  unlockAudio() {
    this.audio.unlock();
  }

  loadAlgorithm() {
    const reg = ALGO_REGISTRY[this.currentCategory];
    const algoInfo = reg ? reg.algorithms.find(a => a.slug === this.currentAlgo) : null;
    if (this.categoryBadge && reg) this.categoryBadge.textContent = reg.name;
    if (this.dropdownLabel && algoInfo) this.dropdownLabel.textContent = algoInfo.name;
    if (this.dropdownHeader && reg) this.dropdownHeader.textContent = reg.name;
    if (algoInfo && algoInfo.complexity) {
      const c = algoInfo.complexity;
      const s = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
      s('chip-best', 'Best: ' + c.best); s('chip-avg', 'Avg: ' + c.avg);
      s('chip-worst', 'Worst: ' + c.worst); s('chip-space', 'Space: ' + c.space);
    }
    this._loadAlgoData();
  }

  _loadAlgoData() {
    switch (this.currentAlgo) {
      case 'linear-search':
        this.code = ['int Linear_Search(int arr[], int n, int key) {','  for (int i = 0; i < n; i++) {','    if (arr[i] == key) {','      return i;','    }','  }','  return -1;','}'];
        this.originalArray = [64, 34, 25, 12, 22, 11, 90];
        this.searchTarget = 22;
        this.trace = this.generateLinearSearchTrace([...this.originalArray], this.searchTarget);
        if (this.fileNameEl) this.fileNameEl.textContent = 'Linear_Search.cpp';
        break;
      case 'binary-search':
        this.code = ['int Binary_Search(int arr[], int n, int key) {','  int low = 0, high = n - 1;','  while (low <= high) {','    int mid = (low + high) / 2;','    if (arr[mid] == key) return mid;','    else if (arr[mid] < key) low = mid + 1;','    else high = mid - 1;','  }','  return -1;','}'];
        this.originalArray = [11, 12, 22, 25, 34, 64, 90];
        this.searchTarget = 25;
        this.trace = this.generateBinarySearchTrace([...this.originalArray], this.searchTarget);
        if (this.fileNameEl) this.fileNameEl.textContent = 'Binary_Search.cpp';
        break;
      case 'selection-sort':
        this.code = ['void selectionSort(int arr[], int n) {','  for (int i = 0; i < n-1; i++) {','    int minIdx = i;','    for (int j = i+1; j < n; j++) {','      if (arr[j] < arr[minIdx])','        minIdx = j;','    }','    swap(arr[minIdx], arr[i]);','  }','}'];
        this.originalArray = [64, 34, 25, 12, 22, 11, 90];
        this.trace = this.generateSelectionSortTrace([...this.originalArray]);
        if (this.fileNameEl) this.fileNameEl.textContent = 'selection_sort.cpp';
        break;
      case 'insertion-sort':
        this.code = ['void insertionSort(int arr[], int n) {','  for (int i = 1; i < n; i++) {','    int key = arr[i];','    int j = i - 1;','    while (j >= 0 && arr[j] > key) {','      arr[j+1] = arr[j];','      j--;','    }','    arr[j+1] = key;','  }','}'];
        this.originalArray = [64, 34, 25, 12, 22, 11, 90];
        this.trace = this.generateInsertionSortTrace([...this.originalArray]);
        if (this.fileNameEl) this.fileNameEl.textContent = 'insertion_sort.cpp';
        break;
      default: // bubble-sort
        this.code = ['void bubbleSort(int arr[], int n) {','  for (int i = 0; i < n-1; i++) {','    for (int j = 0; j < n-i-1; j++) {','      if (arr[j] > arr[j+1]) {','        swap(arr[j], arr[j+1]);','      }','    }','  }','}'];
        this.originalArray = [64, 34, 25, 12, 22, 11, 90];
        this.trace = this.generateBubbleSortTrace([...this.originalArray]);
        if (this.fileNameEl) this.fileNameEl.textContent = 'bubble_sort.cpp';
        break;
    }
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
        trace.push({
          line: 3, action: 'compare', indices: [j, j + 1], array: [...arr],
          variables: { i: i, j: j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
          description: `Comparing arr[${j}] = <strong>${arr[j]}</strong> with arr[${j + 1}] = <strong>${arr[j + 1]}</strong>.`
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          trace.push({
            line: 4, action: 'swap', indices: [j, j + 1], array: [...arr],
            variables: { i: i, j: j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
            description: `Swapping arr[${j}] and arr[${j + 1}] → [${arr.join(', ')}]`
          });
        }
      }

      trace.push({
        line: 6, action: 'sorted', indices: [n - i - 1], array: [...arr],
        variables: { i: i },
        description: `Element at index ${n - i - 1} is now in its sorted position.`
      });
    }

    trace.push({
      line: 8, action: 'done', indices: [], array: [...arr],
      variables: {},
      description: 'Array is fully sorted!'
    });

    return trace;
  }

  generateLinearSearchTrace(arr, key) {
    const trace = [];
    const n = arr.length;
    trace.push({ line: 0, action: 'init', indices: [], array: [...arr], variables: { n, key }, description: `Starting Linear Search for key = <strong>${key}</strong>.` });
    for (let i = 0; i < n; i++) {
      trace.push({ line: 2, action: 'compare', indices: [i], array: [...arr], variables: { i, 'arr[i]': arr[i], key }, description: `Checking arr[${i}] = <strong>${arr[i]}</strong> against key = <strong>${key}</strong>.` });
      if (arr[i] === key) {
        trace.push({ line: 3, action: 'found', indices: [i], array: [...arr], variables: { i, 'arr[i]': arr[i], key }, description: `<strong>Found!</strong> Key ${key} is at index <strong>${i}</strong>.` });
        return trace;
      }
    }
    trace.push({ line: 6, action: 'not-found', indices: [], array: [...arr], variables: { key }, description: `Key <strong>${key}</strong> was <strong>not found</strong> in the array.` });
    return trace;
  }

  generateBinarySearchTrace(arr, key) {
    const trace = []; const n = arr.length;
    trace.push({ line: 0, action: 'init', indices: [], array: [...arr], variables: { n, key }, description: `Starting Binary Search for key = <strong>${key}</strong> in sorted array.` });
    let low = 0, high = n - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      trace.push({ line: 3, action: 'compare', indices: [mid], array: [...arr], variables: { low, high, mid, 'arr[mid]': arr[mid], key }, description: `Checking mid = ${mid}, arr[${mid}] = <strong>${arr[mid]}</strong> vs key = <strong>${key}</strong>.` });
      if (arr[mid] === key) {
        trace.push({ line: 4, action: 'found', indices: [mid], array: [...arr], variables: { mid, key }, description: `<strong>Found!</strong> Key ${key} at index <strong>${mid}</strong>.` });
        return trace;
      } else if (arr[mid] < key) {
        low = mid + 1;
        trace.push({ line: 5, action: 'loop-outer', indices: [], array: [...arr], variables: { low, high, key }, description: `arr[mid] < key → search right half. low = ${low}.` });
      } else {
        high = mid - 1;
        trace.push({ line: 6, action: 'loop-outer', indices: [], array: [...arr], variables: { low, high, key }, description: `arr[mid] > key → search left half. high = ${high}.` });
      }
    }
    trace.push({ line: 8, action: 'not-found', indices: [], array: [...arr], variables: { key }, description: `Key <strong>${key}</strong> was <strong>not found</strong>.` });
    return trace;
  }

  generateSelectionSortTrace(arr) {
    const trace = []; const n = arr.length;
    trace.push({ line: 0, action: 'init', indices: [], array: [...arr], variables: { n }, description: 'Starting Selection Sort.' });
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      trace.push({ line: 1, action: 'loop-outer', indices: [i], array: [...arr], variables: { i, minIdx }, description: `Pass ${i + 1}: finding minimum from index ${i}.` });
      for (let j = i + 1; j < n; j++) {
        trace.push({ line: 4, action: 'compare', indices: [j, minIdx], array: [...arr], variables: { i, j, minIdx, 'arr[j]': arr[j], 'arr[min]': arr[minIdx] }, description: `Comparing arr[${j}]=${arr[j]} with arr[${minIdx}]=${arr[minIdx]}.` });
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        trace.push({ line: 7, action: 'swap', indices: [i, minIdx], array: [...arr], variables: { i, minIdx }, description: `Swapping arr[${i}] and arr[${minIdx}] → [${arr.join(', ')}]` });
      }
      trace.push({ line: 8, action: 'sorted', indices: [i], array: [...arr], variables: { i }, description: `Index ${i} is now sorted.` });
    }
    trace.push({ line: 9, action: 'done', indices: [], array: [...arr], variables: {}, description: 'Array is fully sorted!' });
    return trace;
  }

  generateInsertionSortTrace(arr) {
    const trace = []; const n = arr.length;
    trace.push({ line: 0, action: 'init', indices: [], array: [...arr], variables: { n }, description: 'Starting Insertion Sort.' });
    for (let i = 1; i < n; i++) {
      const key = arr[i]; let j = i - 1;
      trace.push({ line: 2, action: 'compare', indices: [i], array: [...arr], variables: { i, key, j }, description: `Pick key = arr[${i}] = <strong>${key}</strong>.` });
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        trace.push({ line: 5, action: 'swap', indices: [j, j + 1], array: [...arr], variables: { j, 'arr[j]': arr[j], key }, description: `Shift arr[${j}] right → [${arr.join(', ')}]` });
        j--;
      }
      arr[j + 1] = key;
      trace.push({ line: 8, action: 'sorted', indices: [j + 1], array: [...arr], variables: { i, key, 'position': j + 1 }, description: `Insert key=${key} at index ${j + 1} → [${arr.join(', ')}]` });
    }
    trace.push({ line: 9, action: 'done', indices: [], array: [...arr], variables: {}, description: 'Array is fully sorted!' });
    return trace;
  }

  /* ── Dropdown ─────────────────────────────────────────────── */
  initDropdown() {
    if (!this.dropdownEl || typeof ALGO_REGISTRY === 'undefined') return;
    this.populateDropdown();
    this.dropdownTrigger.addEventListener('click', () => {
      const open = this.dropdownEl.classList.toggle('open');
      this.dropdownTrigger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', (e) => {
      if (!this.dropdownEl.contains(e.target)) this.dropdownEl.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.dropdownEl.classList.remove('open');
    });
  }

  populateDropdown() {
    const reg = ALGO_REGISTRY[this.currentCategory];
    if (!reg || !this.dropdownList) return;
    this.dropdownList.innerHTML = reg.algorithms.map(a => {
      const active = a.slug === this.currentAlgo ? ' active' : '';
      const badge = a.implemented ? '<span class="algo-dropdown-item-badge implemented">Ready</span>' : '<span class="algo-dropdown-item-badge coming-soon">Soon</span>';
      return `<button class="algo-dropdown-item${active}" data-slug="${a.slug}" role="option"><span class="algo-dropdown-item-name">${a.name}</span>${badge}</button>`;
    }).join('');
    this.dropdownList.querySelectorAll('.algo-dropdown-item').forEach(btn => {
      btn.addEventListener('click', () => this.switchAlgorithm(btn.dataset.slug));
    });
  }

  switchAlgorithm(slug) {
    this.dropdownEl.classList.remove('open');
    if (slug === this.currentAlgo) return;
    this.currentAlgo = slug;
    this.pause();
    this.currentStep = -1;
    this.loadAlgorithm();
    this.populateDropdown();
    this.canvas.innerHTML = '';
    this.renderCode();
    this.renderBars();
    this.updateStepCounter();
    this.updateVariables({});
    this.updateDescription('Press <strong>Play</strong> to start, or use <strong>Step</strong>.');
    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.codeBody) this.codeBody.querySelectorAll('.viz-code-line').forEach(l => l.classList.remove('active'));
    const url = new URL(window.location);
    url.searchParams.set('algo', slug);
    window.history.replaceState({}, '', url);
  }

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
      if (line[i] === '/' && line[i + 1] === '/') {
        tokens.push('<span class="syn-comment">' + this.esc(line.slice(i)) + '</span>');
        break;
      }
      if (line[i] === '"' || line[i] === "'") {
        const q = line[i];
        let str = q;
        i++;
        while (i < line.length && line[i] !== q) { str += line[i]; i++; }
        if (i < line.length) { str += line[i]; i++; }
        tokens.push('<span class="syn-string">' + this.esc(str) + '</span>');
        continue;
      }
      if (/[a-zA-Z_]/.test(line[i])) {
        let word = '';
        while (i < line.length && /[a-zA-Z_0-9]/.test(line[i])) { word += line[i]; i++; }
        if (KEYWORDS.has(word)) tokens.push('<span class="syn-keyword">' + word + '</span>');
        else if (FUNCTIONS.has(word)) tokens.push('<span class="syn-function">' + word + '</span>');
        else tokens.push(word);
        continue;
      }
      if (/[0-9]/.test(line[i])) {
        let num = '';
        while (i < line.length && /[0-9.]/.test(line[i])) { num += line[i]; i++; }
        tokens.push('<span class="syn-number">' + num + '</span>');
        continue;
      }
      if ('<>=!&|+-*/%^~'.includes(line[i])) {
        let op = '';
        while (i < line.length && '<>=!&|+-*/%^~'.includes(line[i])) { op += line[i]; i++; }
        tokens.push('<span class="syn-operator">' + this.esc(op) + '</span>');
        continue;
      }
      if ('()[]{}'.includes(line[i])) {
        tokens.push('<span class="syn-bracket">' + this.esc(line[i]) + '</span>');
        i++;
        continue;
      }
      tokens.push(this.esc(line[i]));
      i++;
    }
    return tokens.join('');
  }

  esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  renderBars(array, highlights = {}) {
    if (!this.canvas) return;
    const arr = array || this.originalArray;
    const bars = this.canvas.querySelectorAll('.array-bar');

    if (bars.length !== arr.length) {
      this._buildBarsDOM(arr, highlights);
      return;
    }

    this._updateBarsInPlace(arr, highlights);
  }

  _barHeight(val, maxVal) {
    return Math.max(20, (val / maxVal) * 280);
  }

  _stateClasses(i, highlights) {
    const classes = [];
    if (highlights.comparing?.includes(i)) classes.push('comparing');
    if (highlights.swapping?.includes(i)) classes.push('swapping');
    if (highlights.sorted?.includes(i)) classes.push('sorted');
    if (highlights.active?.includes(i)) classes.push('active');
    if (highlights.found?.includes(i)) classes.push('sorted');
    return classes;
  }

  _buildBarsDOM(arr, highlights) {
    const maxVal = Math.max(...arr);
    this.canvas.innerHTML = arr.map((val, i) => {
      const height = this._barHeight(val, maxVal);
      const stateClass = this._stateClasses(i, highlights).join(' ');
      return `<div class="array-bar ${stateClass}" data-index="${i}">
        <span class="array-bar-value">${val}</span>
        <div class="array-bar-rect" style="height: ${height}px;"></div>
        <span class="array-bar-index">${i}</span>
      </div>`;
    }).join('');
  }

  _updateBarsInPlace(arr, highlights) {
    const maxVal = Math.max(...arr);
    const bars = this.canvas.querySelectorAll('.array-bar');

    arr.forEach((val, i) => {
      const bar = bars[i];
      if (!bar) return;
      const rect = bar.querySelector('.array-bar-rect');
      const valueEl = bar.querySelector('.array-bar-value');
      const height = this._barHeight(val, maxVal);

      if (rect) rect.style.height = `${height}px`;
      if (valueEl) valueEl.textContent = val;

      bar.classList.remove('comparing', 'swapping', 'sorted', 'active', 'pulse-compare', 'pulse-swap');
      this._stateClasses(i, highlights).forEach((c) => bar.classList.add(c));

      if (highlights.swapping?.includes(i)) {
        bar.classList.add('pulse-swap');
        bar.addEventListener('animationend', () => bar.classList.remove('pulse-swap'), { once: true });
      } else if (highlights.comparing?.includes(i)) {
        bar.classList.add('pulse-compare');
        bar.addEventListener('animationend', () => bar.classList.remove('pulse-compare'), { once: true });
      }
    });
  }

  goToStep(stepIndex, options = {}) {
    const { playSound = true, forward = true } = options;
    if (stepIndex < 0 || stepIndex >= this.trace.length) return;

    this.currentStep = stepIndex;
    const step = this.trace[stepIndex];

    const sortedIndices = new Set();
    for (let s = 0; s <= stepIndex; s++) {
      if (this.trace[s].action === 'sorted') {
        this.trace[s].indices.forEach((idx) => sortedIndices.add(idx));
      }
    }
    if (step.action === 'done') {
      step.array.forEach((_, i) => sortedIndices.add(i));
    }

    const highlights = { sorted: [...sortedIndices] };
    if (step.action === 'compare') highlights.comparing = step.indices;
    if (step.action === 'swap') highlights.swapping = step.indices;
    if (step.action === 'found') highlights.found = step.indices;

    this.renderBars(step.array, highlights);
    this.highlightLine(step.line);
    this.updateVariables(step.variables);
    this.updateDescription(step.description);
    this.updateProgress();
    this.updateStepCounter();

    if (playSound && forward && step.action !== 'init') {
      this.unlockAudio();
      this.audio.playForAction(step.action);
    }
  }

  highlightLine(lineIndex) {
    if (!this.codeBody) return;
    const lines = this.codeBody.querySelectorAll('.viz-code-line');
    lines.forEach((l) => l.classList.remove('active'));
    if (lines[lineIndex]) {
      lines[lineIndex].classList.add('active');
      lines[lineIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  updateVariables(vars) {
    if (!this.varsGrid) return;
    if (!vars || Object.keys(vars).length === 0) {
      this.varsGrid.innerHTML = '<span class="viz-var-empty">No variables in scope</span>';
      return;
    }
    this.varsGrid.innerHTML = Object.entries(vars).map(([name, val]) =>
      `<div class="viz-var viz-var-enter">
        <span class="viz-var-name">${name}</span>
        <span class="viz-var-eq">=</span>
        <span class="viz-var-val">${val}</span>
      </div>`
    ).join('');
  }

  updateDescription(desc) {
    if (!this.stepText) return;
    if (this.stepDescription) this.stepDescription.classList.remove('step-updated');
    this.stepText.innerHTML = desc;
    if (this.stepDescription) {
      requestAnimationFrame(() => this.stepDescription.classList.add('step-updated'));
    }
  }

  updateProgress() {
    if (!this.progressBar) return;
    const pct = this.trace.length > 1 ? (this.currentStep / (this.trace.length - 1)) * 100 : 0;
    this.progressBar.style.width = pct + '%';
  }

  updateStepCounter() {
    if (this.stepCounter) {
      const n = Math.max(0, this.currentStep + 1);
      this.stepCounter.textContent = `Step ${n} / ${this.trace.length}`;
    }
  }

  play() {
    this.unlockAudio();
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
    this.unlockAudio();
    if (this.isPlaying) this.pause();
    else this.play();
  }

  tick() {
    if (!this.isPlaying) return;
    if (this.currentStep >= this.trace.length - 1) {
      this.pause();
      return;
    }
    this.goToStep(this.currentStep + 1, { playSound: true, forward: true });
    const delay = Math.max(120, 550 / this.speed);
    this.playTimer = setTimeout(() => this.tick(), delay);
  }

  stepForward() {
    this.pause();
    this.unlockAudio();
    if (this.currentStep < this.trace.length - 1) {
      this.goToStep(this.currentStep + 1, { playSound: true, forward: true });
    }
  }

  stepBackward() {
    this.pause();
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1, { playSound: false, forward: false });
    }
  }

  reset() {
    this.pause();
    this.currentStep = -1;
    this.canvas.innerHTML = '';
    this.renderBars();
    if (this.codeBody) {
      this.codeBody.querySelectorAll('.viz-code-line').forEach((l) => l.classList.remove('active'));
    }
    this.updateVariables({});
    this.updateDescription('Press <strong>Play</strong> to start the visualization, or use <strong>Step</strong> to advance one operation at a time.');
    if (this.progressBar) this.progressBar.style.width = '0%';
    this.updateStepCounter();
  }

  randomize() {
    this.pause();
    this.unlockAudio();
    this.originalArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    const isSearch = ['linear-search','binary-search'].includes(this.currentAlgo);
    if (isSearch) {
      this.searchTarget = this.originalArray[Math.floor(Math.random() * this.originalArray.length)];
      if (this.currentAlgo === 'binary-search') this.originalArray.sort((a,b) => a - b);
    }
    this._loadAlgoData();
    this.currentStep = -1;
    this.canvas.innerHTML = '';
    this.renderBars();
    this.updateStepCounter();
    this.updateDescription('Array randomized! Press <strong>Play</strong> to start.');
    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.codeBody) {
      this.codeBody.querySelectorAll('.viz-code-line').forEach((l) => l.classList.remove('active'));
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
    const playBtn = document.getElementById('viz-play');
    if (playBtn) playBtn.classList.toggle('is-playing', this.isPlaying);
  }

  toggleSound() {
    this.unlockAudio();
    this.audio.setEnabled(!this.audio.enabled);
    this.updateSoundToggleUI();
    if (this.audio.enabled) this.audio.compare();
  }

  updateSoundToggleUI() {
    if (!this.soundToggle) return;
    const on = this.audio.enabled;
    this.soundToggle.classList.toggle('muted', !on);
    this.soundToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    const onIcon = this.soundToggle.querySelector('.viz-sound-on');
    const offIcon = this.soundToggle.querySelector('.viz-sound-off');
    if (onIcon) onIcon.hidden = !on;
    if (offIcon) offIcon.hidden = on;
  }

  bindControls() {
    const btn = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => {
        this.unlockAudio();
        fn.call(this);
      });
    };

    btn('viz-play', this.togglePlay);
    btn('viz-reset', this.reset);
    btn('viz-step-fwd', this.stepForward);
    btn('viz-step-back', this.stepBackward);
    btn('viz-randomize', this.randomize);

    if (this.soundToggle) {
      this.soundToggle.addEventListener('click', () => this.toggleSound());
    }

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
        case 'm':
        case 'M':
          e.preventDefault();
          this.toggleSound();
          break;
      }
    });
  }
}
