<template>
  <div id="app">
    <img src="./images/logo.png">
    <hello></hello>
    <v-dialog></v-dialog>
    <button v-on:click='showMasker'>click me</button>
  </div>
</template>

<script>
  import 'common/css/reset.css';
  import Hello from 'components/Hello/Hello'
  import DiaLog from 'components/DiaLog/DiaLog'

  export default {
    name: 'app',
    components: {
      Hello,
      'v-dialog':DiaLog
    },
    methods: {
      showMasker:function(){
        this.dialog = false
      }
  }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
