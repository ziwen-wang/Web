
function accordion(){
	var $acc = $('.accordion');
		$h1 = $acc.find('h1');

	$h1.on('click',function(){
		var $this = $(this);
			$ul = $this.siblings();

		$ul.slideToggle();
		$this.parent().siblings().find('ul').slideUp();

	})
}
accordion();


