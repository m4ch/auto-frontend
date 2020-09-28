<template>
<b-container>
<b-row no-gutters cols="2" class="h-100 text-left justify-content-center" v-for="(item, index) in dataLabels" :key="index">
<b-col cols="2" v-if="(position % 2)==1">
<b-icon icon="arrow-right-circle-fill" :style="{'color': dataColours[index] }" ></b-icon>
</b-col>
<b-col cols="10">
{{ item.replace('Paliva za měsíc', '') }}
</b-col >
<b-col cols="2" v-if="(position % 2)==0">
<b-icon icon="arrow-left-circle-fill" :style="{'color': dataColours[index] }"></b-icon>
</b-col>
</b-row>
</b-container>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
export default {
  name: 'graphLegend',
  props: {
    position: {
      type: Number,
      default: 0,
      required: false
    },
    dataLabels: Array,
    dataColours: Array
  },
  data: function () {
    return {
      pos: 0,
      labels: []
    }
  }
}
</script>
