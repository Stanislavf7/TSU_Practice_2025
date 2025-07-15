const chartPlace = document.getElementById("myChart");
let myChart;
const reqCount = document.getElementById("reqCount");
let reqCountValue = 0;
const reqAcc = document.getElementById("reqAcc");
let reqAccValue = 0;

async function getLoad() {
  const url = "http://exercise.develop.maximaster.ru/service/cpu/";
  const response = await fetch(url);
  if (!response.ok) {
    return 0;
  } else {
    const data = await response.json();
    return data;
  }
}

async function fillChart() {
  let load = await getLoad();
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

  setTimeout(fillChart, 5000);
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
  fillChart();
} 