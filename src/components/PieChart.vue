<script>
import { Pie } from 'vue-chartjs'
export default {
  name: 'my-pie-chart',
  extends: Pie,
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
              return data.labels[tooltipItem.index].replace('OA Paliva za měsíc', '') + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
            }
          }
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
    this.chartOptions.title.text = this.chartData.id
    this.renderChart(this.chartData, this.chartOptions)
  }
}
</script>
