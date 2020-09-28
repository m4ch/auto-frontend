j<script>
import { Bar } from 'vue-chartjs'
export default {
  name: 'my-bar-chart',
  extends: Bar,
  data: function () {
    return {
      chartLabels: null,
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
              if (data.datasets[0].labels) {
                return data.datasets[0].labels[tooltipItem.datasetIndex] + ': ' 
				+ data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
              } else {
                return tooltipItem.xLabel + ': ' + tooltipItem.value
              }
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
  props: {
    chartData: Object
  },
  watch: {
    chartData: function () {
      this.renderChart(this.chartData, this.chartOptions)
    }
  },
  mounted () {
    this.chartLabels = this.chartData.labels.map(item => item.toString().replace(' Paliva za měsíc ', '').replace('OA', '').substring(0, 3))
    this.chartOptions.title.text = this.chartData.id
    this.renderChart({ labels: this.chartLabels, datasets: this.chartData.datasets }, this.chartOptions)
  }
}
</script>
