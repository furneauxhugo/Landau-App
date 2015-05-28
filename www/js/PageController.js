(function() {
		/* Page controller */
		angular.module('wapp').controller('PageController', ['$scope', 'PostsData', 'rehttp', PageController]);
		function PageController($scope, PostsData, rehttp) {
				$scope.item = PostsData.selectedItem;
				var page = appNavigator.getCurrentPage();
				var id = page.options.pageid;

				loading.show();

				rehttp.query("get_page").whereEquals("id",id).find(function(data) {
						loading.hide();
						if (data) {
								$scope.item = data.page;
						}
				})

				$scope.loadURL = function (url) {
						window.open(url,'_blank');
				}

				$scope.sharePost = function () {

						var subject = $scope.item.title;
						var message = $scope.item.content;
						message = message.replace(/(<([^>]+)>)/ig,"");

						var link = $scope.item.url;
						var image = $scope.item.thumbnail;



						window.plugins.socialsharing.share(subject, subject, image, link);
				}

		};
}());
