/* Step sounds via Web Audio — unlocks on first user gesture (autoplay policy). */
class StepAudioEngine {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.master = null;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) this.enabled = false;
    motion.addEventListener?.('change', (e) => {
      if (e.matches) this.enabled = false;
    });
  }

  unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.32;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  setEnabled(on) {
    this.enabled = on;
    if (on) this.unlock();
  }

  _tone(freq, duration, delay = 0, type = 'sine', vol = 0.35) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + duration + 0.03);
  }

  compare() {
    this._tone(540, 0.07, 0, 'sine', 0.32);
  }

  swap() {
    this._tone(400, 0.06, 0, 'square', 0.26);
    this._tone(400, 0.06, 0.11, 'square', 0.26);
  }

  sorted() {
    this._tone(587, 0.09, 0, 'sine', 0.28);
    this._tone(740, 0.11, 0.1, 'sine', 0.24);
  }

  done() {
    [523, 659, 784].forEach((f, i) => this._tone(f, 0.1, i * 0.13, 'sine', 0.22));
  }

  loopPass() {
    this._tone(280, 0.04, 0, 'sine', 0.14);
  }

  playForAction(action) {
    if (!this.enabled) return;
    switch (action) {
      case 'compare': this.compare(); break;
      case 'swap': this.swap(); break;
      case 'sorted': this.sorted(); break;
      case 'done': this.done(); break;
      case 'loop-outer': this.loopPass(); break;
      default: break;
    }
  }
}
