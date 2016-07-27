'use strict';

Chart.defaults.global.animation.duration = 0;
const attr1 = Attractor.generateCoolAttractor(40000);
//console.log(attr1);

//console.log(Attractor.getPotentiallyInterestingSets());

const outliersCutoff = 200;
const dataPoints = attr1.data.slice(outliersCutoff);
const datasets = [];
const colors = ['purple', 'orange', 'green', 'blue', 'black', 'black', 'black', 'black', 'black'];
const period = 1;
for (let i = 0; i < period; i++) {
  datasets.push({
    pointBorderColor: colors[i],
    pointBorderWidth: 0,
    pointRadius: 0.1,
    pointHoverRadius: 0,
    data: dataPoints.filter((point, idx) => (idx % period) === i)
  });
}

const ctx = document.getElementById('chart');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: datasets
      //[{
      //label: 'Coefficients: ' + attr1.coeffs.map(c => Math.round2(c,2)).join(', '),
    //  pointBorderColor: 'purple',
    //  pointBorderWidth: 0,
    //  pointRadius: 0.1,
    //  pointHoverRadius: 0,
    //  data: attr1.data.slice(outliersCutoff)
    //}]
  },
  options: {
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
  }
});