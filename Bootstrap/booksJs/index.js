var booksAllArray = {},booksAsk = {page:0,size:8},allTotal,allSize;
!function($){
	
	addBtnClick();
	saveBtnClick();
	ask();
	radioClick();
	renderSelect();
	impactBtn();
	changeBooksBtn();
	deleteBooksBtn();
	verificationForm();
	searchBtnClick();
	searchInputClick();
	SeacherViewClose();
	pageLeftClick();

	

	
}(jQuery);

//模态框中 radio的逻辑
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


//导航栏增加按钮 显示隐藏模态框
function addBtnClick() {
	$('#addBooksBtn').on('click', function() {
		resetForm();

		$('#myModal').find('.modal-title').html('增加图书').end()
					.find('#saveBooksBtn').html('Save Books').removeClass('upLoadBtn').end().modal();
	
	})
}

//模态框按钮 增加图书到数据库
function saveBtnClick(){
	$('#saveBooksBtn').on('click',function(){
		$('.masker').show();

		$('#booksForm').trigger('submit');
		// verificationForm();		
		// upLoad();//如果不用框架注释这句话
	})
}

// 请求数据
function ask(){
	var $masker = $('.masker_wp'),
		text = $('#form_hide').val(),
		pag = $('#pagingUl li:checked').val();
	var askquery = $.extend(booksAsk,{query: text||''});
	$masker.show();

		console.log(askquery)
	// return;
	$.get('../api/books_ask.php',askquery,function(a){
		if (a.success) {
			var newArray = [];
			$.each(a.data,function(i, obj) {
				var date = obj.p_date.split(' ')[0],
					booksStatus = {0:'上架',1:'下架'},
					b_status_map = {0:'未借出',1:'已借出'};
				var select_map = {1:'国内历史',2:'国外历史',3:'国内文学',4:'国外文学',5:'计算机与科学',0:'未分类'};
				newArray.push(
						'<tr>',
							'<td class="first_checkbox"><input type="checkbox" class="checkBox_children" id="',obj.id,'"></td>',
							'<td>',obj.name,'</td>',
							'<td>',obj.author,'</td>',
							'<td>',obj.publisher,'</td>',
							'<td>',date,'</td>',
							'<td>','￥',obj.price.toFixed(2),'</td>',
							'<td>',select_map[obj.classify||0],'</td>',
							'<td>',booksStatus[obj.status],'</td>',
							'<td>',b_status_map[obj.borrow_status],'</td>',
						'</tr>'
					)
				booksAllArray[obj.id] = obj;
								
			});
		
			// 
			$('#innerTable tbody').html(newArray.join(''))
			$masker.hide();
			checkBoxChildrenBtn();
			checkBoxAllBtn();
			trOrBtn();
			IfSearchResult();
			allTotal = a.total;
			paging();

		}
	},'json');
}

//生成分页
function paging(){
	var newPagArray=[],currPag;
	allSize  = Math.ceil(allTotal/(booksAsk.size));
	console.log(allTotal);
	if (booksAsk.page == 0) {
		newPagArray.push(
			'<li class="pagingFirst disabled">',
				'<a href="javascript:" aria-label="Previous">',
					'<span aria-hidden="true">&laquo;</span>',
				'</a>',
			'</li>',
			'<li class="prev disabled">',
				'<a href="javascript:" aria-label="Previous">',
					'<span aria-hidden="true">&lsaquo;</span>',
				'</a>',
			'</li>'
		)
	}else{
		newPagArray.push(
			'<li class="pagingFirst">',
				'<a href="javascript:" aria-label="Previous">',
					'<span aria-hidden="true">&laquo;</span>',
				'</a>',
			'</li>',
			'<li "class=prev">',
				'<a href="javascript:" aria-label="Previous">',
					'<span aria-hidden="true">&lsaquo;</span>',
				'</a>',
			'</li>'
		)
	}
	
		for (i=0; i<allSize; i++) {
		if (i == booksAsk.page) {
			newPagArray.push('<li value="', i, '" class="active"><a href="javascript:;">', (i + 1), '</a></li>');
		} else {
			newPagArray.push('<li value="', i, '"><a href="javascript:;">', (i + 1), '</a></li>');
		}
	}

	if (booksAsk.page == allSize-1) {
		newPagArray.push(
			'<li class="next disabled">',
				'<a href="javascript:" aria-label="Previous">',
					'<span aria-hidden="true">&rsaquo;</span>',
				'</a>',
			'</li>',
		    '<li class="pagingLast disabled">',
		      '<a href="#" aria-label="Next">',
		        '<span aria-hidden="true">&raquo;</span>',
		      '</a>',
		    '</li>'
		)
	}else{
		newPagArray.push(
			'<li class=next>',
				'<a href="javascript:" aria-label="Previous">',
					'<span aria-hidden="true">&rsaquo;</span>',
				'</a>',
			'</li>',
		    '<li class=pagingLast>',
		      '<a href="#" aria-label="Next">',
		        '<span aria-hidden="true">&raquo;</span>',
		      '</a>',
		    '</li>'
		)
	}
	
	$('#pagingUl').html(newPagArray.join(''));
	//li点击事件
	$('#pagingUl li').each(function(i, obj) {
		$(obj).on('click',function(){
			var $this = $(this);
			if ($this.hasClass('disabled')) {
				return;
			}


			if ($this.hasClass('pagingFirst')) {
				currPag = 0;
			}else if($this.hasClass('pagingLast')){
				currPag = allSize-1;
			}else if ($this.hasClass('prev')) {
				currPag = --booksAsk.page
			}else if ($this.hasClass('next')) {
				currPag = ++booksAsk.page
			}else{
				currPag = $(this).val();
			}
			booksAsk.page = currPag;
			console.log(booksAsk)
			ask()
		})
	});


}


function pageLeftClick(){

	$('.pagBtn').on('click',function(){

		var pagVal = $('.pagInput').val()*1+1;
		if ($('.pagInput').val()=='') {
			return
		}
		
		if (isNaN(pagVal)) {
			alert('输入数字')
			$('.pagInput').select();
		}
		booksAsk.page = pagVal;
		console.log(allSize)
		if (pagVal>allSize) {
			booksAsk.page = allSize-1;
		}
		if (pagVal<0) {
			booksAsk.page = 0;
		}
		
		ask();
	

	})
}
//判断是否有搜索结果
function IfSearchResult(result){
	if (result == 0) {
		$('#seacherBtn_1').trigger('click');
	}
}

function SeacherViewClose(){
	$('#search_view').on('hidden.bs.modal',function(){
		console.log(1)
		$('#searchInput').val('');
		$('#searchBtn').trigger('click')
	})
	
}
//保存数据
function upLoad(){
	var data = {
		name: $('#booksName').val(),
		author: $('#booksAuthor').val(),
		price: $('#booksPrice').val(),
		publisher: $('#booksPublisher').val(),
		p_date: $('#booksDate').val(),
		classify: $('#booksClassify').val(),
		status: $('input[name = status]:checked').val(),
		borrow_status:$('input[name = b_status]:checked').val()},
		$saveBooksBtn = $('#saveBooksBtn'),
		url;
		if ($saveBooksBtn.hasClass('asking')) {
			return;
		}
		$saveBooksBtn.addClass('asking');
		if ($('#saveBooksBtn').hasClass('upLoadBtn')) {
			url = '../api/books_update.php'
			data['id'] = $('input.checkBox_children:checked')[0].id;
		}else{
			url = '../api/books_add.php'
		}
		// console.log(data)
		// return;
	$.get(url,data,function(a){
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

//重置表单
function resetForm(){
	$('#booksForm').trigger('reset');
	$('#saveBooksBtn').removeClass('asking');
}


//datetimepicker 插件
$('#booksDate').datetimepicker({
    todayBtn: true,
	format: 'yyyy-mm-dd',
	autoclose: true,
	minView: 2,
	language: 'zh-CN'
});


//渲染 select多选框
function renderSelect(){
	var data_1 = [
		{"id": 1, name: "国内历史"},
		{"id": 2, name: "国外历史"},
		{"id": 3, name: "国内文学"},
		{"id": 4, name: "国外文学"},
		{"id": 5, name: "计算机与科学"}
	], //此数据当作后台请求来的  booksClassify
		data_2 = ['<option value="','-1','">','请选择分类','</option>'];
	$.each(data_1,function(i, obj) {
		data_2.push(
			'<option value="',obj.id,'">',obj.name,'</option>'
			)
	});

	$('#booksClassify').html(data_2.join(''));

}

// checkbox的逻辑
function checkBoxAllBtn() {
	var $checkBoxAll = $('#checkBoxAll'),
		$checkBox_children = $('.checkBox_children');

	$checkBoxAll.on('click',function(){
		var $this = $(this);
		$this.toggleClass('click_on');
		$checkBox_children.each(function(i,obj){
			if ($checkBoxAll.hasClass('click_on')) {
				if(!$(obj).hasClass('click_on')){
					$(obj).trigger('click');
				}
			}else{
				if($(obj).hasClass('click_on')){
					$(obj).trigger('click');
				}
			}
		})
	})
}
//checkbox 未来元素的点击事件
function checkBoxChildrenBtn(){
	$('input.checkBox_children').each(function(i, obj) {
		$(obj).on('click',function(e){
			$(this).toggleClass('click_on');
			impactBtn();
			e.stopPropagation();
		})
		
	})
}

// 设置checkbox影响 导航栏修改跟删除按钮
function impactBtn(){
	var $changeBooksBtn = $('#changeBooksBtn'),
		$deleteBooksBtn = $('#deleteBooksBtn');

	// console.log($('click_on'))


	if ($('.click_on').length == 0) {
		$deleteBooksBtn.attr('disabled',true);
		$changeBooksBtn.attr('disabled',true);
	} else if($('.click_on').length == 1){
		$deleteBooksBtn.attr('disabled',false);
		$changeBooksBtn.attr('disabled',false);
	}else{
		$deleteBooksBtn.attr('disabled',false);
		$changeBooksBtn.attr('disabled',true);
	}
	
} 

//修改图书按钮
function changeBooksBtn(){
	$('#changeBooksBtn').on('click',function(){
		var books_Id = $('input.checkBox_children:checked')[0].id;
		console.log(booksAllArray)
		var $booksForm = $('#booksForm');
		$booksForm.find('#booksName').val(booksAllArray[books_Id].name);
		$booksForm.find('#booksAuthor').val(booksAllArray[books_Id].author);
		$booksForm.find('#booksPublisher').val(booksAllArray[books_Id].publisher);
		$booksForm.find('#booksPrice').val(booksAllArray[books_Id].price.toFixed(2));
		$booksForm.find('#booksDate').val(booksAllArray[books_Id].p_date.split(' ')[0]);
		$booksForm.find('#booksClassify').val(booksAllArray[books_Id].classify);
		$booksForm.find('input[name = status][value="'+booksAllArray[books_Id].status+'"]').trigger('click');
		$booksForm.find('input[name = b_status][value="'+booksAllArray[books_Id].borrow_status+'"]').trigger('click');

		$('#myModal').find('.modal-title').html('修改图书').end()
					.find('#saveBooksBtn').html('Change Books').addClass('upLoadBtn').end().modal();
					console.log(booksId);
	})
}

function deleteBooksBtn(){
	$('#deleteBooksBtn').on('click',function(){
		if(!confirm('确定删除么')){
			return;
		}
		$('.masker_wp').show();
		var checkBox_checked = $('input.checkBox_children:checked');
		var checkBoxId = [];
		checkBox_checked.each(function(i,obj){
			// console.log(obj.id)
			checkBoxId.push(obj.id)
		})

		$.get('../api/books_del.php',{ids:checkBoxId.join(',')},function(a){
			if (a.success) {
				ask();
			}else{
				alert(a.messages);
			}
		},'json')
	})
}

//搜索框按钮
function searchBtnClick(){
	$('#searchBtn').on('click', function() {
		var searchInputVal = $('#searchInput').val();
		$('#form_hide').val(searchInputVal);
		ask();
	});
}
//搜索input回车点击事件
function searchInputClick(){
	$('#searchInput').on('keypress',function(){
		// console.log(event.keyCode)  获取键盘位置
		if (event.keyCode == 13) {
			$('#searchBtn').trigger('click');
		}
	})
}

//点击table中td 触发第一项radio的点击事件
function trOrBtn(){

	$('td').each(function(i,obj){

		$(obj).on('click',function(){
			// $(this).parent().children().children().trigger('click');
			$(this).parent().find('.checkBox_children').trigger('click');

			
		})
	})	
}

//表单验证
// function verificationForm(){
// 	if ($('#booksName').val().length == 0) {
// 		alert('请输入书名');
// 		return false;
// 	}
// 	if ($('#booksAuthor').val().length == 0) {
// 		alert('请输入作者');
// 		return false;
// 	}

// 	if ($('#booksPublisher').val().length == 0) {
// 		alert('请输入出版社');
// 		return false;
// 	}
// 	if ($('#booksPrice').val().length == 0) {
// 		alert('请输入价格');
// 		return false;
// 	}
// 		if ($('#booksDate').val().length == 0) {
// 		alert('请选择日期');
// 		return false;
// 	}
// 	if ($('#booksClassify').val() == 0) {
// 		alert('请选择分类');
// 		return false;
// 	}
// 	$("#booksForm").submit(upLoad());
	
// }

//插件表单验证
function verificationForm(){
	$("#booksForm").validate({   
   
		rules:{
			booksName: "required",
			booksClassify:{
				required : true,
				min: 1
			},
			booksAuthor:{
				required: true,
        		minlength: 2
			},
			booksPublisher:{
				required: true,
				minlength: 4
			},
			booksPrice:{
				required: true,
				number:true
			},
			booksDate:{
				required: true,
				date: true
			}
		},
		messages: {
			booksName:"请输入书名",
			booksClassify:{
				required : "请选择分类" ,
				min: "请选择分类"


		},
			booksAuthor: {
				required:"请输入作者",
				minlength:"长度大于2"
			},
			booksPublisher:{
				required:"请输入出版社",
				minlength:"长度大于3"
			},
			booksPrice:{
				required:"请输入价格",
				number:"有效数字"
			},
			booksDate:{
				required:"请选择日期",
				date:"注意日期格式"
			}

		},
		submitHandler: function(form) {
			upLoad();
			// form.submit(); //form.submit(); 或者$(form).ajaxSubmit();  

		}
		
		
	});
}
