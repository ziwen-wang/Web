
var array = ['爸爸','爷爷','亲哥','祖宗','野爹','亲爹','叔叔','失散多年的野爹','叶蝶蝶'];
var name = ['王子文是董荣的'];
// console.log(name+array[r]);
var start = document.getElementById('start');
var stop = document.getElementById('stop');
var hehe=document.getElementById('hehe');

start.onclick = function(){

	setInterval(function(){	
	 var 	r = parseInt(Math.random() *(array.length-1+0)+0);
	 hehe.innerHTML=(name+array[r]);
	},500);

};



