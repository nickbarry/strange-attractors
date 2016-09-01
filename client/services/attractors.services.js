angular.module('attractors.services', [])
.factory('Attractors', function(Tests, Utils) {
  const DEFAULT_POINTS = 500;
  const OUTLIERS_CUTOFF = 500;

  function newCoeffs() {
    const coeffs = [];
    for (let i = 0; i < 12; i++) {
      coeffs[i] = Math.random() * 2.4 - 1.2;
    }
    return coeffs;
  }

  function generateData(coeffs, numPoints = DEFAULT_POINTS, data) {
    let hasInitialOutliers; // if so, we'll need to cut them off before returning data, since the initial
    // points take a while to settle into the eventual pattern, so they look ugly.

    if (data === undefined) {
      data = [{ x: 0, y: 0 }];
      hasInitialOutliers = true;
      numPoints += OUTLIERS_CUTOFF;
    } else {
      // If they already gave us data, copy it (or truncate it). Otherwise, create an initial point.
      data = data.slice();
    }

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

    return hasInitialOutliers ? data.slice(OUTLIERS_CUTOFF) : data;
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
    [0.08179555971879315, -0.02459801463335376, 0.044770270473528884, 0.9221455135496612, -0.9973919972953295, -0.3834522880774589, 0.11542092708246665, 0.9805488687940442, 0.5715287087932401, 0.37844444430071156, -0.11006221263266913, 0.3163960319859762],
    [-1.0465314214699357, -0.11810346649619818, 0.9662515751352296, 0.8385634107099611, 0.03639813048980178, 0.4253929203072062, -0.27234843015660315, 0.9436199594018053, -0.08129221648015084, 0.2891155467085669, 0.7135566042172778, 0.8112620352787523],
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

  // We want to check if any of our tests would have prevented us from seeing sets we already know are cool.
  // There's some refactoring I could do here - this could be a function that runs several tests, and I can just enter
  // the tests and the failure conditions for each set. That way I wouldn't have to keep reconstructing the attractors.
  //console.log('How many cool sets are boring? ', coolCoeffs.reduce((sum, coeffs, i) => {
  //  const attractor = getAttractors(1, 500, 'cool', i)[0];
  //  return Tests.isSetInteresting(attractor.data) ? sum : sum + 1;
  //}, 0));
  //console.log('How many cool sets are rubber bands? ', coolCoeffs.reduce((sum, coeffs, i) => {
  //  const attractor = getAttractors(1, 500, 'cool', i)[0];
  //  return Tests.rubberBandOutliers(attractor.data) > .2 ? sum : sum + 1;
  //}, 0));

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
      if (~index) { // If there's an index that isn't -1, then give them that index and be done with it
        const coolCoeffs = chooseCoolCoeffsSet(index);
        const data = generateData(coolCoeffs, numPoints);
        return [{ coeffs: coolCoeffs, data }];
      }

      // If there's no index (or -1), give them some random cool sets
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
    const counts = {
      toInfinityAndBeyond: 0,
      boring: 0,
      rubberBand: 0,
      all: 0,
    };
    while (attractorsList.length < num) {
      counts.all++;
      const coeffs = newCoeffs();
      const initialData = generateData(coeffs, DEFAULT_POINTS);
      if (initialData.length < DEFAULT_POINTS) {
        counts.toInfinityAndBeyond++;
        continue;
      }
      if (!Tests.isSetInteresting(initialData)) {
        counts.boring++;
        continue;
      }
      const outliers = Tests.rubberBandOutliers(initialData);
      if (outliers < .2) { // Below .2 are pretty much always boring. Below .3 are almost always, with a sprinkling of cool-ish ones
        counts.rubberBand++;
        continue;
      }

      // If the attractor passes these tests, generate more points, and then push the attractor to the results array
      const data = generateData(coeffs, numPoints, initialData);
      const attractor = { coeffs, data };
      attractorsList.push(attractor);
    }

    const allExcludedSets = Object.keys(counts).reduce((sum, key) => sum + counts[key], -counts.all);
    console.log(`You skipped ${counts.toInfinityAndBeyond} sets that went to infinity, ${counts.boring} boring sets` +
      `, and ${counts.rubberBand} rubber bands.
    ${ Utils.roundTo(allExcludedSets / counts.all, 2) * 100 }% of sets were filtered.`);

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

  function getBounds(data) {
    let [xMin, xMax, yMin, yMax] = [data[0].x, data[0].x, data[0].y, data[0].y];
    let [north, east, south, west] = [data[0], data[0], data[0], data[0]];
    for (let point of data) {
      if (point.x < xMin) {
        xMin = point.x;
        west = point;
      }
      if (point.x > xMax) {
        xMax = point.x;
        east = point;
      }
      if (point.y < yMin) {
        yMin = point.y;
        south = point;
      }
      if (point.y > yMax) {
        yMax = point.y;
        north = point;
      }
    }
    return {
      xMin, xMax, yMin, yMax, north, east, south, west,
      xRange: xMax - xMin,
      yRange: yMax - yMin,
    };
  }

  function rubberBandOutliers(data) {
    const bounds = getBounds(data);

    function sortIntoQuadrants(data) {
      const quadrants = { nw: [], ne: [], sw: [], se: [], outliers: [] };

      for (let point of data) {
        if (point.x < bounds.north.x && point.y > bounds.west.y) { // In northwest quadrant
          quadrants.nw.push(point);
          continue;
        }
        if (point.x > bounds.north.x && point.y > bounds.east.y) { // In northeast quadrant
          quadrants.ne.push(point);
          continue;
        }
        if (point.x < bounds.south.x && point.y < bounds.west.y) { // In southwest quadrant
          quadrants.sw.push(point);
          continue;
        }
        if (point.x > bounds.north.x && point.y < bounds.east.y) { // In southeast quadrant
          quadrants.se.push(point);
          continue;
        }

        // If we haven't hit a `continue` statement, add point to outliers
        // I think this array should contain nothing but the four north/south/east/west points, but I'm
        // recording the points here in case I'm wrong
        quadrants.outliers.push(point);
      }

      [quadrants.nw, quadrants.ne, quadrants.sw, quadrants.se]
        .forEach(arr => arr.sort((a, b) => a.x - b.x));

      return quadrants;
    }

    const isGreater = (a, b) => a > b;
    const isLesser = (a, b) => a < b;
    const quadrants = sortIntoQuadrants(data);
    let outliersCount = 0;
    [quadrants.nw, quadrants.ne, quadrants.sw, quadrants.se].forEach(arr => {
      if (arr.length < 2) {
        return;
      }
      const comparator = (arr[0].y > arr[1].y) ? isGreater : isLesser;

      // We'll loop through the entire array and check if each quadrant (`arr`) is a continuous upward or downward slope.
      // If it is for each quadrant, then our attractor is a rubber band.
      for (let i = 2; i < arr.length; i++) { // start at index 2 (comparing 1 to 2), since we already compared 0 to 1
        if (!comparator(arr[i-1].y, arr[i].y)) {
          outliersCount++;
        }
      }
    });

    //console.log(`Is it a rubber band? Outliers (out of ${data.length}): , ${outliersCount}`);

    return outliersCount / data.length; // Percentage of outlier points
  }

  function isSetInteresting(data) {
    if (isRepetitive(data)) {
      return false;
    }

    //console.log('Percentage of filled buckets: ', percentageOfScreenFilled(data));

    return true; // If it didn't fail any tests, then assume it's ok
  }

  return { isSetInteresting, rubberBandOutliers };

  //function percentageOfScreenFilled(data) {
  //  // It's possible I have an implementation error that is resulting in the wrong value being returned. But
  //  // I found this function was not very helpful for distinguishing between very sparse sets (like rubber bands)
  //  // and sets that appeared to fill more of the screen. Maybe I didn't find a good TICKS value - I tried
  //  // 10 and 20, and hand-tested a bunch of sets.
  //
  //  const bounds = getBounds(data);
  //
  //  // We're going to divide the screen into a grid of tiles (buckets), and calculate what percentage of
  //  // buckets actually have at least one point in them.
  //  const TICKS = 10; // The square root of how many buckets we'll ultimately have
  //  const grid = [];
  //  for (let point of data) {
  //    // Determine which row the point belongs in
  //    const distanceFromYMin = (point.y - bounds.yMin);
  //    const isTopMostPoint = point.y === bounds.yMax;
  //    const row = isTopMostPoint ?
  //      TICKS - 1 : // Avoid creating an extra bucket for the right-most point
  //      Math.floor(distanceFromYMin / bounds.yRange * TICKS);
  //
  //    // Determine which column the point belongs in
  //    const distanceFromXMin = (point.x - bounds.xMin);
  //    const isRightMostPoint = point.x === bounds.xMax;
  //    const column = isRightMostPoint ?
  //      TICKS - 1 : // Avoid creating an extra bucket for the right-most point
  //      Math.floor(distanceFromXMin / bounds.xRange * TICKS);
  //
  //    grid[row] = grid[row] || []; // Make sure the appropriate row array exists
  //    grid[row][column] = grid[row][column] || []; // Make sure the appropriate bucket exists
  //    grid[row][column].push(point); // Store the point in this bucket
  //  }
  //
  //  const countFullBuckets = grid.reduce((count, row) => ( // For each row that exists...
  //    row.reduce((rowCount, bucket) => rowCount + 1, 0) // ...count each bucket that exists (i.e. has a point in it)
  //  ), 0);
  //  console.log('grid: ', grid);
  //
  //  return countFullBuckets / (TICKS * TICKS); // percentage of total buckets that are filled
  //}
})
.factory('Utils', function() {
  function roundTo(num, sigDig) {
    const placesMultiplier = Math.pow(10, sigDig);
    return Math.round((num * placesMultiplier)) / placesMultiplier;
  }

  return { roundTo };
});