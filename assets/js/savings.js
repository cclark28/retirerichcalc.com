/* ============================================================
   RetireRichCalc — savings.js
   "Savings Rate Calculator"
   FI timeline based on Mr. Money Mustache's savings rate research.
   ============================================================ */
'use strict';

(function () {

  function get(id) { return document.getElementById(id); }

  // Years to FI given savings rate and assumed 5% real return
  function yearsToFI(savingsRate, realReturn) {
    if (savingsRate <= 0) return Infinity;
    if (savingsRate >= 1) return 0;

    const spendingRate = 1 - savingsRate;
    const r = realReturn / 100;

    // Nest egg needed = 25 × annual spending
    // Annual savings = income × savingsRate
    // Annual spending = income × spendingRate
    // Nest egg = annual spending × 25 = income × spendingRate × 25
    // Years = ln(1 + (nestEgg × r / annualSavings)) / ln(1+r)
    //       = ln(1 + 25 × spendingRate × r / savingsRate) / ln(1+r)

    if (r < 0.0001) {
      return spendingRate * 25 / savingsRate;
    }

    const inside = 1 + 25 * spendingRate * r / savingsRate;
    if (inside <= 0) return Infinity;

    return Math.log(inside) / Math.log(1 + r);
  }

  let prevRate = 0;

  function render() {
    const income   = parseFloat(get('monthlyIncome').value);
    const spending = parseFloat(get('monthlySpending').value);

    get('dMonthlyIncome').textContent   = RRC.formatCurrency(income) + '/mo';
    get('dMonthlySpending').textContent = RRC.formatCurrency(spending) + '/mo';

    const monthlySavings = Math.max(0, income - spending);
    const rate = income > 0 ? monthlySavings / income : 0;
    const ratePct = rate * 100;

    // Animate savings rate
    RRC.animateNumber(get('rRate'), prevRate, ratePct, 400,
      v => RRC.formatPercent(Math.max(0, v)));
    prevRate = ratePct;

    get('rMonthlySavings').textContent = RRC.formatCurrency(monthlySavings) + '/mo';

    // Annual savings
    get('rAnnualSavings').textContent = RRC.formatCurrency(monthlySavings * 12) + '/yr';

    // Years to FI
    const years = yearsToFI(rate, 5); // 5% real return assumption
    let fiText;
    if (rate <= 0) {
      fiText = 'Save something first!';
      get('rFiSub').textContent = 'Any savings rate beats zero';
    } else if (!isFinite(years) || years > 100) {
      fiText = '> 100 years';
      get('rFiSub').textContent = 'Try increasing your savings rate';
    } else if (years < 1) {
      fiText = 'Less than a year!';
      get('rFiSub').textContent = 'Amazing savings rate!';
    } else {
      fiText = RRC.formatYears(years);
      get('rFiSub').textContent = 'to financial independence (at 5% real return)';
    }
    get('rFiYears').textContent = fiText;

    // Milestone comparison
    const milestones = [
      { rate: 10, label: '10% saver', desc: '~43 yrs to FI' },
      { rate: 25, label: '25% saver', desc: '~31 yrs to FI' },
      { rate: 50, label: '50% saver', desc: '~17 yrs to FI' },
      { rate: 75, label: '75% saver', desc: '~7 yrs to FI' },
    ];
    const milestone = milestones.slice().reverse().find(m => ratePct >= m.rate);
    if (milestone) {
      get('rMilestone').textContent = `You're a ${milestone.label}! ${milestone.desc}`;
      get('rMilestone').className = 'stat-value green';
    } else {
      get('rMilestone').textContent = 'Every % counts — keep building!';
      get('rMilestone').className = 'stat-value accent';
    }

    // Bar: savings rate
    get('rBar').style.width = Math.max(4, Math.min(95, ratePct)) + '%';
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="range"]').forEach(s => s.addEventListener('input', render));
    render();
  });

  window.shareSavings = function () {
    const rate = get('rRate').textContent;
    const fi   = get('rFiYears').textContent;
    RRC.shareResult(
      'RetireRichCalc — Savings Rate Calculator',
      `My savings rate is ${rate} and I can reach financial independence in ${fi}. What's yours?`
    );
  };

}());
