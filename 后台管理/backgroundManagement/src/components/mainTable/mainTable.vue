<template>
	<div class="mainTable-wp">
		<div class="header">
			<ol class="breadcrumb" style="background: #fff;">
				<li>
					<a href="javascript:;">项目数据</a>
				</li>
				<li class="active">
					项目检查结果
				</li>
			</ol>
		</div>
		
		<div class="center row">
			<div class="col-xs-4">
				<input type="text" class="form-control" placeholder="输入项目名称或所属单位" v-model="keyWord">
			</div>
			<div class="col-xs-2">
				<button type="button" class="btn btn-primary" @click="chaxun()">查询</button>
			</div>
			<div class="col-xs-12">
				<table class="table table-bordered table-hover">
					<thead>
						<tr>
							<th v-for="header in tableHeader">{{header}}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="table in tableBody">
							<td>{{table.P_Name}}</td>
							<td>{{table.CP_Name}}</td>
							<td>{{table.ProvinceName}}-{{table.CityName}}</td>
							<td>{{table.ripnum}}</td>
							<td>{{table.usernum}}</td>
							<td>
								<!--<a v-link="{path: '/screen'}">查看数据</a>-->
								<router-link :to="{
									path:'/screen',
									 query : { 
							            P_Guid : table.P_Guid,
							            routerItem:{
							            	routerName:table.P_Name
							            }
							        }
								}">查看数据</router-link>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			
		</div>
	</div>
</template>

<script>
//	import page from '../pageView/pageView'
	export default{
		name:'mainTable',
//		components:{
//			page
//		},
		data(){
			return {
				tableHeader:['项目名称','所属公司','所在地区','当前检查结果数','当前项目人员数','操作'],
				tableBody:[],
				keyWord:''
			}
		},
		methods:{
			changePage:function (page){ 
				console.log(page)
			},
			chaxun:function(){
				var _this = this
				var data = {
					MB_Guid:'',
					PU_UserType:'',
					keyWord:_this.keyWord
				};
				if(this.$route.query.MB_Guid == '' || this.$route.query.MB_Guid == undefined){
					this.$router.push({
						path:'/login',
						name:'login'
					})
					return false
				}else{
					data.MB_Guid = this.$route.query.MB_Guid
				}
				if(this.$route.query.usertype == '' || this.$route.query.usertype == undefined){
					this.$router.push({
						path:'/login',
						name:'login'
					})
					return false
				}else{
					data.PU_UserType = this.$route.query.usertype
				}
				$.post(api+'/ProJectData/GetProjectList',data,function(re){
					_this.tableBody = re.list.Table
				},'json')
			}
		},
		mounted:function(){
			var _this = this
			var data = {
				MB_Guid:'',
				PU_UserType:'',
				keyWord:_this.keyWord
			};
			if(this.$route.query.MB_Guid == '' || this.$route.query.MB_Guid == undefined){
				this.$router.push({
					path:'/login',
					name:'login'
				})
				return false
			}else{
				data.MB_Guid = this.$route.query.MB_Guid
			}
			if(this.$route.query.usertype == '' || this.$route.query.usertype == undefined){
				this.$router.push({
					path:'/login',
					name:'login'
				})
				return false
			}else{
				data.PU_UserType = this.$route.query.usertype
			}
			$.post(api+'/ProJectData/GetProjectList',data,function(re){
				_this.tableBody = re.list.Table
			},'json')
		}
	}
</script>

<style>
	.mainTable-wp{
		background: #fff;
	}
	.breadcrumb{
		background: #fff;
		padding: 20px 15px;
		margin-bottom: 0;
	}
	.mainTable-wp .header{
		border: 1px solid #F2F2F2;
	}
	.mainTable-wp .center{
		padding: 20px 30px;
	}
	.mainTable-wp table{
		margin-top: 20px;
	}
	.mainTable-wp table th{
		background: #666;
		color: #fff;
		text-align: center;
	}
	.mainTable-wp table tbody td{
		text-align: center;
		color: #333;
	}
	.mainTable-wp table tbody td a{
		color: #0681df;
		cursor: pointer;
	}
	.breadcrumb a{
    	color: #666;
    }
    .breadcrumb li.active{
    	color: #0681df;
    }
</style>