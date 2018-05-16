<template>
    <div>
        <h3>{{$store.state.userName}}</h3>
        <button @click="upDataBtn">UpDate</button>
        <button @click="changeDateBtn">changeDate</button>
    </div>
</template>
<script>
export default {
    name:'Main',
    data(){
        return {
            myName:'wzw'
        }
    },
    methods:{
        conslog(){
            console.log(this.$store.state)
        },
        upDataBtn(){
            this.myName=this.$store.state.userName
        },
        changeDateBtn(){
            this.$store.commit('increment')
        }
    },
    mounted(){
        this.conslog()
    }
    
}
</script>
