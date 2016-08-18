require.config({
	baseUrl: "js",
	paths: {
		jquery: 'jquery.min'
	}
})



requirejs(["tools/dialog", 'jquery', "tools/date"], function(dialog, $, date) {
	dialog.initHTML();
	// setInterval(function() {
	// 			var a = new Date();
	// 			var dateArr = date.getDateArr(a) 
	// 			var dateEnd = dateArr[0] + '年' + date.fill0(dateArr[1]) + '月' + date.fill0(dateArr[2]) + '日' + '' + 
	// 				date.fill0(dateArr[3]) + ':' + date.fill0(dateArr[4]) + ':' + date.fill0(dateArr[5]);
	// 				console.log(dateEnd)
	// 		},1000)
	var a = new Date();
	var dateArr = date.getDateArr(a)
	console.log(dateArr[6])	


})	