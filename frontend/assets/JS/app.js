/* ============================================================
   DSA Visualizer — Landing Page Controller
   Scroll animations, counters, hero effects, category cards.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initHeroCode();
  initHeroBars();
  initCounters();
  initCategoryCards();
  initFooterYear();
});

/* ── Navbar ───────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('nav-mobile');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile toggle
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobile.classList.toggle('active');
    });

    // Close mobile menu on link click
    mobile.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobile.classList.remove('active');
      });
    });
  }
}

/* ── Scroll Animations (IntersectionObserver) ─────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ── Hero Code Card ───────────────────────────────────────── */
function initHeroCode() {
  const body = document.getElementById('hero-code-body');
  if (!body) return;

  const codeLines = [
    { num: 1,  content: '<span class="code-keyword">void</span> <span class="code-function">bubbleSort</span>(<span class="code-type">int</span> arr[], <span class="code-type">int</span> n) {' },
    { num: 2,  content: '  <span class="code-keyword">for</span> (<span class="code-type">int</span> i = <span class="code-number">0</span>; i < n-<span class="code-number">1</span>; i++) {' },
    { num: 3,  content: '    <span class="code-keyword">for</span> (<span class="code-type">int</span> j = <span class="code-number">0</span>; j < n-i-<span class="code-number">1</span>; j++) {' },
    { num: 4,  content: '      <span class="code-keyword">if</span> (arr[j] <span class="code-operator">></span> arr[j+<span class="code-number">1</span>]) {' },
    { num: 5,  content: '        <span class="code-function">swap</span>(arr[j], arr[j+<span class="code-number">1</span>]);' },
    { num: 6,  content: '      }' },
    { num: 7,  content: '    }' },
    { num: 8,  content: '  }' },
    { num: 9,  content: '}' },
  ];

  body.innerHTML = codeLines.map(line =>
    `<div class="code-line" data-line="${line.num}">
      <span class="code-line-number">${line.num}</span>
      <span class="code-line-content">${line.content}</span>
    </div>`
  ).join('');

  // Animate line highlighting
  let currentLine = 0;
  const lines = body.querySelectorAll('.code-line');

  setInterval(() => {
    lines.forEach(l => l.classList.remove('active'));
    lines[currentLine].classList.add('active');
    currentLine = (currentLine + 1) % lines.length;
  }, 1200);
}

/* ── Hero Animated Bars ───────────────────────────────────── */
function initHeroBars() {
  const container = document.getElementById('hero-bars');
  if (!container) return;

  const values = [35, 65, 25, 80, 50, 45, 70];
  const colors = [
    'var(--color-accent)',
    'var(--color-secondary)',
    'var(--color-accent-light)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-accent-dark)',
    'var(--color-secondary)',
  ];

  container.innerHTML = values.map((v, i) =>
    `<div class="viz-bar" style="height: ${v}px; background: ${colors[i]}; animation: barGrow 0.5s var(--ease-spring) ${i * 0.08}s both;"></div>`
  ).join('');

  // Animate bar heights randomly
  setInterval(() => {
    const bars = container.querySelectorAll('.viz-bar');
    bars.forEach(bar => {
      const newHeight = 20 + Math.random() * 65;
      bar.style.height = newHeight + 'px';
    });
  }, 2000);
}

/* ── Animated Counters ────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * target);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ── Category Cards ───────────────────────────────────────── */
function initCategoryCards() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  const categories = [
    { name: 'Arrays', icon: '⊞', desc: 'Linear data storage with indexed access', count: 'Core', color: '#06b6d4' },
    { name: 'Linked Lists', icon: '⟶', desc: 'Sequential nodes connected by pointers', count: 'Core', color: '#818cf8' },
    { name: 'Stacks', icon: '⊡', desc: 'Last-In-First-Out data structure', count: 'Core', color: '#34d399' },
    { name: 'Queues', icon: '⊟', desc: 'First-In-First-Out data structure', count: 'Core', color: '#fbbf24' },
    { name: 'Trees', icon: '⊻', desc: 'Hierarchical node-based structures', count: 'Advanced', color: '#f87171' },
    { name: 'Graphs', icon: '◈', desc: 'Vertices and edges for complex relations', count: 'Advanced', color: '#a78bfa' },
    { name: 'Sorting', icon: '⇅', desc: 'Arrange elements in specific order', count: '6+ algos', color: '#06b6d4' },
    { name: 'Searching', icon: '⊕', desc: 'Find elements efficiently', count: '2+ algos', color: '#22d3ee' },
    { name: 'Recursion', icon: '∞', desc: 'Self-referencing algorithmic patterns', count: 'Paradigm', color: '#818cf8' },
    { name: 'Dynamic Programming', icon: '⊞', desc: 'Optimal substructure & memoization', count: 'Paradigm', color: '#34d399' },
    { name: 'Greedy', icon: '✦', desc: 'Locally optimal choices for global solutions', count: 'Paradigm', color: '#fbbf24' },
  ];

  grid.innerHTML = categories.map((cat, i) =>
    `<div class="card category-card animate-on-scroll stagger-${(i % 8) + 1}" id="cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}"
          onclick="window.location.href='visualizer.html?cat=${cat.name.toLowerCase().replace(/\s+/g, '-')}'">
      <div class="card-icon" style="background: ${cat.color}15; color: ${cat.color};">
        <span style="font-size: 1.4rem;">${cat.icon}</span>
      </div>
      <h3 class="card-title">${cat.name}</h3>
      <p class="card-description">${cat.desc}</p>
      <span class="algo-count">${cat.count}</span>
    </div>`
  ).join('');

  // Re-observe new elements
  initScrollAnimations();
}

/* ── Footer Year ──────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
