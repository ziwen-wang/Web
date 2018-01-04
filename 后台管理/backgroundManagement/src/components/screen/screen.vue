
<template>
	<div style="background: #fff;" class="screen-wp">
		<div class="header">
			<ol class="breadcrumb" style="background: #fff;">
				<li>
					<router-link :to="{
						path:'/',
					}">项目数据</router-link>
				</li>
				<li>
					<router-link :to="{
						path:'/',
					}">项目检查结果</router-link>
				</li>
				<li class="active">{{routerName}}</li>
			</ol>
		</div>
		<div class="main">
			<ul class="row">
				<li class="col-xs-3">
					<div style="width: 100%; height: 100%; background: #f5f5f5;">
						<p style="font-size: 16px; color: #333;">状态</p>
						
						<div class="row" style="margin-top: 20px;">
							<span class="col-xs-5" style="line-height: 30px;" title="当前状态">当前状态</span>
							<div class="col-xs-7">
								<select class="form-control" v-model='stateModel.stateSelect' @change="a(stateModel.stateSelect)">
									<option selected value="ALL">全部状态</option>
									
								 	<option v-for="stateModel in stateModel.state" v-bind:value="stateModel.SD_ID">{{stateModel.SD_Name}}</option>
								</select>
							</div>
								
						</div>
						<div class="row" style="margin-top: 20px;">
							<span class="col-xs-5" style="line-height: 30px;" title="当前结果">当前结果</span>
							<div class="col-xs-7">
								<select class="form-control" v-model='stateModel.resultSelect' @change="a(stateModel.resultSelect)">
									<option selected value="ALL">全部结果</option>
								  	<option v-for="resultArr in stateModel.result" v-bind:value="resultArr.SD_ID">{{resultArr.SD_Name}}</option>
								</select>
							</div>
						</div>
						<div class="row" style="margin-top: 20px;">
							<span class="col-xs-5" style="line-height: 30px;" title="复检次数">复检次数</span>
							<div class="col-xs-7">
								<select class="form-control" v-model="stateModel.reviewSelect"  @change="a(stateModel.reviewSelect)">
									<option selected value="ALL">全部复检</option>
								  	<option v-for="reviewArr in stateModel.review" v-bind:value="reviewArr.val">{{reviewArr.txt}}</option>
								</select>
							</div>
						</div>
					</div>

				</li>
				<li class="col-xs-5">
					<div style="width: 100%; height: 100%; background: #f5f5f5;">
						<p style="font-size: 16px; color: #333;">操作</p>
						<div class="row" style="margin-top: 20px;">
							<span class="col-xs-3" style="line-height: 30px;" title="创建人">创建人</span>
							<div class="col-xs-5">
							 	<select class="form-control" v-model="operationModel.userCPSelect" @change="cpSelectChange(operationModel.userCPSelect,1)">
							 		<option selected value="ALL">全部公司</option>
								  	<option v-for="cp in operationModel.userCP" v-bind:value='cp.CP_Guid'>{{cp.CP_Name}}</option>
								</select>
							</div>
							
							<div class="col-xs-4">
								<select class="form-control" v-model="operationModel.userNameSelect" @change="a(operationModel.userName)">
									<option selected value="ALL">全部人员</option>
								  	<option v-for="name in operationModel.userName" v-bind:value="name.MB_Guid" v-if="operationModel.userName.length>0">{{name.User_Name}}</option>
								</select>
							</div>
							
						</div>
						
						<div class="row" style="margin-top: 20px;">
							<span class="col-xs-3" style="line-height: 30px;" title="创建时间">创建时间</span>
							<div class="input-group col-xs-9">
							  <input type="text" class="form-control select-time-input" placeholder="选择时间" id="selectTimeCJ" @focus="selectTimeChange(1)" v-model="selectTimeCJ">
							</div>
						</div>
						
						<div class="row" style="margin-top: 20px;">
							<span class="col-xs-3" title="最新状态操作人">最新状态操作人</span>
							<div class="col-xs-5">
							 	<select class="form-control" v-model="operationModel.newUserCPSelect" @change="cpSelectChange(operationModel.newUserCPSelect,2)">
							 		<option selected value="ALL">全部公司</option>
								  	<option v-for="newCp in operationModel.newUserCP" v-bind:value='newCp.CP_Guid'>{{newCp.CP_Name}}</option>
								</select>
							</div>
							
							<div class="col-xs-4">
								<select class="form-control" v-model="operationModel.newUserNameSelect">
									<option selected value="ALL">全部人员</option>
								  	<option v-for="name in operationModel.newUserName" v-bind:value="name.User_Guid" v-if="operationModel.newUserName.length>0">{{name.User_Name}}</option>
								</select>
							</div>
						</div>
						
						<div class="row" style="margin-top: 10px;">
							<span class="col-xs-3" title="最新状态操作时间">最新状态操作时间</span>
							<div class="input-group col-xs-9">
							  <input type="text" class="form-control select-time-input" placeholder="选择时间" id="selectTimeCZ" @focus="selectTimeChange(2)" v-model="selectTimeCZ">
							</div>
						</div>
					</div>

				</li>
				<li class="col-xs-4">
					<div style="width: 100%; height: 100%; background: #f5f5f5;">
						<p style="font-size: 16px; color: #333;">属性</p>
						<div class="row" style="margin-top: 10px;">
							<span class="col-xs-4" style="line-height: 30px;" title="问题类别">问题类别</span>
							<div class="col-xs-5">
								<select class="form-control" v-model="attributeModel.problemCategorySelect" @change="flChange(1)">
									<option selected value="ALL">全部</option>
									<option value="0">无分类</option>
								  	<option v-for="cate in attributeModel.problemCategory" v-bind:value="cate.PB_Guid">{{cate.PB_Name}}</option>
								</select>
							</div>
							<a href="javascript:;" class="col-xs-3" @click='maskerShow($event,1)' title="详细搜索">详细搜索</a>
						</div>
						
						<div class="row" style="margin-top: 20px;">
							<span class="col-xs-4" style="line-height: 30px;" title="问题位置">问题位置</span>
							<div class="col-xs-5">
								<select class="form-control" v-model="attributeModel.problemLocationSelect" @change="a(attributeModel.IFFlag)">
									<option selected value="ALL">全部位置</option>
								 	<template v-for="loc in attributeModel.problemLocation">
								 		<option v-bind:value="loc.BD_Guid" v-if="attributeModel.IFFlag == 0">{{loc.BD_Name}}</option>
								 		<option v-bind:value="loc.BD_Guid" v-else>{{loc.AName}}-{{loc.BD_Name}}</option>
								 	</template>
								</select>
							</div>
								
							<a href="javascript:;" class="col-xs-3" @click='maskerShow($event,2)' title="详细搜索">详细搜索</a>
							
						</div>
						
						<div class="row" style="margin-top: 20px;">
							<span class="col-xs-2 text-nowrap" style="line-height: 30px;" title="发生量级">发生量级</span>
							<div class="col-xs-4">
								<select class="form-control" v-model='attributeModel.magnitudeSelect' @change='a(attributeModel.magnitudeSelect)'>
									<option selected value="ALL">全部量级</option>
									<option value="0">未选择</option>
								  	<option v-for="magn in attributeModel.magnitude" v-bind:value="magn.SD_ID">{{magn.SD_Name}}</option>
								</select>
							</div>
							<span class="col-xs-2 text-nowrap" style="text-align: center; line-height: 30px;" title="严重程度">严重程度</span>
							<div class="col-xs-4">
								<select class="form-control" v-model="attributeModel.seriousSelect">
									<option selected value="ALL">全部</option>
									<option value="0">未选择</option>
								  	<option v-for="ser in attributeModel.serious" v-bind:value="ser.SD_ID">{{ser.SD_Name}}</option>
								</select>
							</div>
						</div>
						
						<div class="row" style="margin-top: 20px;">
							<span class="col-xs-2 text-nowrap" style="line-height: 30px;" title="完成程度">完成程度</span>
							<div class="col-xs-4">
								<select class="form-control" v-model="attributeModel.completeSelect">
									<option selected value="ALL">全部</option>
									<option value="0">未选择</option>
								  	<option v-for="com in attributeModel.complete" v-bind:value="com.SD_ID">{{com.SD_Name}}</option>
								</select>
							</div>
							<span class="col-xs-2 text-nowrap" style="text-align: center; line-height: 30px;" title="完成比例">完成比例</span>
							<div class="col-xs-4">
								<select class="form-control" v-model="attributeModel.proportionSelect" @change="a(attributeModel.proportionSelect)">
									<option selected value="ALL">全部</option>
									<option value="0">未选择</option>
								  	<option v-for="prop in attributeModel.proportion" v-bind:value="prop">{{prop}}%</option>
								</select>
							</div>
						</div>
					</div>
					
					
					
				</li>
			</ul>
		</div>
		<div style="display: none;position: fixed; top: 30px; right: 50px;z-index: 9;" class="masker-wp-1">
			<div style="background: #666; padding: 25px;display: flex;" class="masker-wp row ">
					<div style="width: 120px; margin-right: 10px;">
						<select class="form-control" v-model="attributeModel.problemCategorySelect" @change="flChange(1)">
							<option selected value="ALL">一级分类</option>
						  	<option v-for="cate in attributeModel.problemCategory" v-bind:value="cate.PB_Guid">{{cate.PB_Name}}</option>
						</select>
					</div>
					<div style="width: 120px; margin-right: 10px;">
						<select class="form-control" v-model="maskerModel.masker1.fl1Select" @change="flChange(2)">
							<option selected value="ALL">二级分类</option>
						  	<option v-for="cate in maskerModel.masker1.fl1" v-bind:value="cate.PB_Guid">{{cate.PB_Name}}</option>
						</select>
					</div>
					<div style="width: 120px; margin-right: 10px;">
						<select class="form-control" v-model="maskerModel.masker1.fl2Select" @change="flChange(3)">
							<option selected value="ALL">三级分类</option>
						  	<option v-for="cate in maskerModel.masker1.fl2" v-bind:value="cate.PB_Guid">{{cate.PB_Name}}</option>
						</select>
					</div>
					<div style="width: 120px; margin-right: 10px;">
						<select class="form-control" v-model="maskerModel.masker1.fl3Select" @change="flChange(4)">
							<option selected value="ALL">四级分类</option>
						  	<option v-for="cate in maskerModel.masker1.fl3" v-bind:value="cate.PB_Guid">{{cate.PB_Name}}</option>
						</select>
					</div>
					<div style="width: 120px; margin-right: 10px;">
						<select class="form-control" v-model="maskerModel.masker1.fl4Select" @change="flChange(5)">
							<option selected value="ALL">五级分类</option>
						  	<option v-for="cate in maskerModel.masker1.fl4" v-bind:value="cate.PB_Guid">{{cate.PB_Name}}</option>
						</select>
					</div>
					
					<span class="submitBtn" style="cursor: pointer; margin-top: 5px;" @click='maskerSubmit(".masker-wp-1")'>完成</span>
				
			</div>
		</div>
		
		<div style="display: none;position: fixed; top: 30px; right: 50px;z-index: 9;" class="masker-wp-2">
			<div style="background: #666; padding: 25px;display: flex;" class="masker-wp row">
				<div style="width: 120px; margin-right: 10px;">
					<select class="form-control" v-model="maskerModel.masker2.biaoduanSelect" @change="BDChange()" v-bind:disabled="maskerModel.masker2.biaoduanJudge">
						<option selected value="ALL">全部标段</option>
					  	<option v-for="cate in maskerModel.masker2.biaoduan" v-bind:value="cate.A_Guid">{{cate.AName}}</option>
					</select>
				</div>
				<div style="width: 120px; margin-right: 10px;">
					<select class="form-control" v-model="maskerModel.masker2.loudongSelect" @change="LDChange()">
						<option selected value="ALL">全部楼栋</option>
					  	<option v-for="cate in maskerModel.masker2.loudong" v-bind:value="cate.BD_Guid">{{cate.BD_Name}}</option>
					</select>
				</div>
				<div style="width: 120px; margin-right: 10px;">
					<select class="form-control" v-model="maskerModel.masker2.louceng1Select" @change="LCChange()">
						<option selected value="ALL">全部楼层</option>
					  	<option v-for="cate in maskerModel.masker2.louceng1" v-bind:value="cate.F_Guid">{{cate.FName}}</option>
					</select>
				</div>
				<div style="width: 120px; margin-right: 10px;">
					<select class="form-control" v-model="maskerModel.masker2.danyuan1Select" @change="DYChange()">
						<option selected value="ALL">全部单元</option>
					  	<option v-for="cate in maskerModel.masker2.danyuan1" v-bind:value="cate.U_Guid">{{cate.U_Name}}</option>
					</select>
				</div>
				<div style="width: 120px; margin-right: 10px;">
					<select class="form-control" v-model="maskerModel.masker2.huSelect" @change='a(maskerModel.masker2.huSelect)'>
						<option selected value="ALL">全部户</option>
					  	<option v-for="cate in maskerModel.masker2.hu" v-bind:value="cate.H_Guid">{{cate.H_Code}}</option>
					</select>
				</div>
				
				<span class="submitBtn" style="margin-left: 10px; cursor: pointer;margin-top: 5px;" @click='maskerSubmit(".masker-wp-2");masker2Click()'>完成</span>
			</div>
		</div>
		
		<footer style="margin-top: 20px;" class="row">
			<div class="screen row" style="padding: 0 30px;">
				<div class="col-xs-6">
					<span class="col-xs-2" style="padding-left: 0;">关键词搜索</span>
					<div class="input-group col-xs-5">
					  <input type="text" class="form-control select-time-input" placeholder="请输入检查结果标题或位置关键词" v-model="keyWordTxt" @change="a(keyWordTxt)" @keyup.enter="submitSearch">
					</div>
				</div>
				<div class="col-xs-6">
					<div class="col-xs-5 pull-right">
						<button type="button" class="btn btn-primary col-xs-5" style="margin-right: 20px;" @click="reset">重置</button>
						<button type="button" class="btn btn-primary col-xs-5" @click='submitSearch()'>搜索</button>
					</div>
				</div>
				
			</div>
			<div class="col-xs-12" style="margin-top: 20px; padding: 0 30px;">
				<h1 style="margin-bottom: 20px; font-size: 14px;">共计{{tableCount}}条检查结果数据</h1>
				<table class="table table-bordered table-hover">
					<thead>
						<tr>
							<th v-for='theaderTxt in tableHeader'>{{theaderTxt}}</th>
						</tr>
					</thead>
					<tbody v-if='tableBody.center.length>0'>
						<tr v-for='(tbodyArr,index1) in tableBody.center' @click="trClick(tbodyArr)">
							<td>{{tbodyArr.Row}}</td>
							<td v-bind:title="tbodyArr.PBOne+tbodyArr.PBTwo+tbodyArr.PBThree+tbodyArr.PBFour+tbodyArr.PBFive">
								{{tbodyArr.RIP_Name}}
								<div v-if="tbodyArr.CompletionNum != null && tbodyArr.CompletionNum != '' && tbodyArr.CompletionNum != 0">
									<!--<ul>
										<li>{{tbodyArr.ResultName}}</li>
										<li>{{tbodyArr.PBOne}}</li>
										<li>{{tbodyArr.DistributName}}</li>
										<li>{{tbodyArr.QuestionName}}</li>
										<li>{{tbodyArr.SeverityName}}</li>
									</ul>-->
									{{tbodyArr.ResultName}} {{tbodyArr.PBOne}} {{tbodyArr.DistributName}} {{tbodyArr.SeverityName}} {{tbodyArr.PlanDegreeName}} {{tbodyArr.CompletionNum}}% {{tbodyArr.QuestionName}} 
								</div>
								<div v-else>
									{{tbodyArr.ResultName}} {{tbodyArr.PBOne}} {{tbodyArr.DistributName}} {{tbodyArr.QuestionName}} {{tbodyArr.SeverityName}}  {{tbodyArr.PlanDegreeName}} 
								</div>
							</td>
							<td v-bind:title="tbodyArr.RIP_Position"><span style="display: inline-block; width: 100%;word-wrap:break-word;overflow: hidden;text-overflow: ellipsis;">{{tbodyArr.RIP_Position}}</span></td>
							<td>{{tbodyArr.RectificationNum}}</td>
							<td>{{tbodyArr.CreatedUser}}</td>
							<td>{{dateFormat(tbodyArr.HCIC_AddDate)}}</td>
							<td>{{tbodyArr.NewUser}}</td>
							<td>{{dateFormat(tbodyArr.RU_CreatedTime)}}</td>
							<td>{{tbodyArr.TreatmentMethodName}}</td>
							<td>{{tbodyArr.RIP_Time}}</td>
							<!--<td v-else  v-bind="{ title: titleFilter(index,index1)}">{{theaderTxt}}</td>-->
						</tr>
					</tbody>
						
				</table>
			</div>
			
		</footer>
		<div class="loading-wp" v-show="maskerJudge">
	        <svg version="1.1" id="L2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				  viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve" style="width: 100px; position: absolute;top: 0;left: 0;right: 0;
				  bottom: 0; margin: auto;">
				<circle fill="none" stroke="#fff" stroke-width="4" stroke-miterlimit="10" cx="50" cy="50" r="48"/>
				<line fill="none" stroke-linecap="round" stroke="#fff" stroke-width="4" stroke-miterlimit="10" x1="50" y1="50" x2="85" y2="50.5">
				  <animateTransform 
				       attributeName="transform" 
				       dur="2s"
				       type="rotate"
				       from="0 50 50"
				       to="360 50 50"
				       repeatCount="indefinite" />
				</line>
				<line fill="none" stroke-linecap="round" stroke="#fff" stroke-width="4" stroke-miterlimit="10" x1="50" y1="50" x2="49.5" y2="74">
				  <animateTransform 
				       attributeName="transform" 
				       dur="15s"
				       type="rotate"
				       from="0 50 50"
				       to="360 50 50"
				       repeatCount="indefinite" />
				</line>
			</svg>
	    </div>
	   	<div class="col-xs-12">
			<page :total="tableCount" :max='Math.ceil(tableCount/pageIndex)' @changePage='changePage'></page>
		</div>
	</div>

</template>

<script>
	
	import page from '../pageView/pageView'
	export default {
		name: 'Screen',
		components:{
			page
		},
		data() {
			return {
				newDate:new Date(),
				tableHeader:['','检查结果','位置','复检次数','创建人','创建时间','最新状态操作人','操作时间','处理指令','最新整改时限'],
				tableBody:{
					center:[]
				},
				tableCount:0,
				stateModel:{
					state:[],//状态
					stateSelect:'ALL',
					result:[],//结果
					resultSelect:'ALL',
					review:[{txt:'0',val:0},{txt:'1',val:1},{txt:'2',val:2},{txt:'3',val:3},{txt:'4次及以上',val:4}],//附件,
					reviewSelect:'ALL'
				},
				routerItem:[],
				operationModel:{
					userName:[],
					userNameSelect:'ALL',
					userCP:[],
					userCPSelect:'ALL',
					newUserName:[],
					newUserNameSelect:'ALL',
					newUserCP:[],
					newUserCPSelect:'ALL'
				},
				attributeModel:{
					magnitude:[],//量级
					magnitudeSelect:'ALL',
					serious:[],//严重
					seriousSelect:'ALL',
					complete:[],
					completeSelect:'ALL',
					proportion:[],
					proportionSelect:'ALL',
					problemCategory:[],//问题类别
					problemCategorySelect:'ALL',
					problemLocation:[],
					problemLocationSelect:'ALL',
					IFFlag:0,
					
				},
				selectTimeCJ:'',
				selectTimeCZ:'',
				keyWordTxt:'',
				maskerModel:{
					masker1:{
						fl1:[],
						fl2:[],
						fl3:[],
						fl4:[],
						fl5:[],
						fl1Select:'ALL',
						fl2Select:'ALL',
						fl3Select:'ALL',
						fl4Select:'ALL',
						fl5Select:'ALL',
					},
					masker2:{
						biaoduan:[],
						biaoduanSelect:'ALL',
						loudong:[],
						loudongSelect:'ALL',
						louceng1:[],
						louceng1Select:'ALL',
						danyuan1:[],
						danyuan1Select:'ALL',
						hu:[],
						huSelect:'ALL',
						biaoduanJudge:false,
						
						
					}
				},
				routerName:'',
				pageIndex:8,//条数
				pageSize:1,//页码
				maskerJudge:true
				
			}
		},
		methods: {
			reset:function(){
				var _this = this
				this.keyWordTxt = ''
				this.stateModel.stateSelect = 'ALL'
				this.stateModel.resultSelect = 'ALL'
				this.stateModel.reviewSelect = 'ALL'
				this.operationModel.userNameSelect = 'ALL'
				this.operationModel.userCPSelect = 'ALL'
				this.operationModel.newUserNameSelect = 'ALL'
				this.operationModel.newUserCPSelect = 'ALL'
				this.attributeModel.magnitudeSelect = 'ALL'
				this.attributeModel.seriousSelect = 'ALL'
				this.attributeModel.completeSelect = 'ALL'
				this.attributeModel.proportionSelect = 'ALL'
				this.attributeModel.problemCategorySelect = 'ALL'
				this.attributeModel.problemLocationSelect = 'ALL'
				this.selectTimeCJ = ''
				this.selectTimeCZ = ''
				
				this.maskerModel.masker1.fl1Select = 'ALL'
				this.maskerModel.masker1.fl2Select = 'ALL'
				this.maskerModel.masker1.fl3Select = 'ALL'
				this.maskerModel.masker1.fl4Select = 'ALL'
				this.maskerModel.masker1.fl5Select = 'ALL'
				
				this.maskerModel.masker2.biaoduanSelect = 'ALL'
				this.maskerModel.masker2.loudongSelect = 'ALL'
				this.maskerModel.masker2.louceng1Select = 'ALL'
				this.maskerModel.masker2.danyuan1Select = 'ALL'
				this.maskerModel.masker2.huSelect = 'ALL'
				this.pageSize = 1
				
				
				
				
			},
			changePage:function(a){
				this.PageSize = a
				this.submitSearch()
			},
			dateFormat:function(date){
				if(date == null || date == '' || date == undefined){
					return ''
				}else{
					return date.split('T').join(' ')
				}
			},
			masker2Click:function(){
				var _this = this
				_this.attributeModel.problemLocation.forEach(function(loc){
					if(loc.A_Guid == _this.maskerModel.masker2.biaoduanSelect){
						_this.attributeModel.problemLocationSelect = loc.BD_Guid
					}
					
				})
				
			},
			trClick:function(tbodyArr){
				console.log(tbodyArr.RIP_GUID)
				this.$router.push({
					path:'/detail',
					name:'detail',
					query:{
						RIP_Guid:tbodyArr.RIP_GUID,
						RIP_Name:tbodyArr.RIP_Name
					}
				})
			},
			cpSelectChange:function(guid,judge){
				var _this = this
				if(judge == 1){
					if(guid == 'ALL'){
						_this.operationModel.userName = []
						_this.operationModel.userNameSelect = 'ALL'
						return false
					}
					_this.operationModel.userCP.forEach(function(cpGuid){
						
						if(cpGuid.CP_Guid == guid){
							_this.operationModel.userName = cpGuid.list
						}
						
					})
				}else{
					if(guid == 'ALL'){
						_this.operationModel.newUserName = []
						_this.operationModel.newUserNameSelect = 'ALL'
						return false
					}
					_this.operationModel.userCP.forEach(function(cpGuid){
						
						if(cpGuid.CP_Guid == guid){
							_this.operationModel.newUserName = cpGuid.list
						}
						
					})
				}
				
				
				
			},
			a:function(aaa){
				console.log(aaa)
			},
			BDChange:function(){//标段
				var _this = this
				$.post(api+'/DataRIP_ProblemInfo/GetBDData',{A_Guid:_this.maskerModel.masker2.biaoduanSelect},function(rep){
					_this.maskerModel.masker2.loudong = rep.list
				},'json')
			},
			LDChange:function(){//楼栋
				var _this = this
				$.post(api+'/DataRIP_ProblemInfo/GetPFData',{BD_Guid:_this.maskerModel.masker2.loudongSelect},function(rep){
					
					_this.maskerModel.masker2.louceng1 = rep.list
				},'json')
				$.post(api+'/DataRIP_ProblemInfo/GetUData',{BD_Guid:_this.maskerModel.masker2.loudongSelect},function(rep){
					console.log(rep)
					_this.maskerModel.masker2.danyuan1 = rep.list
				},'json')
			},
			LCChange:function(){//楼层
				var _this = this				
				if(_this.maskerModel.masker2.danyuan1Select == 'ALL' || _this.maskerModel.masker2.louceng1Select == 'ALL'){
					return false
				}

				var data = {
					U_Guid:_this.maskerModel.masker2.danyuan1Select,
					F_Guid:_this.maskerModel.masker2.louceng1Select
				}
				$.post(api+'/DataRIP_ProblemInfo/GetFUData',data,function(rep){
					var data = {
						UF_Guid:rep.list[0].UF_Guid
					}
					$.post(api+'/DataRIP_ProblemInfo/GetHData',data,function(rep){
						_this.maskerModel.masker2.hu = rep.list
					},'json')
				},'json')
				
			},
			DYChange:function(){
				var _this = this				
				if(_this.maskerModel.masker2.danyuan1Select == 'ALL' || _this.maskerModel.masker2.louceng1Select == 'ALL'){
					return false
				}
				var data = {
					U_Guid:_this.maskerModel.masker2.danyuan1Select,
					F_Guid:_this.maskerModel.masker2.louceng1Select
				}
				$.post(api+'/DataRIP_ProblemInfo/GetFUData',data,function(rep){
					var data = {
						UF_Guid:rep.list[0].UF_Guid
					}
					$.post(api+'/DataRIP_ProblemInfo/GetHData',data,function(rep){
						_this.maskerModel.masker2.hu = rep.list
					},'json')
				},'json')
			},
			getQueryString: function (name) {
	            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	            var r = window.location.search.substr(1).match(reg);
	            if (r != null) return unescape(r[2]); return null
	        },
			titleFilter:function(index,index1){
				var _this = this
				if(index == 1 || index == 2){
					if(index == 1){
						return _this.tableBody.hoverTxt.txt[index1]
					}else{
						return _this.tableBody.hoverTxt.location[index1]
					}
				}
			},
			formatDate: function (date) {
	            var myyear = date.getFullYear();
	            var mymonth = date.getMonth() + 1;
	            var myweekday = date.getDate();
	            if (mymonth < 10) {
	                mymonth = "0" + mymonth;
	            }
	            if (myweekday < 10) {
	                myweekday = "0" + myweekday;
	            }
	            return (myyear + "-" + mymonth + "-" + myweekday);
	        },
	        //获得某月的天数
	        getMonthDays: function (myMonth) {
	            var _this = this
	            var nowYear = _this.newDate.getFullYear()
	            var nowMonth = _this.newDate.getMonth()
	            var monthStartDate = new Date(nowYear, myMonth, 1);
	            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
	            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
	            return days;
	        },
	        //获得本月的开始日期
	        getMonthStartDate: function () {
	            var _this = this
	            var nowYear = _this.newDate.getFullYear()
	            var nowMonth = _this.newDate.getMonth()
	            var monthStartDate = new Date(nowYear, nowMonth, 1);
	            return monthStartDate;
	        },
	        //获得本月的结束日期
	        getMonthEndDate: function () {
	            var _this = this
	            var nowYear = _this.newDate.getFullYear()
	            var nowMonth = _this.newDate.getMonth()
	
	            var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
	            return _this.formatDate(monthEndDate);
	        },
	        //获得上月开始时间
	        getLastMonthStartDate: function (nub) {
	            var _this = this
	            var nowYear = _this.newDate.getFullYear()
	            var lastMonthDate = new Date(); //上月日期
	            lastMonthDate.setDate(1);
	            lastMonthDate.setMonth(lastMonthDate.getMonth() - nub);
	            var lastMonth = lastMonthDate.getMonth();
	            var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
	            return lastMonthStartDate;
	        },
	        //获得上月结束时间
	        getLastMonthEndDate: function (nub) {
	            var _this = this
	            var nowYear = _this.newDate.getFullYear()
	            var lastMonthDate = new Date(); //上月日期
	            lastMonthDate.setDate(1);
	            lastMonthDate.setMonth(lastMonthDate.getMonth() - nub);
	            var lastMonth = lastMonthDate.getMonth();
	            var lastMonthEndDate = new Date(nowYear, lastMonth, _this.getMonthDays(lastMonth));
	            return lastMonthEndDate;
	        },
			getLastWeekStartDate: function (n) {
	            /*
	        	 //上周的开始时间
				console.log(getTime(7));
				//上周的结束时间
				console.log(getTime(1));
				//本周的开始时间
				console.log(getTime(0));
				//本周的结束时间
				console.log(getTime(-6));
	        	 * */
	            var now = new Date();
	            var year = now.getFullYear();
	            //因为月份是从0开始的,所以获取这个月的月份数要加1才行
	            var month = now.getMonth() + 1;
	            var date = now.getDate();
	            var day = now.getDay();
	            //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
	            if (day !== 0) {
	                n = n + (day - 1);
	            } else {
	                n = n + day;
	            }
	            if (day) {
	                if (month > 1) {
	                    month = month;
	                } else {//这个判断是为了解决跨年的问题,月份是从0开始的
	                    year = year - 1;
	                    month = 12;
	                }
	            }
	            now.setDate(now.getDate() - n);
	            year = now.getFullYear();
	            month = now.getMonth() + 1;
	            date = now.getDate();
	            var s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
	            return now;
	        },
	        SelectTimerFilter: function (date, days) {
	            var d = new Date(date);
	            d.setDate(d.getDate() + days);
	            var month = d.getMonth() + 1;
	            var day = d.getDate();
	            return d;
	
	        },
	        maskerShow:function(el,nub){
	        	var $el = $(el)
	        	if(nub == 1){
	        		$('.masker-wp-1').css('top',($el[0].y+30)+'px')
	        		$('.masker-wp-1').toggle()
	        	}else{
	        		$('.masker-wp-2').css('top',($el[0].y+30)+'px')
	        		$('.masker-wp-2').toggle()
	        	}
	        	
	        },
	        maskerSubmit:function(event){
	        	$(event).hide()
	        },
	        flChange:function(judge){
	        	var _this = this
	        	if(judge == 1){
	        		if(_this.attributeModel.problemCategorySelect == 'ALL'){
	        			return false
	        		}
//	        		_this.attributeModel.problemCategorySelect
	        		_this.attributeModel.problemCategory.forEach(function(cate){
	        			if(cate.PB_Guid == _this.attributeModel.problemCategorySelect){
	        				_this.maskerModel.masker1.fl1 = cate.One
	        			}
	        			
	        		})
	        		
	        	}else if(judge == 2){
	        		if(_this.maskerModel.masker1.fl1Select == 'ALL'){
	        			return false
	        		}
	        		_this.maskerModel.masker1.fl1.forEach(function(fl){
	        			if(fl.PB_Guid == _this.maskerModel.masker1.fl1Select){
	        				_this.maskerModel.masker1.fl2 = fl.Two
	        			}
	        		})
	        	}else if(judge == 3){
	        		if(_this.maskerModel.masker1.fl2Select == 'ALL'){
	        			return false
	        		}
	        		_this.maskerModel.masker1.fl2.forEach(function(fl){
	        			if(fl.PB_Guid == _this.maskerModel.masker1.fl2Select){
	        				_this.maskerModel.masker1.fl3 = fl.Three
	        			}
	        		})
	        	}else if(judge == 4){
	        		if(_this.maskerModel.masker1.fl3Select == 'ALL'){
	        			return false
	        		}
	        		_this.maskerModel.masker1.fl3.forEach(function(fl){
	        			if(fl.PB_Guid == _this.maskerModel.masker1.fl3Select){
	        				_this.maskerModel.masker1.fl4 = fl.Four
	        			}
	        		})
	        	}else{
	        		if(_this.maskerModel.masker1.fl4Select == 'ALL'){
	        			return false
	        		}
	        		_this.maskerModel.masker1.fl4.forEach(function(fl){
	        			if(fl.PB_Guid == _this.maskerModel.masker1.fl4Select){
	        				_this.maskerModel.masker1.fl5 = fl.Five
	        			}
	        		})
	        	}
	        },
	        submitSearch:function(judge){
	        	var _this = this
	        	var CreatedTime,newCreatedTime;
	        	if(_this.selectTimeCJ != '' && _this.selectTimeCJ != undefined){
	        		CreatedTime = _this.selectTimeCJ.split('-')
	        	}else{
	        		CreatedTime = ['ALL','ALL']
	        	}
	        	console.log(_this.selectTimeCZ)
	        	if(_this.selectTimeCZ != '' && _this.selectTimeCZ != undefined){
	        		newCreatedTime = _this.selectTimeCZ.split('-')
	        	}else{
	        		newCreatedTime = ['ALL','ALL']
	        	}
	        	var data = {
	        		P_Guid:_this.$route.query.P_Guid,
	        		QuestionState:_this.stateModel.stateSelect,//当前状态
	        		ResultType:_this.stateModel.resultSelect,//结果
	        		CheckNum:_this.stateModel.reviewSelect,//复检次数
	        		MB_Guid:_this.operationModel.userNameSelect,
	        		CP_Guid:_this.operationModel.userCPSelect,
	        		NewCP_Guid:_this.operationModel.newUserCPSelect,
	        		NewMB_Guid:_this.operationModel.newUserNameSelect,
	        		CreatedStartTime:CreatedTime[0],
	        		CreatedStartEnd:CreatedTime[1],
	        		NewCreatedStartTime:newCreatedTime[0],
	        		NewCreatedStartEnd:newCreatedTime[1],
	        		KeyWord:_this.keyWordTxt,
	        		PB_GuidOne:_this.maskerModel.masker1.fl1Select,
	        		PB_GuidTwo:_this.maskerModel.masker1.fl2Select,
	        		PB_GuidThree:_this.maskerModel.masker1.fl3Select,
	        		PB_GuidFour:_this.maskerModel.masker1.fl4Select,
	        		PB_GuidFive:_this.maskerModel.masker1.fl5Select,
	        		A_Guid:_this.maskerModel.masker2.biaoduanSelect,
	        		BD_Guid:_this.maskerModel.masker2.loudongSelect,
	        		F_Guid:_this.maskerModel.masker2.louceng1Select,
	        		U_Guid:_this.maskerModel.masker2.danyuan1Select,
	        		H_Guid:_this.maskerModel.masker2.huSelect,
	        		PBlist:_this.attributeModel.problemCategorySelect,
	        		DBlist:_this.attributeModel.problemLocationSelect,
	        		Distribut:_this.attributeModel.magnitudeSelect,
	        		PlanDegree:_this.attributeModel.completeSelect,
	        		Severity:_this.attributeModel.seriousSelect,
	        		CompletionNum:_this.attributeModel.proportionSelect,//完成比例
	        		PageIndex:_this.pageIndex,
	        		PageSize:_this.PageSize,
	        	}
	        	if(data.P_Guid == '' || data.P_Guid == undefined || data.P_Guid == null){
	        		data.P_Guid = window.localStorage.getItem('P_Guid')
	        	}
	        	//http://192.168.1.157:8082/DataRIP_ProblemInfo/GetRIPData  
	        	//http://localhost:29696/DataRIP_ProblemInfo/GetRIPData
	        	
	        	if(!judge){
	        		console.log('wzwzwzwzwzwzwzwzw')
        			_this.maskerJudge = true
        		}
	        	$.post(api+'/DataRIP_ProblemInfo/GetRIPData',data,function(rep){
	        		_this.tableCount = rep.Count
	        		_this.tableBody.center = rep.list
        			_this.maskerJudge = false
	        		
	        	},'json')
	        },
	        selectTimeChange:function(judge){
	        	var _this = this
	        	var starTimer,endTimer;
				if (_this.newDate.getDay() == 1) {
	                starTimer = _this.SelectTimerFilter(this.getLastWeekStartDate(-1), -7)
	                endTimer = _this.SelectTimerFilter(this.getLastWeekStartDate(-7), -7)
	            } else {
	                starTimer = _this.getLastWeekStartDate(-1)
	                endTimer = _this.getLastWeekStartDate(-7)
	            }
	        	if(judge == 1){
	        		$("#selectTimeCJ").daterangepicker(
	        			{
							ranges: {
								'本周': [starTimer, endTimer],
								'上周': [_this.SelectTimerFilter(_this.getLastWeekStartDate(6), -7), _this.SelectTimerFilter(_this.getLastWeekStartDate(0), -7)],
								'本月': [_this.getMonthStartDate(), _this.newDate],
								'上月': [_this.getLastMonthStartDate(1), _this.getLastMonthEndDate(1)],
								'近三月': [_this.getLastMonthStartDate(3), _this.newDate],
							},
							locale : {  
			                    applyLabel : '确定',  
			                    cancelLabel : '取消',  
			                    fromLabel : '起始时间',  
			                    toLabel : '结束时间',  
			                    customRangeLabel : '自定义',  
			                    daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],  
			                    monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',  
			                            '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
			                    firstDay : 1  
			               },
		//					startDate: moment(),
		//					endDate: moment().endOf('month')
						},
						
						function(start, end) {
							_this.selectTimeCJ = start.format('YYYY/MM/DD') + "-" + end.format('YYYY/MM/DD')
						}
					);
	        	}else{
	        		$("#selectTimeCZ").daterangepicker(
	        			{	ranges: {
								'本周': [starTimer, endTimer],
								'上周': [_this.SelectTimerFilter(_this.getLastWeekStartDate(6), -7), _this.SelectTimerFilter(_this.getLastWeekStartDate(0), -7)],
								'本月': [_this.getMonthStartDate(), _this.newDate],
								'上月': [_this.getLastMonthStartDate(1), _this.getLastMonthEndDate(1)],
								'近三月': [_this.getLastMonthStartDate(3), _this.newDate],
							},
							locale : {  
			                    applyLabel : '确定',  
			                    cancelLabel : '取消',  
			                    fromLabel : '起始时间',  
			                    toLabel : '结束时间',  
			                    customRangeLabel : '自定义',  
			                    daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],  
			                    monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',  
			                            '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
			                    firstDay : 1  
			             },
						},
						
						function(start, end) {
							_this.selectTimeCZ= start.format('YYYY/MM/DD') + "-" + end.format('YYYY/MM/DD')
						}
					);
	        	}
	        }
		},
		mounted:function (){
			var _this = this
            this.$nextTick(function () {
            	
	        		$('#selectTimeCJ').on('cancel.daterangepicker', function(ev, picker) {
	        			console.log(1)
				      	$('#selectTimeCJ').val('');
					  });
				
				 	$('#selectTimeCZ').on('cancel.daterangepicker', function(ev, picker) {
				  	    $('#selectTimeCZ').val('');
				 	 });
				
					$('.siderbar').hide()
					$('.table thead th').eq(1).addClass('col-xs-3')
					$('.table thead th').eq(2).addClass('col-xs-2')
			
			})
            try{
            	this.routerName = this.$route.query.routerItem.routerName
//          	window.localStorage.setItem('screenRouterName',this.$route.query.routerItem.routerName)
            	this.routerName = this.$route.query.routerItem.routerName
				if(this.routerName == '' || this.routerName == undefined || this.routerName == null){
					this.routerName = window.localStorage.getItem('screenRouterName')
					console.log(window.localStorage.getItem('screenRouterName'))
				}else{
					window.localStorage.setItem('screenRouterName',this.$route.query.routerItem.routerName)
				}
            }catch(e){
            	this.routerName = window.localStorage.getItem('screenRouterName')
            }
//          console.log(this.$route.query.routerItem.routerName)
            
            	
				
			

		},
		created: function(){
			var _this = this
			console.log(_this.$route.query.P_Guid)
			for(var i = 5;i<100;i+=5){
				_this.attributeModel.proportion.push(i)
			}
			var data = {
				P_Guid:this.$route.query.P_Guid
			}
			
			if(data.P_Guid == undefined || data.P_Guid == '' || data.P_Guid == null){
				data.P_Guid = window.localStorage.getItem('P_Guid')
			}else{
				window.localStorage.setItem('P_Guid',this.$route.query.P_Guid)
			}
			$.post(api+'/DataRIP_ProblemInfo/GetBangData',data,function(rep){
				
				_this.stateModel.state = rep.list.QuestionState
				_this.stateModel.result = rep.list.ResultType
				
				_this.operationModel.userCP = rep.list.User
				_this.operationModel.newUserCP = rep.list.User
				
				_this.attributeModel.magnitude = rep.list.Distribut
				_this.attributeModel.serious = rep.list.Severity
				_this.attributeModel.complete = rep.list.PlanDegree
				_this.attributeModel.problemCategory = rep.list.pblist
				$.post(api+'/DataRIP_ProblemInfo/GetAData',data,function(rep){
					_this.attributeModel.IFFlag = rep.IFFlag
					_this.attributeModel.problemLocation = rep.list
					if(rep.IFFlag == 0){
						_this.maskerModel.masker2.biaoduanJudge = true
						_this.maskerModel.masker2.loudong = rep.list
					}else{
						_this.maskerModel.masker2.biaoduanJudge = false
						_this.maskerModel.masker2.biaoduan = rep.list
					}
					_this.submitSearch(1)
					
				},'json')
			},'json')
			
			
			
		}
	}
</script>

<style>
	input:focus{
		outline: none;
	}
	* {
		color: #666;
	}
	
	.breadcrumb {
		padding: 20px 15px;
		background-color: #fff;
	}
	
	.breadcrumb>.active {
		color: #0681df;
	}
	
	.breadcrumb li {
		color: #666;
	}
	
	.main>ul>li {
		height: 270px;
	}
	.main>ul>li>div{
		padding:20px 20px;
	}
	.btn-group>.btn:first-child {
		margin-left: 0;
		width: 100%;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    padding: 3px 12px;
	    padding-right: 30px;
	}
	
	.btn-group {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		padding: 0;
	}
	.btn .caret {
        position: absolute;
	    top: 0;
	    bottom: 0;
	    right: 10px;
	    margin: auto;
	}
	.input-group .select-time-input{
		border-radius: 4px !important;
		height: 30px;
	}
	a{
		color: #0a7fd8;
	}
	.table thead th{
		background: #666666;
		color: #fff;
	}
	/*.table thead th:nth-child(2){
		min-width: 300px;
	}
	.table thead th:nth-child(3){
		width: 300px;
	}*/
	.masker-wp {
		border-radius: 6px;
		display: none;
	}
	.submitBtn {
		color: #fff;
	}
	.screen-wp tbody td{
		height: 80px;
		position: relative;
	}
	tbody td div{
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
	    height: 25px;
	    line-height: 25px;
	    background: #ccc;
	    padding-left: 10px;
	    white-space: nowrap
	}
	.table tbody>tr>td:nth-child(2){
		padding-left: 0;
		padding-right: 0;
		padding-bottom: 0;
	}
	tbody td div li{
		float: left;
		margin-left: 5px;
	}
	.screen-wp .loading-wp {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: rgba(0,0,0,.8);
            z-index: 999;
    }
    .breadcrumb a{
    	color: #666;
    }
    .breadcrumb li.active{
    	color: #0681df;
    }
    @media only screen and (min-width: 100px) and (max-width: 1200px) {
    	.row span,.row a{
    		/*overflow: hidden;
    		text-overflow: ellipsis;
    		white-space:nowrap;*/
    		font-size: 10px;
    		
    	}
    	/*.table thead th:nth-child(2) {
		    min-width: 250px;
		    width: 250px;
		}
		.table thead th:nth-child(3) {
		    width: 190px;
		}*/
    }
</style>