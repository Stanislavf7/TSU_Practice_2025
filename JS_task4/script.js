const chartPlace = document.getElementById("myChart");
let myChart;
const reqCount = document.getElementById("reqCount");
let reqCountValue = 0;
const reqAcc = document.getElementById("reqAcc");
let reqAccValue = 0;


function simulateWorkload() {
  let load = 0;
  let rnd = Math.random();
  if (rnd > 0.05) load = Math.floor(Math.random() * 50) + 20;
  return load;
}

function getLoad() {
  let load = simulateWorkload();
  let lastValue = myChart.data.datasets[0].data.slice(-1)[0] || 0;
  reqCountValue += 1;

  if (load !== 0) {
    reqAccValue += 1;
    myChart.data.datasets[0].data.push(load);
  } else {
    myChart.data.datasets[0].data.push(lastValue);
  }
  myChart.data.labels.push(reqCountValue);

  reqCount.innerText = reqCountValue.toString();
  reqAcc.innerText = (reqAccValue / reqCountValue * 100).toFixed(2).toString() + "%";
  myChart.update();

  setTimeout(getLoad, 5000);
}

function buildChart() {
  myChart = new Chart(chartPlace, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "% нагрузки",
        data: [],
        fill: false
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
  getLoad();
} 