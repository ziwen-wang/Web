<template>
    <div ref="echartDiv" style="height:800px; width:100%"></div>
</template>
<style>
</style>
<script>
let echarts = require("echarts");
const renderer = require("./schedule_renderer2");
export default {
  mounted() {
    var _this = this
    var domElement = this.$refs.echartDiv;
    domElement.style.height = domElement.parentElement.offsetHeight;
    this.chart = echarts.init(domElement);
    this.renderer = new renderer.default.scheduleRenderer(this.chart);
    this.renderer.render(this.acturalSchedule, this.plannedSchedule);
    var a=0,b=100;
    // var timer = setInterval(()=>{
    //   if(a!=b){
    //       a+=10
    //       b-=10
        
    //      this.chart.setOption({dataZoom:_this.renderer.dataZoomSet(a,b)});
    //      console.log(a,b)
    //   }else{
    //     clearInterval(timer)
    //   }
     
    // },1000)
  },
  data() {
    return {
      acturalSchedule: true,
      plannedSchedule: false,
      chart: null,
      renderer:null
    };
  },
  methods:{
    reLoadChat(){
      this.chart.resize();
    }
  }
};
</script>
