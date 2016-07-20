'use strict';

const attr1 = Attractor.generateCoolAttractor();
//const attr1 = new Attractor('AMTMNQQXUYGA', true);
console.log(attr1);

const ctx = document.getElementById('chart');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
      label: 'Scatter Dataset',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#ccc',
      //pointBorderWidth: 1,
      pointRadius: 0.1,
      data: attr1.data
    }]
  },
  options: {
    showLines: false,
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom'
      }]
    }
  }
});
