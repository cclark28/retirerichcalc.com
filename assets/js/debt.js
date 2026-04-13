/* ============================================================
   RetireRichCalc — debt.js
   "Debt Freedom Calculator"
   ============================================================ */
'use strict';

(function () {

  function get(id) { return document.getElementById(id); }

  function calcDebt(totalDebt, monthlyPayment, annualRate) {
    if (monthlyPayment <= 0 || totalDebt <= 0) return null;

    const r = annualRate / 100 / 12;  // monthly rate

    // Check if payment covers interest
    const minPayment = totalDebt * r;
    if (monthlyPayment <= minPayment && r > 0) {
      return { impossible: true };
    }

    let months;
    if (r < 0.000001) {
      months = totalDebt / monthlyPayment;
    } else {
      // n = -ln(1 - r*P/M) / ln(1+r)
      months = -Math.log(1 - (r * totalDebt) / monthlyPayment) / Math.log(1 + r);
    }

    if (!isFinite(months) || months < 0) return null;

    const totalPaid    = monthlyPayment * months;
    const totalInterest = totalPaid - totalDebt;
    return { months, years: months / 12, totalPaid, totalInterest };
  }

  let prevMonths = 0;

  function render() {
    const totalDebt      = parseFloat(get('totalDebt').value);
    const monthlyPayment = parseFloat(get('monthlyPayment').value);
    const annualRate     = parseFloat(get('annualRate').value);

    get('dTotalDebt').textContent      = RRC.formatCurrency(totalDebt);
    get('dMonthlyPayment').textContent = RRC.formatCurrency(monthlyPayment) + '/mo';
    get('dAnnualRate').textContent     = RRC.formatPercent(annualRate);

    const result = calcDebt(totalDebt, monthlyPayment, annualRate);

    if (!result) {
      get('rMonths').textContent      = '—';
      get('rSub').textContent         = 'Enter your debt details';
      get('rTotalPaid').textContent   = '—';
      get('rInterest').textContent    = '—';
      get('rSavings').textContent     = '—';
      get('rBar').style.width         = '5%';
      return;
    }

    if (result.impossible) {
      get('rMonths').textContent      = 'Payment too low';
      get('rSub').textContent         = 'Your payment doesn\'t cover the monthly interest';
      get('rTotalPaid').textContent   = '—';
      get('rInterest').textContent    = '—';
      get('rSavings').textContent     = '—';
      get('rBar').style.width         = '5%';
      prevMonths = 0;
      return;
    }

    RRC.animateNumber(get('rMonths'), prevMonths, result.months, 500,
      v => v < 1 ? 'Less than a month!' : RRC.formatYears(v / 12));
    prevMonths = result.months;

    get('rSub').textContent = `debt-free at this payment rate`;

    get('rTotalPaid').textContent = RRC.formatCurrency(result.totalPaid);

    const interestEl = get('rInterest');
    interestEl.textContent = RRC.formatCurrency(result.totalInterest);

    // Savings vs interest
    const savingsEl = get('rSavings');
    savingsEl.textContent = `${RRC.formatPercent((totalDebt / result.totalPaid) * 100)} goes to principal`;

    // Bar: principal fraction of total paid
    const principalPct = (totalDebt / Math.max(result.totalPaid, 1)) * 100;
    get('rBar').style.width = Math.max(5, Math.min(95, principalPct)) + '%';
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="range"]').forEach(s => s.addEventListener('input', render));
    render();
  });

  window.shareDebt = function () {
    const years = get('rMonths').textContent;
    RRC.shareResult(
      'RetireRichCalc — Debt Freedom Calculator',
      `I'll be debt-free in ${years}! Calculate your debt payoff date at RetireRichCalc.com`
    );
  };

}());
