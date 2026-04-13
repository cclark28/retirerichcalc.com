# DESIGN.md — RetireRichCalc.com

## Design Direction
Official, trustworthy .gov-inspired aesthetic. Navy/blue government palette. Clean serif headlines, lots of white space. Minimal and authoritative. Modeled on trumpaccounts.gov (color/feel) + quittingmyjob.com (nav/structure).

---

## Typography

| Role     | Font       | Weight | Desktop     | Mobile      |
|----------|------------|--------|-------------|-------------|
| Display  | Noto Serif | 700    | 3.5rem      | 2.25rem     |
| H1       | Noto Serif | 700    | 2.5rem      | 1.875rem    |
| H2       | Noto Serif | 600    | 1.875rem    | 1.5rem      |
| H3       | Noto Serif | 600    | 1.375rem    | 1.25rem     |
| Body     | Noto Sans  | 400    | 1rem        | 1rem        |
| Label    | Noto Sans  | 600    | 0.875rem    | 0.875rem    |
| Caption  | Noto Sans  | 400    | 0.75rem     | 0.75rem     |

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Color Tokens

```css
:root {
  /* Brand Blues */
  --color-navy-dark:  #0F2447;   /* Header bg, results panel */
  --color-navy:       #1B3A6B;   /* Primary brand, slider thumb */
  --color-blue:       #2E6DA4;   /* Links, secondary actions */
  --color-blue-light: #4A90D9;   /* Accents, eyebrows, active nav */
  --color-blue-pale:  #EBF2FA;   /* Section backgrounds, badges */
  --color-blue-faint: #F4F8FD;   /* Card hover tint */

  /* Accent */
  --color-red:        #C41230;   /* Used sparingly, strong emphasis */

  /* Neutrals */
  --color-white:      #FFFFFF;
  --color-gray-50:    #F9FAFB;
  --color-gray-100:   #F3F4F6;
  --color-gray-200:   #E5E7EB;
  --color-gray-400:   #9CA3AF;
  --color-gray-600:   #4B5563;
  --color-gray-700:   #374151;
  --color-gray-900:   #111827;

  /* Semantic */
  --color-green:      #16A34A;
  --color-green-light:#DCFCE7;
}
```

---

## Spacing Scale

```css
--space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
--space-4: 1rem;     --space-5: 1.25rem;  --space-6: 1.5rem;
--space-8: 2rem;     --space-10: 2.5rem;  --space-12: 3rem;
--space-16: 4rem;    --space-20: 5rem;    --space-24: 6rem;
```

---

## Layout

- `--max-width: 1100px` — site container
- `--calc-width: 920px` — calculator card max-width
- Header: sticky, dark navy, 3px blue-light bottom border
- Calculator grid: 2-column (inputs left / results right), stacks on mobile
- Results panel: sticky on desktop (top: 80px)

---

## Component Patterns

### Slider
- Track height: 6px, filled navy→blue gradient, unfilled gray-200
- Thumb: 22px circle, navy fill, white 3px border, navy ring shadow
- Hover: scale(1.15) + blue-light ring
- Value display: blue badge top-right of label row
- Min/max labels: caption text below track

### Result Panel
- Background: `--color-navy-dark`
- Primary number: Noto Serif 700, white, ~4-6rem
- Eyebrow: uppercase caption, blue-light
- Stats: label (60% white), value (100% white or blue-light for highlights)
- Growth bar: white-10% track, blue-light fill, animated width transition
- Share button: ghost style, white-10% bg, white border

### Navigation
- Background: `--color-navy-dark`, bottom 3px `--color-blue-light`
- Links: 85% white, hover bg white-10%, active: blue-light underline + bg
- Mobile: hamburger toggle, full-width dropdown on dark bg

---

## Page Structure

```
/                     → Homepage (millionaire calc featured)
/millionaire/         → When Will I Be a Millionaire?
/retirement-needs/    → How Much Do I Need to Retire?
/debt-freedom/        → Debt Freedom Calculator
/savings-rate/        → Savings Rate Calculator
```

All calculator pages follow the same template: page-header banner → 2-col calculator card → footer.

---

## Asset Paths (absolute, Cloudflare Pages)
- `/assets/css/main.css`
- `/assets/js/shared.js`
- `/assets/js/millionaire.js`
- `/assets/js/retirement.js`
- `/assets/js/debt.js`
- `/assets/js/savings.js`
