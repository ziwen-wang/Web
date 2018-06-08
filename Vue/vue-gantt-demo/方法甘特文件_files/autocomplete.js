var AutoComplete = function(preffer) {
	this.preffer = encodeURIComponent(preffer);
	var self = this;
	document.body.onclick = function() {
		self.close_all();
	};
};


AutoComplete.prototype = {
	list: [],

	getXHR:function(){
		if (window.XMLHttpRequest)
			return new XMLHttpRequest();
		else
			return new ActiveXObject("Microsoft.XMLHTTP");
	},

	send:function(url,params,call){
		var x=this.getXHR();
		if (!(call instanceof Array))
			call = [call];
		//add extra params to the url
		if (typeof params == "object"){
			var t=[];
			for (var a in params){
				var value = params[a];
				if (value === null || value === window.undefined)
					value = "";
				t.push(a+"="+encodeURIComponent(value));// utf-8 escaping
		 	}
			params=t.join("&");
		}
		if (params && !this.post){
			url=url+(url.indexOf("?")!=-1 ? "&" : "?")+params;
			params=null;
		}
		
		x.open(this.post?"POST":"GET",url,!this._sync);
		if (this.post)
			x.setRequestHeader('Content-type','application/x-www-form-urlencoded');

		//async mode, define loading callback
		 var self=this;
		 x.onreadystatechange= function(){
			if (!x.readyState || x.readyState == 4){
				if (call && self){
					for (var i=0; i < call.length; i++)	//there can be multiple callbacks
						if (call[i]){
							var method = (call[i].success||call[i]);
							if (x.status >= 400 || (!x.status && !x.responseText))
								method = call[i].error;
							if (method)
								method.call((self.master||self),x.responseText,x.responseXML,x);
						}
				}
				self.master=null;
				call=self=null;	//anti-leak
			}
		 };
		
		x.send(params||null);
		return x; //return XHR, which can be used in case of sync. mode
	},

	response: function(text) {
		text = "var words = " + text;;
		try {
			eval(text);
		} catch(e) {
			var words = [];
		}
		return words;
	},

	suggest: function(input, timeout) {
		//clear all waiting call
		//as result we will send request only when we are not typin Nms
		if (input._in_progress){
			window.clearTimeout(input._in_progress);
			input._in_progress = null;
		}
		 
		var self = this;
		timeout = timeout || 10;
		input._in_progress = window.setTimeout(function() {
			self.send('./suggest.php?query=' + encodeURIComponent(input.value), "", function(response) {
				var words = this.response(response);
				if (words.length > 0)
					self.show(input, words);
				else
					self.hide(input);
				input._in_progress = false;
			});
			return true;
		}, timeout);
	},

	input: function(input, timeout) {
		var self = this;
		input.onkeypress = function(e) { self.suggest(input, timeout); };
		input.onkeydown = function(e) {
			e = e || window.event;
			var key = e.keyCode;
			if (key === 8) return self.suggest(input, timeout);
			if (key === 40) return self.down(input);
			if (key === 38) return self.up(input);
			if (key === 13) return self.apply(input);
			if (key == 27 || key == 9) return self.hide(input);

			if (input.autocmp)
				self.select(input.autocmp, -1);
			return true;
		};
		this.list.push(input);
	},

	down: function(input) {
		var ul = input.autocmp;
		var index = this.selected(ul) + 1;
		if (index >= ul.childNodes.length) index = 0;
		this.select(ul, index);
		return false;
	},
	up: function(input) {
		var ul = input.autocmp;
		var index = this.selected(ul) - 1;
		if (index < 0) index = ul.childNodes.length - 1;
		this.select(ul, index);
		return false;
	},
	apply: function(input) {
		var ul = input.autocmp;
		var value = this.value(ul);
		
		if (this.is_visible(ul) && value !== null) {
			document.location.href = value;
			return false;
		} else {
			return true;
		}
	},

	selected: function(ul) {
		if (ul)
			for (var i = 0; i < ul.childNodes.length; i++)
				if (ul.childNodes[i].className.indexOf(' hover') !== -1) return i;
		return -1;
	},
	
	value: function(ul) {
		if (ul){
			var index = this.selected(ul);
			if (ul.childNodes[index])
				return ul.childNodes[index].hint_name;
		}
		return null;
	},

	select: function(ul, index) {
		for (var i = 0; i < ul.childNodes.length; i++){
			ul.childNodes[i].className = ul.childNodes[i].suggestType + ((i !== index) ? '' : ' hover');
		}
	},

	show: function(input, words) {
		var ul = (input.autocmp) ? input.autocmp : document.createElement('ul');
		var index = this.selected(ul);
		ul.className = 'autocomplete';
		ul.innerHTML = '';
		ul.style.display = 'block';
		input.autocmp = ul;

		for (var i = 0; i < words.length; i++) {
			var li = document.createElement('li');
			if (words[i].type == 'none')
				li.innerHTML = "<img src='./media/api/toc/"+words[i].icon+".png' style='float:left; margin-right:10px;'>"+"<a href=\"./"+words[i].name+"\" class=\"label\">" + words[i].label + "</a><a href=\"./"+words[i].name+"\" class=\"short\">" + words[i]["short"] + "</a>";
			else
				li.innerHTML = "<div class=\"icon " + words[i].type + "\"></div><a href=\"./"+words[i].name+"\" class=\"label\">" + words[i].label + "</a><a href=\"./"+words[i].name+"\" class=\"short\">" + words[i]["short"] + "</a>";
			li.hint_name = words[i].name;
			li.suggestType = words[i].type;
			ul.appendChild(li);
			this.li_events(input, i);
		}
		this.select(ul, index);
		document.body.appendChild(ul);
		this.stick_to_input(input, ul);
	},

	hide: function(input) {
		var ul = input.autocmp;
		if (ul) ul.style.display = 'none';
	},

	stick_to_input: function(input, ul) {
		var pos = this.position(input);
		ul.style.left  = pos.x + 'px';
		ul.style.top = (pos.y + input.offsetHeight  + 4) + 'px';
	},

	position: function(e) {
		var left = 0, top = 0;
		while (e.offsetParent) {
				left += e.offsetLeft;
				top  += e.offsetTop;
				e     = e.offsetParent;
		}
		left += e.offsetLeft;
		top  += e.offsetTop;
		return {x: left, y: top}
	},

	li_events: function(input, index) {
		var self = this;
		var ul = input.autocmp;
		var el = ul.childNodes[index];
		el.onclick = function(e) {
			e = e || event;
			if ((e.target || e.srcElement).tagName.toLowerCase() == "a")
				return e.cancelBubble = true;

			self.select(ul, index);
			self.apply(input);input.focus();};
	},

	close_all: function() {
		for (var i = 0; i < this.list.length; i++)
			this.hide(this.list[i]);
	},
	
	is_visible: function(ul) {
		if (ul && ul.style.display == 'block') return true;
		return false;
	}

};

AutoComplete_init=function(preffer){
	var els = document.getElementsByName('query');
	var hint = new AutoComplete(preffer);
	for (var i = 0; i < els.length; i++)
		hint.input(els[i], 200);
};


Scroll_init=function(){
	var navs = document.getElementById("doc_navigation");
	if (!navs) return;

	var navigation_height = navs.offsetHeight;
	var content_height = document.getElementById("doc_content").offsetHeight;
	var top_header = 77;
	var fullHeight = content_height;
	var screen_height = window.innerHeight;
	var fixed_point;
    function fixed_style(id,point){
        document.getElementById(id).style.position = "fixed";
        document.getElementById(id).style.marginTop = point+"px";
    }
    function default_style(id){
        document.getElementById(id).style.position = "relative";
        document.getElementById(id).style.marginTop = "0px";
    }

	window.onscroll = function(){
	    if(navigation_height < screen_height){
	        fixed_point = top_header;
	        if(content_height > screen_height){
	            if(window.pageYOffset > fixed_point){
	                fixed_style("doc_navigation", Math.min(-1*fixed_point, fullHeight - navigation_height - window.pageYOffset - 50));
	            }else{
	                default_style("doc_navigation");
	            }
	        }
	    }
	}
	window.onscroll();
}