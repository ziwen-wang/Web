var vm = new Vue({
	el:'#app',
	data:{
		myChart:'',
		navLiNub1:['综合统计','进度统计','质量统计','安全统计'],
		navLiNub2:['近一周','近一月']
	},
	methods:{
		getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null
        },
		navClick:function(el){
			if($(el.target).attr('src')){
				$(el.target).siblings('nav').stop().slideToggle()
				$(el.target).toggleClass('goRotate')
			}else{
				$(el.target).find('nav').stop().slideToggle()
				$(el.target).find('img').toggleClass('goRotate')
			}
			
		},
		navLiClick:function(el,name){
			$(el.target).addClass('active').siblings('.active').removeClass('active')
			$(el.target).parents('nav').hide()
			$(el.target).parents('li').find('span').text(name)
			$('section h1').text(name)
		},
		saveChart:function(){
			var canvas = $('canvas')[0]
			var image = new Image();
			image.src = canvas.toDataURL("image/png");
			console.log(image.src)
			$('.navigation-show').hide()
			$('.navigation').show()
		},
		hideNavView:function(){
			$('.navigation-show').animate({'width':0},function(){
				$(this).hide()
				$('.navigation').show()
			})
			
		},
		showNavView:function(){
			$('.navigation').hide()
			$('.navigation-show').show().animate({'width':'7rem'})
			
		},
		ChangeDateFormat: function (cellval) {
            var date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            var miseconds = date.getMilliseconds();
            var misstr = "";
            if (miseconds < 10) {
                misstr = "00";
            } else if (miseconds < 100) {
                misstr = "0";
            } else {

            }
            misstr = misstr + miseconds;
            return date.getFullYear() + "-" + month + "-" + currentDate + " " + hours + ":" + minutes
        },
        formatDate:function(date) {
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
        getLastWeekStartDate:function(n) {
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
        	var now=new Date();
			var year=now.getFullYear();
			//因为月份是从0开始的,所以获取这个月的月份数要加1才行
			var month=now.getMonth()+1;	
			var date=now.getDate();
			var day=now.getDay();
			console.log(date);
			//判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
			if(day!==0){
				n=n+(day-1);
			}else{
				n=n+day;
			}
			if(day){
				if(month>1){
					month=month;
				}else{//这个判断是为了解决跨年的问题,月份是从0开始的
				year=year-1;
					month=12;
				}
			}
			now.setDate(now.getDate()-n);	
			year=now.getFullYear();
			month=now.getMonth()+1;
			date=now.getDate();
			console.log(n);
			s=year+"年"+(month<10?('0'+month):month)+"月"+(date<10?('0'+date):date)+"日";
			return s;
		}
	},
	mounted:function(){
		var _this = this
		
		this.myChart = echarts.init(document.getElementById('main'));
		var option = {
        tooltip: {},
        legend: {
	            data:['销量','wzw']
	        },
	        xAxis: {
	            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
	        },
	        yAxis: {},
	        series: [{
	            name: '销量',
	            type: 'bar',
	            data: [5, 20, 36, 10, 10, 20]
	        },{
	            name:'wzw',
	            type:'bar',
	            data:[11,33,42,11,11,22]
	        }]
	    };
	
	    // 使用刚指定的配置项和数据显示图表。
	    this.myChart.setOption(option);
	    setTimeout(function(){
	    	_this.myChart.resize()
	    },0)
    
	}
})