

define(function(){
	return {
		fill0: function(num) {
			return num<10 ? '0' + num :num;
		},
		getDateArr: function(date) {
			var y = date.getFullYear();
			var M = date.getMonth() + 1;
			var d = date.getDate();

			var h = date.getHours();
			var m = date.getMinutes();
			var s = date.getSeconds();

			var day = date.getDay();

			switch(day){
				case 1:
				day = '星期一';
				break;
				case 2:
				day = '星期二';
				break;
				case 3:
				day = '星期三';
				break;
				case 4:
				day = '星期四';
				break;
				case 5:
				day = '星期五';
				break;
				case 6:
				day = '星期六';
				break;
				case 0:
				day = '星期日';
				break;
			}
			return [y,M,d,h,m,s,day];
		}
	}
})