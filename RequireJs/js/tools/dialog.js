
define(function(){
	return {
		initHTML:function(){
			if ($('.masker-wp').length>0) {
				return;
			}
			var html = [
			'<div class="masker-wp">',
				'<div class="masker"></div>',
				'<div class="dialog"></div>',	
			'</div>'
			]
			$('body').append(html.join(''));
		}
	}
	
})