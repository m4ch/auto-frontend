<script>
import { Line } from 'vue-chartjs'
export default {
  name: 'my-line-chart',
  extends: Line,
  data: function () {
    return {
      chartLabels: null,
      chartColors: null,
      chartOptions: {
        responsive: true,
        animation: {
          duration: [3000],
          easing: ['easeOutBounce']
        },
        legend: {
          display: false
        },
        title: {
          display: false,
          position: 'top',
          text: '',
          fontSize: 25
        },
        tooltips: {
          bodyFontSize: 15,
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[0].labels[tooltipItem.datasetIndex] + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
            },
            labelColor: function () {
              // TODO: vraceni spravne barvy
              console.log(this.chartColors)
            }
          }
        },
        scales: {
          yAxes: [
            { ticks: { beginAtZero: true } }
          ]
        }
      }
    }
  },
  // mixins: [ mixins.reactiveProp ],
  props: {
    chartData: Object,
  },
  watch: {
    chartData: function () {
      this.chartLabels = this.chartData.labels.map(item => item.toString().substring(0, 4))
      this.chartOptions.title.text = this.chartData.id
      this.chartColors = this.chartData.borderColor
      this.renderChart(this.chartData, this.chartOptions)
    }
  },
  mounted () {
    this.chartLabels = this.chartData.labels.map(item => item.toString().substring(0, 3))
    this.chartOptions.title.text = this.chartData.id
    this.renderChart({ labels: this.chartLabels, datasets: this.chartData.datasets }, this.chartOptions)
  }
}
</script>
