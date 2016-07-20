'use strict';

Math.round2 = function(num, sigDig) {
  const placesMultiplier = Math.pow(10, sigDig);
  return Math.round((num * placesMultiplier)) / placesMultiplier;
};