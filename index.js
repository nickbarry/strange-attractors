'use strict';

const ctx = document.getElementById('chart');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
      label: 'Scatter Dataset',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#ccc',
      pointBorderWidth: 1,
      pointRadius: 1,
      data: [{
        x: -10,
        y: -5
      }, {
        x: 0,
        y: 10
      }, {
        x: 0,
        y: 5
      }, {
        x: 0,
        y: 3
      }, {
        x: 10,
        y: 5
      }]
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