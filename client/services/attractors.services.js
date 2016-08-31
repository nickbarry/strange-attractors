angular.module('attractors.services', [])
.factory('Attractors', function(Tests, Utils) {
  const DEFAULT_POINTS = 500;
  const OUTLIERS_CUTOFF = 200;

  function newCoeffs() {
    const coeffs = [];
    for (let i = 0; i < 12; i++) {
      coeffs[i] = Math.random() * 2.4 - 1.2;
    }
    return coeffs;
  }

  function generateData(coeffs, numPoints = DEFAULT_POINTS, data) {
    // If they already gave us data, copy it (or truncate it). Otherwise, create an initial point.
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
  const coolCoeffsFromLetters = [
    'UWACXDQIGKHF', 'AMTMNQQXUYGA', 'CVQKGHQTPHTE', 'FIRCDERRPVLD', 'GLXOESFTTPSV', 'GIIETPIQRRUL', 'GXQSNSKEECTX',
    'HGUHDPHNSGOH', 'ILIBVPKJWGRR', 'LUFBBFISGJYS', 'MCRBIPOPHTBN', 'ODGQCNXODNYA', 'QFFVSLMJJGCR', 'VBWNBDELYHUL',
    'WNCSLFLGIHGL',
  ].map(str => (
    [...str].map(ltr => (
      Utils.roundTo(((ltr.charCodeAt(0) - 65) / 10 - 1.2), 1)
    ))
  ));
  const coolCoeffs = [
    [-0.06310263014972994,-1.001172645052796,0.20860604594503918,-1.0232552434342843,0.09906923627046238,0.08284318930795331,-0.06400291892559928,0.4281973659008149,1.0125745634590657,-0.10628945725110683,0.865172399892385,-0.08486024657845226],
    [-1.0318129217647105,0.9214841230559745,0.3661454509851769,0.40894887515391276,-0.6707172703270613,-0.44227015904617695,0.3016114276861641,-0.07157719343884317,-0.598524097441637,0.2928894024027735,-0.8896046902556218,-0.8108188802701117],
    [-0.5276659662280693,-1.0312667275370713,0.12636687163566718,-0.46804494779618966,0.13923392298309412,-0.8986240965155039,0.38737210566479385,-0.29006571554865346,-0.3408429257638712,0.9228589733810846,-0.04984135776411103,-0.9093024635211264],
    [-0.8076385959994972,0.6120539847479047,-0.22507376036128657,0.6891612501408233,-0.1992805664569628,0.19648331234327765,0.09265877426144575,-1.0392908655094384,-0.8448453010062056,1.1903620842172005,0.9971171188063297,-0.20282435689728628],
    [-1.0686971861297558,0.8427138327937287,0.9006780489285038,0.9309021671983453,-0.5635786808351663,-0.35036200449789245,-1.0954945683889756,1.0221962564877318,0.12479658258882309,0.9545192966037888,-0.19526855708728696,0.3719234327884817],
    [-0.5715646091513168,-0.15287739181565652,0.2570894262113397,0.987155989918074,0.9788805880806926,-0.6766416102195076,0.7077511335379509,-0.9232330996022602,-0.8473575614112865,0.6731382590236001,0.3637135609769131,0.22832514434172202],
    [0.8807277110844918,-0.7603641468307958,-0.5876182936070823,0.5977780750867363,0.6095143991055132,-0.3779159129535552,0.26814301917573946,-1.1993714279919379,0.17023567347099067,-0.9390497131400751,0.29464129689373975,0.4305979964055793],
    [-0.15466739377215477,-1.039356142360215,0.25752668896969855,1.1846790962331848,-0.24376368781466307,-0.7570023306895022,0.5670078114132497,-0.32725762683488124,-0.6004567237075417,-0.8281224453861642,0.12758550153709014,-0.09495650420828872],
    ...coolCoeffsFromLetters,
  ];
  function chooseCoolCoeffsSet(setIndex) {
    return (setIndex === undefined) ?
      coolCoeffs[Math.floor(Math.random() * coolCoeffs.length)] :
      coolCoeffs[setIndex];
  }

  function getAttractors(num = 9, numPoints = DEFAULT_POINTS, type, index = -1) {
    const attractorsList = [];

    // If they requested some of our saved sets, generate the points and return them
    // without needing to check if the sets are ok.
    if (type === 'cool') {
      if (~index) {
        const coolCoeffs = chooseCoolCoeffsSet(index);
        const data = generateData(coolCoeffs, numPoints);
        return [{ coeffs: coolCoeffs, data }];
      }
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
      const initialData = generateData(coeffs, DEFAULT_POINTS);
      if (initialData.length < DEFAULT_POINTS) {
        countGoesToInfinity++;
        continue;
      }
      if (!Tests.isSetInteresting(initialData)) {
        countBoringSet++;
        continue;
      }

      // If the attractor passes these tests, generate more points, and then push the attractor to the results array
      const data = generateData(coeffs, numPoints, initialData);
      const attractor = { coeffs, data };
      attractorsList.push(attractor);
      console.log(`You skipped ${countGoesToInfinity} sets that went to infinity, and ${countBoringSet} boring sets.`);
    }

    // Next, finish generating the right number of points for each attractor
    return attractorsList.map(attractor => ({
      coeffs: attractor.coeffs,
      data: generateData(attractor.coeffs, numPoints, attractor.data),
    }));
  }

  return {
    getAttractors, OUTLIERS_CUTOFF,
  };
})
.factory('Tests', function(Utils) {
  function isRepetitive(data) {
    // If the data is in a loop (we check up to a period of 25), return false (periodic == uninteresting)
    const REPEAT_CHECK_PERIOD = 25;
    const SIG_DIGS_TO_CHECK = 4;
    const recentXVals = data.slice(-REPEAT_CHECK_PERIOD, -1).map(point => Utils.roundTo(point.x, SIG_DIGS_TO_CHECK));
    const lastXVal = Utils.roundTo(data[data.length - 1].x, SIG_DIGS_TO_CHECK);
    if (~recentXVals.indexOf(lastXVal)) {
      return true;
    }

    return false;
  }

  function isBoringLoop(data) {
    const sorted = data.slice()

    return false;
  }

  function isSetInteresting(data) {
    if (isRepetitive(data) || isBoringLoop(data)) {
      return false;
    }

    return true; // If it didn't fail any tests, then assume it's ok
  }

  return { isSetInteresting };
})
.factory('Utils', function() {
  function roundTo(num, sigDig) {
    const placesMultiplier = Math.pow(10, sigDig);
    return Math.round((num * placesMultiplier)) / placesMultiplier;
  }

  return { roundTo };
});