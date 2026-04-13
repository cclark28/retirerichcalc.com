/* ============================================================
   RetireRichCalc — shared.js
   Utility functions used across all calculator pages
   ============================================================ */
'use strict';

const RRC = {

  /* ── Formatting ── */

  formatCurrency(n) {
    if (!isFinite(n)) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(Math.round(n));
  },

  formatYears(years) {
    if (!isFinite(years) || years < 0) return '—';
    const y = Math.floor(years);
    const m = Math.round((years - y) * 12);
    if (m === 12) return `${y + 1} year${y + 1 !== 1 ? 's' : ''}`;
    if (m === 0 && y === 0) return 'Less than a month';
    if (y === 0) return `${m} month${m !== 1 ? 's' : ''}`;
    if (m === 0) return `${y} year${y !== 1 ? 's' : ''}`;
    return `${y} yr${y !== 1 ? 's' : ''}, ${m} mo`;
  },

  formatAge(n) {
    if (!isFinite(n)) return '—';
    return Math.round(n).toString();
  },

  formatPercent(n, dec = 1) {
    if (!isFinite(n)) return '—';
    return n.toFixed(dec) + '%';
  },

  /* ── Slider fill ── */

  updateSliderFill(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = parseFloat(slider.value);
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background =
      `linear-gradient(to right, #1B3A6B 0%, #2E6DA4 ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`;
  },

  /* ── Share ── */

  shareResult(title, body) {
    const url = window.location.href.split('?')[0];
    const text = `${body}\n\nCalculate yours free → ${url}`;
    if (navigator.share) {
      navigator.share({ title, text, url })
        .catch(() => this._copy(text));
    } else {
      this._copy(text);
    }
  },

  _copy(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => this.toast('Copied to clipboard!'))
        .catch(() => this._fallbackCopy(text));
    } else {
      this._fallbackCopy(text);
    }
  },

  _fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    Object.assign(ta.style, { position: 'fixed', opacity: '0', top: '0', left: '0' });
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    this.toast('Copied to clipboard!');
  },

  toast(msg) {
    let el = document.getElementById('rrc-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'rrc-toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  },

  /* ── Animate number ── */

  animateNumber(el, from, to, duration = 550, formatter) {
    if (!el || from === to) {
      if (el && formatter) el.textContent = formatter(to);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const cur = from + (to - from) * ease;
      el.textContent = formatter ? formatter(cur) : Math.round(cur).toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },

  /* ── Init ── */

  initSliders() {
    document.querySelectorAll('input[type="range"]').forEach(s => {
      this.updateSliderFill(s);
      s.addEventListener('input', () => this.updateSliderFill(s));
    });
  },

  initNav() {
    const btn = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

};

document.addEventListener('DOMContentLoaded', () => {
  RRC.initNav();
  RRC.initSliders();
});
