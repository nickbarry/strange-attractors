angular.module('attractors.services', [])
.factory('Attractors', function() {
  function roundTo(num, sigDig) {
    const placesMultiplier = Math.pow(10, sigDig);
    return Math.round((num * placesMultiplier)) / placesMultiplier;
  }

  const DEFAULT_POINTS = 500;

  function newCoeffs() {
    const coeffs = [];
    for (let i = 0; i < 12; i++) {
      coeffs[i] = Math.random() * 2.4 - 1.2;
    }
    return coeffs;
  }

  function newVettedCoeffs() {
    let coeffs
  }

  function isSetInteresting(data) {
    // If the data is in a loop (we check up to a period of 25), return false (periodic == uninteresting)
    const REPEAT_CHECK_PERIOD = 25;
    const SIG_DIGS_TO_CHECK = 6;
    const recentXVals = data.slice(-REPEAT_CHECK_PERIOD, -1).map(point => roundTo(point.x, SIG_DIGS_TO_CHECK));
    const lastXVal = roundTo(data[data.length - 1].x, SIG_DIGS_TO_CHECK);
    if (~recentXVals.indexOf(lastXVal)) {
      return false;
    }

    return true; // If it didn't fail any tests, then assume it's ok
  }



  function generateData(coeffs, numPoints = DEFAULT_POINTS, data) {
    // If they already gave us data, copy it. Otherwise, create an initial point.
    data = data ? data.slice() : [{ x: 0, y: 0 }];

    // If they gave us more data than we actually want, return a truncated version of their data,
    // in case they have a reason to want to work with less data (e.g., if they want to display a
    // smaller amount of data for speed purposes).
    if (data.length > numPoints) {
      return data.slice(0, numPoints);
    }

    // Generate new points, starting with any existing points they may have provided.
    const cf = coeffs; // a useful abbreviation
    for (let i = data.length; i < numPoints; i++) {
      const [x0, y0] = [data[i-1].x, data[i-1].y]; // Get previous x/y coords
      const [x1, y1] = [ // Calculate next point
        cf[0]         + cf[1]  * x0 + cf[2]  * x0*x0 +
        cf[3] * x0*y0 + cf[4]  * y0 + cf[5]  * y0*y0,
        cf[6]         + cf[7]  * x0 + cf[8]  * x0*x0 +
        cf[9] * x0*y0 + cf[10] * y0 + cf[11] * y0*y0
      ];
      if (isNaN(x1) || isNaN(y1)) {
        break; // Exit the loop; don't add the new points to `data`
      }
      data[i] = { x: x1, y: y1 };
    }

    return data;
  }

  // Get a pre-defined set of coefficients that will create a cool graph
  const coolCoeffs = [
    'UWACXDQIGKHF',
    'AMTMNQQXUYGA',
    'CVQKGHQTPHTE',
    'FIRCDERRPVLD',
    'GLXOESFTTPSV',
    'GIIETPIQRRUL',
    'GXQSNSKEECTX',
    'HGUHDPHNSGOH',
    'ILIBVPKJWGRR',
    'LUFBBFISGJYS',
    'MCRBIPOPHTBN',
    'ODGQCNXODNYA',
    'QFFVSLMJJGCR',
    'VBWNBDELYHUL',
    'WNCSLFLGIHGL',
  ].map(str => (
    [...str].map(ltr => (
      roundTo(((ltr.charCodeAt(0) - 65) / 10 - 1.2), 1)
    ))
  ));
  function chooseCoolCoeffsSet(setIndex) {
    return (setIndex === undefined) ?
      coolCoeffs[Math.floor(Math.random() * coolCoeffs.length)] :
      coolCoeffs[setIndex];
  }

  function getAttractors(num = 9, numPoints = DEFAULT_POINTS, type) {
    const attractorsList = [];

    // If they requested some of our saved sets, generate the points and return them
    // without needing to check if the sets are ok.
    if (type === 'cool') {
      for (let i = 0; i < num; i++) {
        const coeffs = chooseCoolCoeffsSet();
        const data = generateData(coeffs, numPoints);
        attractorsList.push({ coeffs, data });
      }
      return attractorsList;
    }

    // If we aren't using vetted sets of coefficients:
    // First generate the right number of attractors, with a small number of points so we can test
    // that each attractor isn't boring.
    let countGoesToInfinity = 0;
    let countBoringSet = 0;
    while (attractorsList.length < num ) {
      const coeffs = newCoeffs();
      const data = generateData(coeffs, DEFAULT_POINTS);
      if (data.length < DEFAULT_POINTS) {
        countGoesToInfinity++;
        continue;
      }
      if (!isSetInteresting(data)) {
        countBoringSet++;
        continue;
      }
      attractorsList.push({ coeffs, data });
      console.log(`You skipped over ${countGoesToInfinity} sets that went to infinity, and ${countBoringSet} sets that were boring.`);
    }

    // Next, finish generating the right number of points for each attractor
    return attractorsList.map(attractor => ({
      coeffs: attractor.coeffs,
      data: generateData(attractor.coeffs, numPoints, attractor.data),
    }));
  }

  return {
    getAttractors,
  };

  //function Attractor(coeffs, pointsDesired = DEFAULT_POINTS) {
  //
  //  function letterToCoeff(ltr) {
  //    return roundTo(((ltr.charCodeAt(0) - 65) / 10 - 1.2), 1);
  //  }
  //
  //  if (typeof coeffs === 'string') { // If they entered something like 'AMTMNQQXUYGA', convert to array of numbers
  //    this.coeffs = [...coeffs].map(letterToCoeff);
  //  } else if (coeffs === undefined || coeffs === null) {
  //    this.coeffs = Attractor.getPotentiallyInterestingSets(1)[0];
  //  }
  //
  //  // Generate points based on this set of coefficients
  //  const data = this.generatePoints(coeffs, pointsDesired);
  //
  //  Object.assign(this, { coeffs, data });
  //}
  //
  //Attractor.prototype.generatePoints = function (coeffs = this.coeffs,
  //                                               numPoints = DEFAULT_POINTS,
  //                                               points = [{ x: 0, y: 0 }]) {
  //  const cf = coeffs;
  //
  //  for (let i = points.length; i < numPoints; i++) {
  //    const [x0, y0] = [points[i-1].x, points[i-1].y]; // Get previous x/y coords
  //    const [x1, y1] = [ // Calculate next point
  //      cf[0]         + cf[1]  * x0 + cf[2]  * x0*x0 +
  //      cf[3] * x0*y0 + cf[4]  * y0 + cf[5]  * y0*y0,
  //      cf[6]         + cf[7]  * x0 + cf[8]  * x0*x0 +
  //      cf[9] * x0*y0 + cf[10] * y0 + cf[11] * y0*y0
  //    ];
  //    if (isNaN(x1) || isNaN(y1)) {
  //      break; // Exit the loop; don't add the new points to `points`
  //    }
  //    points[i] = { x: x1, y: y1 };
  //  }
  //
  //  return points;
  //};
  //
  //Attractor.generateCoolAttractor = function(numPoints = DEFAULT_POINTS) {
  //  const coolSets = [
  //    'UWACXDQIGKHF',
  //    'AMTMNQQXUYGA',
  //    'CVQKGHQTPHTE',
  //    'FIRCDERRPVLD',
  //    'GLXOESFTTPSV',
  //    'GIIETPIQRRUL',
  //    'GXQSNSKEECTX',
  //    'HGUHDPHNSGOH',
  //    'ILIBVPKJWGRR',
  //    'LUFBBFISGJYS',
  //    'MCRBIPOPHTBN',
  //    'ODGQCNXODNYA',
  //    'QFFVSLMJJGCR',
  //    'VBWNBDELYHUL',
  //    'WNCSLFLGIHGL',
  //  ];
  //  const chooseSetNumber = -1;
  //  const chosenCoeffs = (~chooseSetNumber) ?
  //    coolSets[chooseSetNumber] :
  //    coolSets[Math.floor(Math.random() * coolSets.length)];
  //
  //  return new Attractor(chosenCoeffs, numPoints);
  //};
  //
  //Attractor.generateCoeffs = function () {
  //  const coeffs = [];
  //  for (let i = 0; i < 12; i++) {
  //    coeffs[i] = Math.random() * 2.4 - 1.2;
  //  }
  //  return coeffs;
  //};
  //
  //Attractor.getPotentiallyInterestingSets = function (numSets = 9) {
  //  const POINTS_TO_TEST = 300;
  //
  //  function isSetInteresting(set) {
  //    // If the data is in a loop (we check up to a period of 25)
  //    const REPEAT_CHECK_PERIOD = 25;
  //    if (~set.data.slice(-REPEAT_CHECK_PERIOD).indexOf(set.data[set.data.length - 1])) {
  //      return false;
  //    }
  //
  //    return true;
  //  }
  //
  //  let trialCounter = 0;
  //  const sets = [];
  //
  //  while (trialCounter++ < 1000 && sets.length < numSets) {
  //    const randomCoeffs = Attractor.generateCoeffs();
  //    const set = new Attractor(randomCoeffs, POINTS_TO_TEST);
  //    (set.data.length >= POINTS_TO_TEST) && isSetInteresting(set) && sets.push(set);
  //  }
  //
  //  return sets;
  //};
  //
  //Attractor.getPotentiallyInterestingAttractors = (num = 9, numPoints = 10000) => {
  //  const sets = Attractor.getPotentiallyInterestingSets(num);
  //
  //  return sets.map(set => new Attractor(set, numPoints));
  //};
  //
  //return {
  //  roundTo,
  //  Attractor,
  //};
});