<template>
	<div class="warp" style="width: 100%; height: 100%; overflow: hidden;">
		<img src="./new-bg.png"/>
		<!--<div class="log">
			<img src="./xuhui-logo.png"/>
		</div>-->
		<div class="log-box">
			<h1 style="color: #fff;">工程卫士项目管理平台</h1>
			<form action="" style="margin-top: 30px;">
				<div class="form-item">
					<input type="text" placeholder="用户名" class="form-ipt user-ipt" v-model="loginModel.user" @blur="inputBlur(loginModel.user,'user')"/>
					<div class="tip" v-if='PromptModel.user.isShow'>{{PromptModel.user.text}}</div>
				</div>
				<div class="form-item">
					<input type="password" placeholder="用户名" class="form-ipt password-ipt" v-model='loginModel.passWord' @blur="inputBlur(loginModel.passWord,'passWord')"/>
					<div class="tip" v-if='PromptModel.passWord.isShow'>{{PromptModel.passWord.text}}</div>
				</div>
				<input type="button" class="form-btn form-ipt"  value="登陆" @click='submitForm'/>
			</form>
		</div>
		<router-link to="/main">
			<div class="login-ws">
				
				<img src="./weishi-logo.png" alt="" />
			</div>
		</router-link>
		
		
	</div>
	
</template>

<script>
	export default {
	  name: 'Login',
	  data () {
	    return {
	      loginModel:{//登陆信息
	      	user:'',
	      	passWord:'',
	      },
	      PromptModel:{//登陆提示信息
	      	user:{
	      		text:'用户名不能为空',
	      		isShow:false
	      	},
	      	passWord:{
	      		text:'密码不能为空',
	      		isShow:false
	      	}
	      	
	      }
	    }
	  },
	  methods: {
	  	submitForm () {
	  		var _this = this
	  		if(this.loginModel.user == ''){
	  			this.PromptModel.user.isShow = true
	  			return false
	  		}
	  		if(this.loginModel.passWord == ''){
	  			this.PromptModel.passWord.isShow = true
	  			this.PromptModel.passWord.text = '密码不能为空'
	  			return false
	  		}
			$.post(api+'/Login/GetLogin',{MB_Name:this.loginModel.user,MB_Pwd:this.loginModel.passWord},function(re){
				console.log(re)
				if (re.state == 100) {
					   var LoginMsg = {
					   		usertype:re.usertype,
                        	name:re.name,
                        	MB_Guid:re.guid
					   }
						
                        _this.$router.push({
                        	path:'main',
                        	name:'MainTable',
                        	query:LoginMsg
                        })
                        window.localStorage.setItem('LoginMsg',JSON.stringify(LoginMsg))
                } else {
                    _this.PromptModel.passWord.isShow = true
                    _this.PromptModel.passWord.text = re.msg
                }
                _this.loginModel.user = ''
                _this.loginModel.passWord = ''
			},'json')
	  	},
	  	inputBlur (txt,str) {
	  		if(txt == ''){
	  			if(str == 'user'){
	  				this.PromptModel.user.isShow = true
	  			}else{
	  				this.PromptModel.passWord.isShow = true
	  			}
	  		}else{
	  			if(str == 'user'){
	  				this.PromptModel.user.isShow = false
	  			}else{
	  				this.PromptModel.passWord.isShow = false
	  			}
	  		}
	  	}
	  	
	  },
	  created:function(){
	  	var _this = this
	  	var LoginMsg = JSON.parse(window.localStorage.getItem('LoginMsg'))
	  	if(LoginMsg != '' && LoginMsg != undefined && LoginMsg != null){
	  		_this.$router.push({
            	path:'main',
            	name:'MainTable',
            	query:LoginMsg
            })
	  	}
	  }
	}
</script>

<style>
	.warp > img {
            height: 100%;
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
        }

        .log {
            position: absolute;
            top: 20px;
            left: 5%;
            width: 200px;
        }

        .log img {
            width: 100%;
        }

        .log-box {
            position: absolute;
            top: 40%;
            left: 10%;
            width: 90%;
        }

            .log-box h1 {
                display: inline-block;
                width: 100%;
                margin: 0;
                padding-bottom: 30px;
                font-size: 50px;
                font-weight: normal;
            }

        .login-line {
            height: 4px;
            background-color: #000;
            box-shadow: -1px 0 1px 1px #D9D9D7 inset;
            opacity: .8;
        }

        .form-item {
            position: relative;
            float: left;
            width: 265px;
            height: 50px;
            margin-bottom: 10px;
            margin-right: 2%;
        }

        .form-ipt {
            box-sizing: border-box;
            height: 50px;
            padding: 10px 30px 10px 60px;
            border: none;
            border-radius: 25px;
            outline: none;
            font-family: "MicroSoft YaHei";
            font-size: 16px;
            background-color: rgba(255,255,255, .8);
            background-repeat: no-repeat;
            background-position: 25px center;
            color: #333;
        }
	.user-ipt {
		background-image: url(./user3@2x.png);
	}
	.password-ipt {
		background-image: url(./lock2@2x.png);
	}
	.tip {
            position: absolute;
            bottom: 55px;
            left: 35px;
            min-height: 30px;
            padding: 0 20px;
            border-radius: 5px;
            line-height: 30px;
            text-align: center;
            background-color: #2E3548;
            font-size: 14px;
            color: #CB5A5C;
        }

        .tip::after {
            position: absolute;
            left: 10px;
            bottom: -5px;
            content: '';
            width: 10px;
            height: 10px;
            background-color: #2E3548;
            transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            -o-transform: rotate(45deg);
        }

        .form-btn {
            float: right;
            margin-right: 10%;
            padding-right: 60px;
            background-color: rgba(255,255,255,.8);
            cursor: pointer;
        }

        .login-ws {
            position: absolute;
            bottom: 20px;
            left: 50%;
            width: 190px;
            margin-left: -95px;
        }

        input:hover,input:focus {
            background-color: rgba(204,204,204,.8);
        }
</style>