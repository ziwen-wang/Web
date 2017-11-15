<template>
  <div class="masker-wp" v-show="dialog">
    <div class="content">
      {{msg}}
      <button v-on:click="dialogHidden">close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      dialog:true
    }
  },
  methods: {
    dialogHidden:function(){
      this.dialog = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .masker-wp{
    position: fixed;
    width:100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0,0,0,.5);
  }
  .masker-wp .content{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 300px;
    height: 150px;
    background: #fff;
    margin: auto;
  }
</style>