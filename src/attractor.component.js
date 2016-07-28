import Attractor from './attractor';
import React from 'react';

//Chart.defaults.global.animation.duration = 0;
const attr1 = Attractor.generateCoolAttractor(500);
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
    data: (period === 1) ? dataPoints : dataPoints.filter((point, idx) => (idx % period) === i)
  });
}

//const ctx = document.getElementById('chart');
const options = {
  //responsiveAnimationDuration: 0,
  //hover: { animationDuration: 0 },
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
//const chart = new Chart(ctx, {
//  type: 'line',
//  data: {
//    datasets: datasets
//  },
//  options,
//});

import { Line } from 'react-chartjs';

module.exports = React.createClass({
  render: function() {
    return <Line data={dataPoints} options={options} width="600" height="250"/>
  }
});
