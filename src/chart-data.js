export const chartData = {
    type: "line",
    data: {
      labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", "Month 7", "Month 8"],
      datasets: [
        {
          label: "Money Invested",
          data: [500,525,550,575,600,625,650,675],
          backgroundColor: "rgba(54,73,93,.5)",
          borderColor: "#36495d",
          borderWidth: 3
        },
        {
          label: "Compound Gains",
          data: [ 500, 551.25, 605.06, 661.57, 720.89, 783.19, 848.6, 917.28 ],
          backgroundColor: "rgba(71, 183,132,.5)",
          borderColor: "#47b784",
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      lineTension: 1,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              padding: 25
            }
          }
        ]
      }
    }
  };
  
  export default chartData;