<template>
  <div>
    <canvas id="chart"></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js'

export default {
  template: '<canvas id="chart"></canvas>',
  props: {
    savings: Object,
  },
  data(){
    return{
      chart: null,
    }
  },
  watch: {
    savings: {
      deep: true,
      handler() {
        console.clear();
        console.log('Update Chart');
        console.log(this.savings.compound);
        console.log(this.savings.contributions);
        console.log(this.savings.labels);
        console.log();
        this.chart.destroy();
        this.createChart();
      }
    }
  },
  methods: {
    createChart() {
      this.chart = new Chart(document.getElementById("chart"), {
        type: 'line',
        data: {
          datasets: [{
            label: 'Compound Gains',
            data: [...this.savings.compound],
            backgroundColor: "rgba(71, 183,132,.5)",
            borderColor: "#47b784",
            borderWidth: 3
          }, {
            label: 'Money Invested',
            data: [...this.savings.contributions],
            type: 'line',
            backgroundColor: "rgba(54,73,93,.5)",
            borderColor: "#36495d",
            borderWidth: 3
          }],
          labels: [...this.savings.labels]
        }
      });
    }
  },
  mounted() {
    this.createChart();
  }
};

</script>