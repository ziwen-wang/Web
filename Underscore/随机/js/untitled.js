function asd() {
	var left = ['aaa', 'bbb', 'ccc', 'ddd', 'eee'],
		right = [111, 222, 333, 444, 555],
		start = document.getElementById('start'),
		ulLeft = document.getElementById('ulLeft'),
		lisLeft = ulLeft.getElementsByTagName('li'),
		ulRight = document.getElementById('ulRight'),
		lisRight = ulRight.getElementsByTagName('li'),
		stop = document.getElementById('stop'),
		timer = null;


	start.onclick = function() {
		if (timer == undefined) {
			timer = setInterval(function() {
				var a = _.shuffle(left),
					b = _.shuffle(right);
				// 效率低
				// for (var i = 0; i < lisLeft.length; i++) {
				// 	lisLeft[i].innerHTML = a[i]
				// 	lisRight[i].innerHTML = b[i]
				// }
				_.map(lisLeft,function(num){return '<li>'+num+'</li>';});
				_.map(lisRight,function(num){return '<li>'+num+'</li>';});
				lisRight.innerHTML = 
			}, 10)
		}

	}
	stop.onclick = function() {
		clearInterval(timer);
		timer = undefined;
	}

}

asd();