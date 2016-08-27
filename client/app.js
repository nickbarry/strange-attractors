angular.module('strange-attractors', [
  'attractors.services'
])
.controller('Scatterplot', function($scope, Attractors) {
  Chart.defaults.global.animation.duration = 0;

  $scope.pointsToDisplay = 40000;
  $scope.numberOfPanes = 1;

  const OUTLIERS_CUTOFF = 200;
  const datasets = [{
    pointBorderColor: 'purple',
    pointBorderWidth: 0,
    pointRadius: 0.1,
    pointHoverRadius: 0,
  }];

  const ctx = document.getElementById('chart');
  const options = {
    responsiveAnimationDuration: 0,
    hover: { animationDuration: 0 },
    showLines: false,
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom'
      }]
    },
    tooltips: {
      enabled: false
    }
  };

  let chart;
  $scope.destroy = function() {
    chart && chart.destroy();
  };

  $scope.create = function(type) {
    //const getOneSet = {
    //  cool: points => Attractors.Attractor.generateCoolAttractor(points),
    //  random: points => Attractors.Attractor.getPotentiallyInterestingAttractors(1, points)[0],
    //};
    //const attractor = getOneSet[type]($scope.pointsToDisplay);
    const attractor = Attractors.getAttractors(1, $scope.pointsToDisplay, type)[0];
    //console.log(attractor.data.slice(-10));
    datasets[0].data = attractor.data.slice(OUTLIERS_CUTOFF);
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: datasets
      },
      options,
    });
  }
});
