!function($){
	
	addBtnClick();
	saveBtnClick();
	ask();
	radioClick()
}(jQuery);


function radioClick(){
		// 下架不能点击已借出
		$('input[name = status]:eq(1)').click(function() {
			// $('input[name = b_status]:eq(0)').removeAttr('checked');
			$('input[name = b_status]:eq(0)').trigger('click');
			$('input[name = b_status]:eq(1)').attr('disabled',true);
			
		});
		$('input[name = status]:eq(0)').click(function() {
			$('input[name = b_status]:eq(1)').attr('disabled',false);
		});

}

function addBtnClick() {
	$('#addBooksBtn').on('click', function() {
		$('#myModal').modal();
	
	})
}


function saveBtnClick(){
	$('#saveBooksBtn').on('click',function(){
		upLoad();	
	})
}
function ask(){
	var $masker = $('.masker_wp');

	$masker.show();

	$.get('../api/books_ask.php',{},function(a){
		if (a.success) {
			var newArray = [];
			$.each(a.data,function(i, obj) {
				var date = obj.p_date.split(' ')[0],
					booksStatus = {0:'上架',1:'下架'},
					b_status_map = {0:'未借出',1:'已借出'};
				
				newArray.push(
						'<tr>',
							'<td>',obj.name,'</td>',
							'<td>',obj.author,'</td>',
							'<td>',obj.publisher,'</td>',
							'<td>',date,'</td>',
							'<td>','$',obj.price.toFixed(2),'</td>',
							'<td>',obj.classify,'</td>',
							'<td>',booksStatus[obj.status],'</td>',
							'<td>',b_status_map[obj.borrow_status],'</td>',
						'</tr>'
					)
			});
			$('#innerTable tbody').html(newArray.join(''))
			$masker.hide();
		}
	},'json');
}

function upLoad(){
	var data = {
		name: $('#booksName').val(),
		author: $('#booksAuthor').val(),
		price: $('#booksPrice').val(),
		publisher: $('#booksPublisher').val(),
		p_date: $('#booksDate').val(),
		classify: '未分类',
		status: $('input[name = status]:checked').val(),
		borrow_status:$('input[name = b_status]:checked').val()

	},$saveBooksBtn = $('#saveBooksBtn');
		if ($saveBooksBtn.hasClass('asking')) {
			return;
		}


		$saveBooksBtn.addClass('asking');

	$.get('../api/books_add.php',data,function(a){
		if (a.success) {
			resetForm();
			$('#myModal').modal('hide');
			ask();
			$saveBooksBtn.removeClass('asking');
		}else{
			alert('入库失败')
		}
	},'json');
}

function resetForm(){
	$('#booksForm').trigger('reset');
	$('#saveBooksBtn').removeClass('asking');
}