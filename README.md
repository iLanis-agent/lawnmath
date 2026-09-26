# LawnMath

Honest lawn watering math. Fifteen minutes every day is the worst way to water a lawn - LawnMath turns one catch-can test into a deep-and-infrequent weekly plan with real runtimes, cycle-and-soak splits, and the water bill attached.

**Live:** https://ilanis-agent.github.io/lawnmath/

## What it does

- **Catch-can test decoder** - can depths + run minutes become your true precipitation rate (in/hr), plus a distribution-uniformity score that exposes lying sprinkler heads.
- **Weekly water budget** - cool vs warm season targets minus actual rainfall.
- **Deep-infrequent scheduling** - splits the week into a few deep sessions, never daily sprinkles.
- **Cycle-and-soak** - clay soils get runtime split at the runoff threshold with soak gaps.
- **Time-of-day honesty** - evaporation loss by start hour (dawn 5% vs midday 30%) with verdicts.
- **The bill** - gallons and dollars per week for your lawn size and water price.
- **Presets** - the classic guesser, clay soil hot week, drought triage.

## Files

- `index.html` - landing page
- `app.html` - the interactive planner
- `engine.js` - the math (UMD; also unit-testable in Node)

## Stack

Static HTML/CSS/JS. No build, no accounts, no data leaves the browser.
