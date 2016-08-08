var app = angular.module('bookApp',[]);
app.controller('bookCtrl',function($scope,$http,$timeout){
	$scope.currentPage = 0;
	$scope.size = 9;
	$scope.qwe = "努力加载中。。";
	$scope.bookData = [];
	$scope.menuState = {show: true};

	window.onscroll = function(){
		var yemiangaodu = document.body.scrollHeight,
			neironggaodu = window.screen.height,
			gundongtiao = document.body.scrollTop;
		// console.log(document.body.scrollHeight,window.screen.height,document.body.scrollTop )
		if (gundongtiao + neironggaodu == yemiangaodu) {
			$scope.currentPage++;
			if(Math.ceil($scope.total/$scope.size)<=$scope.currentPage){
				$scope.menuState.show = true;
				$scope.$apply(function(){
					$scope.qwe="没有更多了。。"
				})

				$timeout(function(){
					$scope.menuState = {
						show:false
					}
				},3000);
				return;
			}
			$scope.askBook()
		}
	}
	$scope.askBook = function(){
		// $('.space').show();
		 

		$http({
				method:'GET',
				url:'../../api/books_ask.php',
				params:{
				size:$scope.size,
				page:$scope.currentPage
				}
			})
		.success(function(response) {
			$scope.bookData=$scope.bookData.concat(response.data);
			$scope.total = response.total;
			// $('.space').hide();

		});
	}

	$scope.askBook();
})