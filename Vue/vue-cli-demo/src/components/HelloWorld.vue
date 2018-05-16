<template>
  <div>
    <ul>
      <li v-for="item in items" v-bind:key='item.id' v-bind:title="'年龄'+item.age+'生日'+item.birthday+'城市'+item.city" v-bind:style="{'backgroundColor':item.color}">{{item.name}}</li>
    </ul>
    <Mainc></Mainc>
  </div>
</template>

<script>
import Mainc from './Main.vue'
export default {
  name: 'HelloWorld',
  components:{
      Mainc
  },
  data () {
    return {
      items:[]
    }
  },
  mounted(){
    this.$axios('/api/data')
    .then((res)=>{this.items = res.data.list})
  }
  
}
</script>
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
