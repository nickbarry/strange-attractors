'use strict';

Chart.defaults.global.animation.duration = 0;
const attr1 = Attractor.generateCoolAttractor(40000);
//const attr1 = new Attractor('AMTMNQQXUYGA', 20000);
console.log(attr1);

console.log(Attractor.getPotentiallyInterestingSets());

//const firstFewCutoff = 150;
const outliersCutoff = 200;
const ctx = document.getElementById('chart');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
    //  label: 'First few',
    //  pointBackgroundColor: 'orange',
    //  //pointBorderColor: 'rgba(75,192,192,1)',
    //  pointBorderWidth: 0,
    //  pointRadius: 0,
    //  pointHoverRadius: 0,
    //  data: attr1.data.slice(0,firstFewCutoff)
    //}, {
    //  label: 'Second few',
    //  pointBackgroundColor: 'blue',
    //  //pointBorderColor: 'rgba(75,192,192,1)',
    //  pointBorderWidth: 0,
    //  pointRadius: 2,
    //  pointHoverRadius: 0,
    //  data: attr1.data.slice(firstFewCutoff, outliersCutoff)
    //}, {
      label: 'Coefficients: ' + attr1.coeffs.map(c => Math.round2(c,2)).join(', '),
      //pointBackgroundColor: 'green',
      pointBorderColor: 'purple',
      pointBorderWidth: 0,
      pointRadius: 0.1,
      pointHoverRadius: 0,
      data: attr1.data.slice(outliersCutoff)
    }]
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