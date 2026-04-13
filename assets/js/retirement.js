/* ============================================================
   RetireRichCalc — retirement.js
   "How Much Do I Need to Retire?" calculator
   Uses the 4% safe-withdrawal rule (25× annual expenses)
   + calculates required monthly savings to close the gap.
   ============================================================ */
'use strict';

(function () {

  function get(id) { return document.getElementById(id); }

  /* ── Math ── */
  function calcRetirement(monthlyExpenses, currentAge, retirementAge, annualReturn, currentSavings) {
    const annualExpenses = monthlyExpenses * 12;

    // Required nest egg — 25× annual expenses (4% rule)
    const required = annualExpenses * 25;

    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const gap = Math.max(0, required - currentSavings);

    // What will current savings grow to at retirement?
    const r_monthly = annualReturn / 100 / 12;
    const n_months  = yearsToRetirement * 12;
    let savingsAtRetirement;
    if (r_monthly < 0.000001) {
      savingsAtRetirement = currentSavings;
    } else {
      savingsAtRetirement = currentSavings * Math.pow(1 + r_monthly, n_months);
    }

    const remainingGap = Math.max(0, required - savingsAtRetirement);

    // Monthly savings needed to close remaining gap
    let monthlySavingsNeeded = 0;
    if (remainingGap > 0 && n_months > 0) {
      if (r_monthly < 0.000001) {
        monthlySavingsNeeded = remainingGap / n_months;
      } else {
        // PMT = FV * r / ((1+r)^n - 1)
        monthlySavingsNeeded = remainingGap * r_monthly / (Math.pow(1 + r_monthly, n_months) - 1);
      }
    }

    return { required, gap, yearsToRetirement, savingsAtRetirement, remainingGap, monthlySavingsNeeded };
  }

  let prevRequired = 0;

  function render() {
    const monthlyExpenses = parseFloat(get('monthlyExpenses').value);
    const currentAge      = parseFloat(get('currentAge').value);
    const retirementAge   = parseFloat(get('retirementAge').value);
    const annualReturn    = parseFloat(get('annualReturn').value);
    const currentSavings  = parseFloat(get('currentSavings').value);

    // Display labels
    get('dMonthlyExpenses').textContent = RRC.formatCurrency(monthlyExpenses) + '/mo';
    get('dCurrentAge').textContent      = currentAge + ' yrs';
    get('dRetirementAge').textContent   = retirementAge + ' yrs';
    get('dAnnualReturn').textContent    = RRC.formatPercent(annualReturn);
    get('dCurrentSavings').textContent  = RRC.formatCurrency(currentSavings);

    const result = calcRetirement(monthlyExpenses, currentAge, retirementAge, annualReturn, currentSavings);

    // Animate main number
    RRC.animateNumber(get('rRequired'), prevRequired, result.required, 500, RRC.formatCurrency.bind(RRC));
    prevRequired = result.required;

    get('rSub').textContent = `to retire at ${retirementAge} (4% withdrawal rule)`;

    get('rCurrentSavings').textContent   = RRC.formatCurrency(currentSavings);
    get('rYearsToRetire').textContent    = result.yearsToRetirement + ' years';
    get('rGapAmount').textContent        = RRC.formatCurrency(result.remainingGap);
    get('rMonthlySavings').textContent   = result.monthlySavingsNeeded > 0
      ? RRC.formatCurrency(result.monthlySavingsNeeded) + '/mo'
      : 'On track!';

    // Bar: current savings vs required
    const savedPct = Math.min(95, (currentSavings / Math.max(result.required, 1)) * 100);
    get('rBar').style.width = Math.max(4, savedPct) + '%';

    // Color the gap green if on track
    const gapEl = get('rGapAmount');
    if (result.remainingGap === 0) {
      gapEl.textContent = 'On track!';
      gapEl.className = 'stat-value green';
    } else {
      gapEl.className = 'stat-value accent';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="range"]').forEach(s => s.addEventListener('input', render));
    render();
  });

  window.shareRetirement = function () {
    const required = parseFloat(get('rRequired').textContent.replace(/[^0-9.]/g, '')) || 0;
    const age = get('retirementAge').value;
    RRC.shareResult(
      'RetireRichCalc — Retirement Calculator',
      `I need ${RRC.formatCurrency(required)} to retire at ${age}. What's your number?`
    );
  };

}());
