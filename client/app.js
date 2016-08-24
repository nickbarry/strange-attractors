angular.module('strange-attractors', [
  'attractors.services'
])
  .controller('Scatterplot', function($scope, Attractors) {
    Chart.defaults.global.animation.duration = 0;

    const outliersCutoff = 200;
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

    $scope.create = function() {
      const attr1 = Attractors.Attractor.generateCoolAttractor(20000);
      datasets[0].data = attr1.data.slice(outliersCutoff);
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: datasets
        },
        options,
      });
    }
  });
