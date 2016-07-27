'use strict';

const defaultNumPoints = 20000;

function Attractor(coeffs, pointsDesired = defaultNumPoints) {
  function letterToCoeff(ltr) {
    return Math.round2(((ltr.charCodeAt(0) - 65) / 10 - 1.2), 1);
  }

  if (typeof coeffs === 'string') { // If they entered something like 'AMTMNQQXUYGA', convert to array of numbers
    coeffs = [].map.call(coeffs, letterToCoeff);
  } else if (coeffs === undefined || coeffs === null) {
    coeffs = Attractor.generateCoeffs();
  }

  const data = this.generatePoints(coeffs, pointsDesired);

  Object.assign(this, { coeffs, data });
}

Attractor.prototype.generatePoints = function (coeffs, numPoints = defaultNumPoints) {
  const points = [{ x: 0, y: 0 }];

  for (let i = 1; i < numPoints; i++) {
    const [x0, y0] = [points[i-1].x, points[i-1].y]; // Get previous x/y coords
    points[i] = { // Calculate next point
      x: coeffs[0] + coeffs[1] * x0 + coeffs[2] * x0 * x0 +
        coeffs[3] * x0 * y0 + coeffs[4] * y0 + coeffs[5] * y0 * y0,
      y: coeffs[6] + coeffs[7] * x0 + coeffs[8] * x0 * x0 +
        coeffs[9] * x0 * y0 + coeffs[10] * y0 + coeffs[11] * y0 * y0
    };
  }

  return points;
};

Attractor.generateCoolAttractor = function(numPoints = defaultNumPoints) {
  const coolSets = [
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
  ];
  const chooseSetNumber = -1;
  const chosenCoeffs = (chooseSetRandomly === -1) ?
    coolSets[Math.floor(Math.random() * coolSets.length)] :
    coolSets[chooseSetNumber];

  return new Attractor(chosenCoeffs, numPoints);
};

Attractor.generateCoeffs = function () {
  const coeffs = [];
  for (let i = 0; i < 12; i++) {
    coeffs[i] = Math.random() * 2.4 - 1.2;
  }
  return coeffs;
};


Attractor.getPotentiallyInterestingSets = function (numSets = 9) {
  let trialCounter = 0;
  const sets = [];

  while (trialCounter < 1000 && sets.length < numSets) {
    const set = new Attractor(undefined, 300);
    sets.push(set);
    trialCounter++;
  }

  return sets;
};