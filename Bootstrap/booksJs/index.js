!function($){
	addBtnClick();
	saveBtnClick();
	ask();
}(jQuery);


function addBtnClick(){
	$('#addBooksBtn').on('click',function(){
		$('#myModal').modal();
	})
}


function saveBtnClick(){
	$('#saveBooksBtn').on('click',function(){
		upLoad();	
	})
}
function ask(){
	$.get('../api/books_ask.php',{},function(a){
		if (a.success) {
			var newArray = [];
			$.each(a.data,function(i, obj) {
				newArray.push(
						'<tr>',
							'<td>',obj.name,'</td>',
							'<td>',obj.author,'</td>',
							'<td>','003','</td>',
							'<td>','004','</td>',
							'<td>','005','</td>',
							'<td>','006','</td>',
							'<td>','007','</td>',
							'<td>','008','</td>',
						'</tr>'
					)
			});
			$('#innerTable tbody').html(newArray.join(''))
		}
	},'json');
}

function upLoad(){
	var data = {
		name: $('#booksName').val(),
		author: $('#booksAuthor').val()
	}
	console.log(data)
	$.get('../api/books_add.php',data,function(a){
		if (a.success) {
			alert('保存成功');
			$('#myModal').modal('hide');
			$('#booksName').val('');
			$('#booksAuthor').val('');
			ask();
		}else{
			alert('入库失败')
		}
	},'json');
}