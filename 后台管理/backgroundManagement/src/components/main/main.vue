<template>
	<div style="height: 100%;">
		<div class="row header" style="height: 90px;">
		  	<div class="col-xs-6" style="height: 80px; line-height: 80px;padding-left: 20px;">
		  		<img src="./logo.png" class="img-responsive" alt="Responsive image" style="display: inline;">
		  	</div>
		  		<div class="col-xs-6  pull-right">
					<div class=" col-xs-12 text-right">
						<span>您好，{{name}}</span>
						<button type="button" class="btn " style="margin-left: 20px;padding: 4px 23px;" @click="SignOut">退出</button>
					</div>
					<div class=" col-xs-12 text-right" style="margin-top: 10px;">
						<ul class="nav  nav-pills pull-right">
						 	<!--<li v-bind:class="{active:items.active}" v-for="items in items" @click="navclick(items)" ><a>{{items.list}}</a></li>-->
						 	<li class="disabled"><a href="javascript:;">公司成员管理</a></li>
						 	<li class="disabled"><a href="javascript:;">项目管理</a></li>
						 	<li class="active"><a href="javascript:;">项目数据</a></li>
						 	<li class="disabled"><a href="javascript:;">系统设置</a></li>
						</ul>
					
					</div>
		 		</div>
		 </div>
		 <div style="height: 100%;padding-right: 0;display: flex;" :style="{height:centerHeight+'px'}">
		 	<div class="siderbar row" style=" width: 280px; margin-right: 20px;" >
		 		<div class="header-wp col-md-12" style="">
		 			<img src="./photo.png" alt="" class="pull-left" style="margin-top: 10px;"/>
		 			<div class="pull-left" style="margin-left: 20px;">
		 				<h1 style="font-size: 24px; font-weight: 500; color: #333;">{{name}}</h1>
		 				<p style="font-size: 12px; color: #999;">超级管理员</p>
		 			</div>
		 		</div>
		 		<nav class="col-md-12" style="padding-right: 0;">
		 			<ul>
		 				<li class="active" @click="itemClick()"><i class="left"></i>项目检查结果 <i class="right"></i></li>
		 			</ul>
		 		</nav>
		 	</div>
		 	<router-view class="routerView" style=""/>	
		 </div>
	</div>
  

</template>

<script>
	export default {
	  name: 'Login',
	  data () {
	    return {
	    	name:'',
	    	items:[
	    		{list:'公司成员管理',active:true, path:'/Members_management'},
	    		{list:'项目管理',active:false, path:'/projects'},
	    		{list:'项目数据',active:false, path:'/Table'},
	    		{list:'系统设置',active:false, path:'/systems'}
	    		
	    	],
	    	centerHeight:0,
	    }
	  },
	  methods: {
	  	navclick(item,index){
	  		this.items.forEach(function(e){
		  		e.active=false
		  	})
		  	item.active=true
		  	this.$router.push({ path:item.path });
	  	},
	  	SignOut(){
	  		window.localStorage.clear()
	  		this.$router.push({
	  			path:'/login',
	  			name:'login'
	  		})
	  	},
	  	itemClick(){
	  		var loginMsg = JSON.parse(window.localStorage.getItem('LoginMsg'))
	  		this.$router.push({
	  			path:'/',
	  			name:'MainTable',
	  			query:{
	  				
				   		usertype:loginMsg.usertype,
                    	name:loginMsg.name,
                    	MB_Guid:loginMsg.guid
				   }
	  			
	  		})
	  	}
	  },
	  mounted:function(){
	  	var _this = this
	  	this.centerHeight = document.body.clientHeight - 90
	  	$(window).resize(function(){
	  		_this.centerHeight = document.body.clientHeight - 90
	  	})
	  	 this.name = this.$route.query.name
	  	 console.log(_this.name)
	  	 if(_this.name == '' || _this.name == undefined){
	  	 	var loginMsg = JSON.parse(window.localStorage.getItem('LoginMsg'))
	  	 	_this.name = loginMsg.name
	  	 }
	  },
	  created:function(){
	  	var loginMsg = JSON.parse(window.localStorage.getItem('LoginMsg'))
	  	if(loginMsg == '' || loginMsg == undefined || loginMsg == null){
	  		this.$router.push({
	  			path:'/login',
	  			name:'login'
	  		})
	  		return false
	  	}
	  }
	}
</script>

<style>
	*{
		margin: 0;
		padding: 0;
	}
	.header{
		color: #000;
		padding:0 20px;
		background-color: #fff;
	}
	.routerView{
		border-radius: 6px; 
		border:1px solid #d8d8dd;
		margin-top: 10px; 
		flex: 1; 
		height: 100%;
		overflow: hidden;
		overflow-y: auto; 
		min-width: 1200px;
	}
	.btn{
		background-color: #000;
		color: #fff;
	}
	.nav{
		margin-top: 5px;
	}
	.nav li{
		display: inline-block;
	}
	.nav>li>a{
		    padding: 5px 10px;
	}
	.nav-tabs{
		border-bottom: none;
	}
	.isactive{
		color: #0681df;
	}
	.header-wp{
		padding: 20px 30px;
	}
	.row nav li{
		padding: 20px;
		color: #333;
		text-align: center;
		border-top: 3px solid #f4f4fb;
		border-bottom: 3px solid #f4f4fb;
		cursor: pointer;
		border-left: 6px solid #fff;
		position: relative;
	}
	.row nav li:hover{
		border-left: 6px solid #0681df;
		background: #f2f2f2;
	}
	.row nav li.active{
		border-left: 6px solid #0681df;
		background: #f2f2f2;
	}
	.row nav li i.right{
		background-image: url(./arrow.png);
	    display: block;
	    width: 8px;
	    height: 14px;
	    position: absolute;
	    right: 25px;
	    top: 25px;
	}
	.row nav li i.left{
		display: block;
		background: url(./right.png);
		width: 24px;
    	height: 24px;
    	position: absolute;
    	top:20px;
    	left: 25px;
	}
	.siderbar{
		padding-right:0;
		border: 1px solid #d8d8dd;
		margin-right: 20px;
		border-radius: 6px;
		margin-top: 10px;
		background: #fff;
		position: relative;
		height: 100%;
	}
	.breadcrumb li.active{
    	color: #0681df;
    }
	@media only screen and (min-width: 100px) and (max-width: 1650px) {
		.siderbar{
			width: 240px !important;
		}
		.routerView{
			min-width: 0;
		}
	}
</style>