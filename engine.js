/* LawnMath engine - honest lawn watering math. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LawnMath = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  var GRASS = {
    cool: { name: 'Cool-season (fescue, bluegrass)', weekly: 1.25 },
    warm: { name: 'Warm-season (bermuda, zoysia)', weekly: 0.75 }
  };

  // Catch-can test: depths in inches across cans -> precipitation rate in/hr.
  function precipitationRate(depths, minutes) {
    if (!depths.length || minutes <= 0) return 0;
    var avg = depths.reduce(function (s, d) { return s + d; }, 0) / depths.length;
    return avg / minutes * 60;
  }

  // Distribution uniformity: low-quarter average / overall average. Below 0.7 = dry spots by design.
  function uniformity(depths) {
    if (depths.length < 4) return 1;
    var sorted = depths.slice().sort(function (a, b) { return a - b; });
    var n = Math.max(1, Math.floor(sorted.length / 4));
    var low = sorted.slice(0, n).reduce(function (s, d) { return s + d; }, 0) / n;
    var avg = sorted.reduce(function (s, d) { return s + d; }, 0) / sorted.length;
    return avg > 0 ? Math.round(low / avg * 100) / 100 : 0;
  }

  // Net inches the lawn still needs this week after rain.
  function weeklyNeed(grassType, rainInches) {
    var base = GRASS[grassType].weekly;
    return Math.max(0, Math.round((base - rainInches) * 100) / 100);
  }

  // Sessions: deep and infrequent - split the week into 2 or 3 waterings.
  function sessions(needInches, perSessionMax) {
    if (needInches <= 0) return { count: 0, inchesEach: 0 };
    var count = needInches <= perSessionMax ? 1 : Math.ceil(needInches / perSessionMax);
    if (count < 2 && needInches > 0.5) count = 2; // deep-infrequent: never daily sprinkles
    var each = Math.round(needInches / count * 100) / 100;
    return { count: count, inchesEach: each };
  }

  // Runtime per session from precipitation rate; cycle-and-soak split when over the soil's runoff threshold.
  function runtime(inchesEach, rateInHr, runoffMinutes) {
    if (rateInHr <= 0) return { minutes: 0, cycles: 1, cycleMinutes: 0 };
    var total = inchesEach / rateInHr * 60;
    var cycles = 1;
    if (runoffMinutes > 0 && total > runoffMinutes) cycles = Math.ceil(total / runoffMinutes);
    return {
      minutes: Math.round(total),
      cycles: cycles,
      cycleMinutes: Math.round(total / cycles)
    };
  }

  // Evaporation penalty by start hour (fraction of water lost before it soaks).
  function evapLoss(startHour) {
    if (startHour >= 4 && startHour < 9) return 0.05;
    if (startHour >= 9 && startHour < 17) return 0.30;
    if (startHour >= 17 && startHour < 21) return 0.15;
    return 0.10; // night: low evap but fungus risk
  }

  function evapVerdict(startHour) {
    if (startHour >= 4 && startHour < 9) return { code: 'best', label: 'Best window - least loss, blades dry by noon' };
    if (startHour >= 9 && startHour < 17) return { code: 'waste', label: 'A third boils off in the sun' };
    if (startHour >= 17 && startHour < 21) return { code: 'ok', label: 'Workable, but morning beats it' };
    return { code: 'fungus', label: 'Low loss but wet blades all night - fungus risk' };
  }

  // Water bill: 1 inch over 1 sqft = 0.623 gallons.
  function gallons(lawnSqft, inches) { return lawnSqft * inches * 0.623; }
  function costPerWeek(lawnSqft, inchesPerWeek, pricePer1000) {
    return Math.round(gallons(lawnSqft, inchesPerWeek) / 1000 * pricePer1000 * 100) / 100;
  }

  function fmtMin(m) {
    if (m < 60) return m + ' min';
    var h = Math.floor(m / 60);
    return h + ' h ' + (m - h * 60) + ' m';
  }

  return {
    GRASS: GRASS,
    precipitationRate: precipitationRate,
    uniformity: uniformity,
    weeklyNeed: weeklyNeed,
    sessions: sessions,
    runtime: runtime,
    evapLoss: evapLoss,
    evapVerdict: evapVerdict,
    gallons: gallons,
    costPerWeek: costPerWeek,
    fmtMin: fmtMin
  };
});
