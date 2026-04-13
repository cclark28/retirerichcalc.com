/* ============================================================
   RetireRichCalc — millionaire.js
   "When Will I Be a Millionaire?" calculator
   ============================================================ */
'use strict';

(function () {

  /* ── DOM refs ── */
  const ids = {
    startSavings:    'startSavings',
    monthlyContrib:  'monthlyContrib',
    annualReturn:    'annualReturn',
    targetAmount:    'targetAmount',
    currentAge:      'currentAge',
    // displays
    dStartSavings:   'dStartSavings',
    dMonthlyContrib: 'dMonthlyContrib',
    dAnnualReturn:   'dAnnualReturn',
    dTargetAmount:   'dTargetAmount',
    dCurrentAge:     'dCurrentAge',
    // results
    rYears:          'rYears',
    rAge:            'rAge',
    rContribs:       'rContribs',
    rGrowth:         'rGrowth',
    rBar:            'rBar',
    rEyebrow:        'rEyebrow',
  };

  function get(id) { return document.getElementById(id); }

  /* ── Math ── */
  function calcMillionaire(startSavings, monthlyContrib, annualReturn, target, currentAge) {
    const r = annualReturn / 100 / 12;  // monthly rate

    // Already there?
    if (startSavings >= target) {
      return { years: 0, totalContribs: startSavings, totalGrowth: target - startSavings, reachAge: currentAge };
    }

    let months;
    if (r < 0.000001) {
      // 0% return — linear
      if (monthlyContrib <= 0) return null;
      months = (target - startSavings) / monthlyContrib;
    } else {
      // FV = (PV + PMT/r) * (1+r)^n - PMT/r
      // n = ln((FV + PMT/r) / (PV + PMT/r)) / ln(1+r)
      const pmtOverR = monthlyContrib / r;
      const num = target + pmtOverR;
      const den = startSavings + pmtOverR;
      if (den <= 0 || num / den <= 0) return null;
      months = Math.log(num / den) / Math.log(1 + r);
    }

    if (!isFinite(months) || months < 0) return null;
    if (months > 1200) return { years: Infinity };  // >100 years

    const years = months / 12;
    const totalContribs = startSavings + monthlyContrib * months;
    const totalGrowth   = target - totalContribs;
    const reachAge      = currentAge + years;
    return { years, totalContribs, totalGrowth, reachAge };
  }

  /* ── Render ── */
  let prevYears = 0;

  function render() {
    const startSavings   = parseFloat(get(ids.startSavings).value);
    const monthlyContrib = parseFloat(get(ids.monthlyContrib).value);
    const annualReturn   = parseFloat(get(ids.annualReturn).value);
    const target         = parseFloat(get(ids.targetAmount).value);
    const currentAge     = parseFloat(get(ids.currentAge).value);

    // Update labels
    get(ids.dStartSavings).textContent   = RRC.formatCurrency(startSavings);
    get(ids.dMonthlyContrib).textContent = RRC.formatCurrency(monthlyContrib) + '/mo';
    get(ids.dAnnualReturn).textContent   = RRC.formatPercent(annualReturn);
    get(ids.dTargetAmount).textContent   = RRC.formatCurrency(target);
    get(ids.dCurrentAge).textContent     = currentAge + ' yrs';

    // Update eyebrow
    get(ids.rEyebrow).textContent = `You'll reach ${RRC.formatCurrency(target)} in`;

    const result = calcMillionaire(startSavings, monthlyContrib, annualReturn, target, currentAge);

    if (!result) {
      get(ids.rYears).textContent   = 'Increase contributions';
      get(ids.rAge).textContent     = 'Try a higher monthly savings amount';
      get(ids.rContribs).textContent = '—';
      get(ids.rGrowth).textContent  = '—';
      get(ids.rBar).style.width     = '50%';
      prevYears = 0;
      return;
    }

    if (!isFinite(result.years)) {
      get(ids.rYears).textContent   = '> 100 years';
      get(ids.rAge).textContent     = 'Increase contributions or return';
      get(ids.rContribs).textContent = '—';
      get(ids.rGrowth).textContent  = '—';
      get(ids.rBar).style.width     = '10%';
      prevYears = 0;
      return;
    }

    // Animate the main number
    RRC.animateNumber(get(ids.rYears), prevYears, result.years, 500,
      v => v < 0.08 ? 'You\'re already there!' : RRC.formatYears(v));
    prevYears = result.years;

    if (result.years < 0.08) {
      get(ids.rAge).textContent = 'Congratulations!';
    } else {
      get(ids.rAge).textContent = `at age ${RRC.formatAge(result.reachAge)}`;
    }

    get(ids.rContribs).textContent = RRC.formatCurrency(Math.max(0, result.totalContribs));

    const growth = target - Math.max(0, result.totalContribs);
    get(ids.rGrowth).textContent   = RRC.formatCurrency(Math.max(0, growth));

    // Progress bar: % of final value that is growth
    const growthPct = target > 0 ? Math.max(5, Math.min(95, (Math.max(0, growth) / target) * 100)) : 50;
    get(ids.rBar).style.width = growthPct + '%';
  }

  /* ── Wire up sliders ── */
  function wireSlider(inputId, displayFn) {
    const el = get(inputId);
    if (!el) return;
    el.addEventListener('input', render);
  }

  document.addEventListener('DOMContentLoaded', () => {
    Object.keys(ids).filter(k => k.startsWith('d') === false && k.startsWith('r') === false)
      .forEach(k => wireSlider(ids[k]));
    render();
  });

  /* ── Share ── */
  window.shareMillionaire = function () {
    const result = calcMillionaire(
      parseFloat(get(ids.startSavings).value),
      parseFloat(get(ids.monthlyContrib).value),
      parseFloat(get(ids.annualReturn).value),
      parseFloat(get(ids.targetAmount).value),
      parseFloat(get(ids.currentAge).value)
    );
    if (!result || !isFinite(result.years)) {
      RRC.shareResult('RetireRichCalc', 'Check out this free retirement calculator!');
      return;
    }
    const target = parseFloat(get(ids.targetAmount).value);
    const msg = result.years < 0.1
      ? `I'm already a millionaire! Check your number at RetireRichCalc.com`
      : `I'll reach ${RRC.formatCurrency(target)} in ${RRC.formatYears(result.years)} (at age ${RRC.formatAge(result.reachAge)})!`;
    RRC.shareResult('RetireRichCalc — Millionaire Calculator', msg);
  };

}());
