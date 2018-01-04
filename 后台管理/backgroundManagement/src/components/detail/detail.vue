<template>
	<div class="detail-wp">
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
				<li>
					<router-link :to="{
						path:'/screen',
					}">{{routerItem.screen}}</router-link>
				</li>
				<li class="active">{{routerItem.new}}</li>
			</ol>
			<h1>问题标题</h1>
			<p><span>{{topModel.OverText}}</span></p>
		</div>
		<div class="w100">
			<div class="row">
				<div class="col-xs-3">
					<h2>状态</h2>
					<ul>
						<li>当前状态：{{topModel.QuestionName}}</li>
						<li>当前结果：{{topModel.ResultName}}</li>
						<li>复检次数：{{topModel.RectificationNum}}次</li>
					</ul>
					<div class="line"></div>
				</div>
				<div class="col-xs-5 two">
					<h2>操作</h2>
					<ul>
						<li>创建人：{{topModel.CreatedUser}}</li>
						<li>创建时间：{{topModel.HCIC_AddDate}}</li>
						<li>最新状态操作人：{{topModel.NewUser}}</li>
						<li>最新状态操作时间：{{topModel.RU_CreatedTime}}</li>
					</ul>
					<div class="line"></div>
				</div>
				<div class="col-xs-4 three">
					<h2>属性</h2>
					<ul>
						<li>问题类别：{{topModel.PBItems}}</li>
						<li>问题位置：{{topModel.RIP_Position}}</li>
						<li><span>发生量级：{{topModel.DistributName}}</span><span style="margin-left: 20px;">严重程度：{{topModel.SeverityName}}</span></li>
						<li>处理指令：{{topModel.TreatmentMethodName}}</li>
					</ul>
				</div>
			</div>
		</div>
		<p class="title">处理记录</p>
		<div class="w100">
			<div class="row">
				<div class="col-xs-3 center-left" style="padding-left: 5%;">
					<h3 style="margin-top: 40px; font-size: 14px;">以最新处理状态倒序排列</h3>
					<div class="time-axis" style="margin-top: 20px;">
						<ul>
							<li style="padding: 0;" :class="{'active':item.select}" v-for="item in items" @click="itemClick(item)">
								<div class="line-top"></div>
								<div class="left-wp">
									<div class="left"></div>
								</div>
								<div class="line-text" v-if="item.SD_Name == '已复检'">第{{item.index}}次{{item.SD_Name}}</div>
								<div class="line-text" v-else>{{item.SD_Name}}</div>
							</li>
						</ul>
					</div>
					
				</div>
				<div class="col-xs-9 right-center">
					<div class="tab-wp">
						<div class="right-title">
							<h2>{{bottomModel.SD_Name}}</h2>
							<ul>
								<li>操作人:{{bottomModel.UserName}}</li>
								<!--<li v-if="bottomModel.SD_Name == '已复检'">复检时间：{{bottomModel.RU_CreatedTime}}</li>
								<li v-else-if="bottomModel.SD_Name == '已审核'">审核时间：{{bottomModel.RU_CreatedTime}}</li>-->
								<li>操作时间：{{bottomModel.RU_CreatedTime}}</li>
								<li>
									<span style="margin-right: 20px;" v-show="bottomModel.ShowTimer != 0 && bottomModel.ShowTimer != null">{{bottomModel.ShowTimer}}</span>
									
									<!--<span v-if="bottomModel.OverText == '已超时'">{{bottomModel.OverText}}</span>
									<span v-else-if="bottomModel.OverText != null">剩余时间{{bottomModel.OverText}}</span>-->
								</li>
							</ul>
						</div>
						<div class="right-img">
							<h2>附件：</h2>
							<div v-if="bottomModel.audioItmes.length >0 || bottomModel.imgItems.length >0 || bottomModel.text != ''">
								<div class="img-wp row" v-if="bottomModel.imgItems.length > 0">
									<img :src='SrcHead + img' alt=""  class="img-responsive col-xs-4" v-for="img in bottomModel.imgItems" @click="ImgMasker(SrcHead + img)"/>
								</div>
								<h2 v-if="bottomModel.text != ''">{{bottomModel.text}}</h2>
								<div class="audio-wp" style="margin:20px 0" v-if="bottomModel.audioItmes.length > 0">
									<div class="audio" v-for="(audio,index) in bottomModel.audioItmes" :style="{'width':audioLenFilter(audio.PF_RadioLength)}" @click="playAudio(index)">
										<i></i>
										<img src="./audio@3x.png"/>
										<span>{{audio.PF_RadioLength}}</span>
										<audio :src='SrcHead + audio.PF_Url'></audio>
									</div>
								</div>
							</div>
							<div v-else style="margin-top: 30px;">
								无数据
							</div>
							
						</div>
					</div>
					
					
					
				</div>
			</div>
		</div>
		<div class="img-masker" @click="imgMaskerHide()">
			<img src="" alt="" />
		</div>
		<div class="loading-wp">
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
	</div>
</template>

<script>
	export default{
		name:'detail',
		data(){
			return {
				items:[],
				topModel:{
					CreatedUser:'',
					HCIC_AddDate:'',
					NewUser:'',
					RU_CreatedTime:'',
					PBItems:'',
					RIP_Position:'',
					DistributDistributName:'',
					SeverityName:'',
					TreatmentMethodName:'',
					QuestionName:'',
					ResultName:'',
					RectificationNum:0,
					OverText:''
				},
				bottomModel:{
					ShowTimer:'',
					UserName:'',
					RU_CreatedTime:'',
					SD_Name:'',
					imgItems:[],
					audioItmes:[],
					text:'',
					OverText:''
					
				},
				SrcHead:'',
				routerItem:{
					screen:'',
					new:''
				}
			}
		},
		methods:{
			audioLenFilter: function (len) {
	            var phoneWidth = document.body.clientWidth/5;
	            if (len == 1 || len == 2) {
	                return phoneWidth * 0.208 + 'px'
	            } else if (len > 2 && len < 11) {
	                return phoneWidth * (0.208 + (len - 2) * 0.03) + 'px'
	            } else if (len > 10 && len < 21) {
	                return phoneWidth * 0.478 + 'px'
	            } else if (len > 20 && len < 31) {
	                return phoneWidth * 0.508 + 'px'
	            } else if (len > 30 && len < 41) {
	                return phoneWidth * 0.538 + 'px'
	            } else if (len > 40 && len < 51) {
	                return phoneWidth * 0.568 + 'px'
	            } else {
	                return phoneWidth * 0.598 + 'px'
	            }
	        },
	        playAudio:function(index){
	        	var player = $('.audio').eq(index).find('audio')[0]
	        	if (player.paused){ /*如果已经暂停*/
		            player.play(); /*播放*/
		        }else {
		            player.pause();/*暂停*/
		        }
	        },
	        imgMaskerHide:function(){
	        	$('.img-masker').hide()
	        },
	        ImgMasker:function(src){
	        	$('.img-masker img').attr('src',src)
	        	$('.img-masker').show()
	        },
	        itemClick:function(item){
	        	var _this = this
	        	_this.bottomModel.ShowTimer = item.ShowTimer
	        	_this.bottomModel.UserName = item.UserName
	        	_this.bottomModel.RU_CreatedTime = item.RU_CreatedTime.split('T').join(' ')
	        	_this.bottomModel.SD_Name = item.SD_Name
	        	_this.bottomModel.OverText = item.OverText
	        	console.log(item.RIP_Time)
	        	var data = {
	        		RU_Guid:item.RU_GUID
	        	}
	        	_this.items.forEach(function(wzw){
	        		if(wzw.select == true){
	        			wzw.select = false
	        		}
	        	})
	        	$('.loding-wp').show()
	        	if (typeof item.select == 'undefined') {
                    _this.$set(item, 'select', true)
                }else{
                	_this.$set(item, 'select', true)
                }
	        	$.post(api+'/DataRIP_ProblemInfo/GetFileInfo',data,function(rep){
	        		$('.loding-wp').hide()
					if(_this.SrcHead == ''){
						_this.SrcHead = rep.SrcHead
					}
					console.log(rep)
					console.log(_this.SrcHead)
	        		_this.bottomModel.imgItems.length = 0
	        		_this.bottomModel.audioItmes.length = 0
	        		if(rep.list.Table.length>0){
	        			rep.list.Table.forEach(function(tab){
	        				if(tab.PF_Type == 36){//图片
	        					_this.bottomModel.imgItems.push(tab.PF_Url)
	        				}else if(tab.PF_Type == 37){//语音
	        					_this.bottomModel.audioItmes.push(tab)
	        					console.log(tab)
	        				}else if(tab.PF_Type == 35){//文字
	        					_this.bottomModel.text = tab.PF_Describe
	        				}
	        			})
	        		}
	        	},'json')
	        }
		},
		mounted:function(){
			var _this = this
			var data = {
				RIP_Guid:_this.$route.query.RIP_Guid
			}
			$.post(api+'/DataRIP_ProblemInfo/GetRIPInfo',data,function(rep){
				console.log(rep)
				_this.topModel.CreatedUser = rep.list.Table[0].CreatedUser
				_this.topModel.HCIC_AddDate = rep.list.Table[0].HCIC_AddDate.split('T').join(' ')
				_this.topModel.NewUser = rep.list.Table[0].NewUser
				_this.topModel.RU_CreatedTime = rep.list.Table[0].RU_CreatedTime.split('T').join(' ')
				if(rep.list.Table[0].PBOne != ''){
					_this.topModel.PBItems += rep.list.Table[0].PBOne
				}
				if(rep.list.Table[0].PBTwo != ''){
					_this.topModel.PBItems += ('-'+ rep.list.Table[0].PBTwo)
				}
				if(rep.list.Table[0].PBThree != ''){
					_this.topModel.PBItems += ('-' + rep.list.Table[0].PBThree)
				}
				if(rep.list.Table[0].PBFour != ''){
					_this.topModel.PBItems += ('-' + rep.list.Table[0].PBFour)
				}
				if(rep.list.Table[0].PBFive != ''){
					_this.topModel.PBItems += ('-' + rep.list.Table[0].PBFive)
				}
				_this.topModel.RIP_Position = rep.list.Table[0].RIP_Position
				_this.topModel.DistributName = rep.list.Table[0].DistributName
				_this.topModel.SeverityName = rep.list.Table[0].SeverityName
				_this.topModel.TreatmentMethodName = rep.list.Table[0].TreatmentMethodName
				_this.topModel.QuestionName = rep.list.Table[0].QuestionName
				_this.topModel.ResultName = rep.list.Table[0].ResultName
				_this.topModel.RectificationNum = rep.list.Table[0].RectificationNum
				_this.topModel.OverText = rep.list.Table[0].OverText
				$.post(api+'/DataRIP_ProblemInfo/GetRipfInfo',data,function(rep){
					_this.items = rep.list.Table
					var index = _this.topModel.RectificationNum
					if (typeof _this.items[0].select == 'undefined') {
	                    _this.$set(_this.items[0], 'select', true)
	                }
					_this.items.forEach(function(item){
						if(item.SD_Name == '已复检'){
							item.index = index
							index -- 
						}
					})
//					_this.bottomModel.ShowTimer = _this.items[0].ShowTimer
//		        	_this.bottomModel.UserName = _this.items[0].UserName
//		        	_this.bottomModel.RU_CreatedTime = _this.items[0].RU_CreatedTime.split('T').join(' ')
//		        	_this.bottomModel.SD_Name = _this.items[0].SD_Name
		        	_this.itemClick(_this.items[0])
					
				},'json')
			},'json')
			
			this.routerItem.screen = window.localStorage.getItem('screenRouterName')
			this.routerItem.new = this.$route.query.RIP_Name
			$('.siderbar').hide()
			
			
		}
	}
</script>

<style>
	.time-axis li{
		height: 40px;
		width: 200px;
		position: relative;
		margin-top: 0 !important;
		cursor: pointer;
	}
	.time-axis li .line-text{
		position: absolute;
		left: 30px;
		top: 0;
	}
	.time-axis li .left-wp{
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1px solid #ccc;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		background: #fff;
	}
	.time-axis li .line-top{
		position: absolute;
		top: 0;
		left: 9px;
		height: 100%;
		background: #ccc;
		width: 2px;
	}
	.time-axis li .left-wp .left{
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		background: #ccc;
	}
	.time-axis li.active .left-wp{
		border-color: #0b80da;
	}
	.time-axis li.active .left-wp .left{
		background: #0b80da;
	}
	.time-axis li.active .line-text{
		color: #0b80da;
	}
	.time-axis li:last-child{
		height: 20px !important;
	}
	.detail-wp{
		color: #666;
	}
	.w100{
		width: 100%;
	}
	.detail-wp{
		background: #fff;
	}
	.breadcrumb{
		background: #fff;
		padding: 20px 15px;
		margin-bottom: 0;
	}
	.detail-wp .header{
		border: 1px solid #F2F2F2;
	}
	.breadcrumb .active{
		color: #0e84de;
	}
	.header h1{
		font-size: 16px;
		color: #0e84de;
		text-align: center;
	}
	.header p{
		text-align: center;
		color: #666;
		margin-top: 5px;
		margin-bottom: 10px;
	}
	.w100 .row>div{
		height: 360px;
		color: #333;
		position: relative;
	}
	.w100 .row>div h2{
		font-size: 16px;
		font-weight: 500;
		text-align: left;
		padding-left: 30%;
		margin-top: 30px;
	}
	.w100 .row>div li{
		color: #666;
		font-size: 14px;
		text-align: left;
		margin-top: 30px;
		padding-left: 30%;
		
	}
	.w100 .row>div.two h2,.w100 .row>div.two li{
		padding-left: 15%;
		width: 85%;
	}
	.w100 .row>div.three h2,.w100 .row>div.three li{
		padding-left: 10%;
		width: 85%;
	}
	.w100 .row>div .line{
		position: absolute;
		width: 1px;
		height: 180px;
		background: #f2f2f2;
		right: 0;
		top: 60px;
	}
	p.title{
		display: block;
		color: #0e84de;
		font-size: 16px;
		border-bottom: 1px solid #F2f2f2;
		text-align: center;
		padding: 20px 0;
	}
	.right-center .right-title{
		border-bottom: 1px solid #f2f2f2;
		padding-bottom: 20px;
	}
	.tab-wp{
		width: 80%;
		margin: 0 auto;
	}
	.tab-wp .right-title h2,.tab-wp .right-title li,.tab-wp .right-img h2,.tab-wp .right-img li{
		padding: 0 !important;
	}
	.tab-wp .right-title h2{
		color: #0e84de;
		font-weight: 500;
	}
	.img-wp img{
		margin-top: 10px;
	}
	.audio-wp .audio{
		height: 40px;
		line-height: 40px;
		background: #00a899;
		border-radius: 6px;
		position: relative;
	}
	.audio-wp .audio i{
		display: block;
		width: 10px;
		height: 10px;
		background: #00a899;
		position: absolute;
		top: 0;
		left: -5px;
		bottom: 0;
		margin: auto;
		transform: rotate(45deg);
	}
	.audio-wp .audio img{
		width: auto;
		height: 20px;
		margin-left: 20px;
	}
	.audio-wp .audio span{
		float: right;
		margin-right: 20px;
		color: #fff;
	}
	.detail-wp .loading-wp {
		display: none;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,.8);
        z-index: 999;
    }
    .detail-wp .img-masker{
    	width: 100%;
    	height: 100%;
    	position: fixed;
    	top: 0;
    	left: 0;
    	text-align: center;
    	background: rgba(0,0,0,.8);
    	z-index: 99;
    	display: none;
    }
    .img-masker img{
    	height: 100%;
    }
    .breadcrumb li.active{
    	color: #0681df;
    }
</style>