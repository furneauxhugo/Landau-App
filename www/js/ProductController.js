(function() {
    angular.module('wapp').controller('ProductController', ['$scope', 'ProductsData', 'rehttp', ProductController]);
	function ProductController($scope, ProductsData, rehttp) {
		var options = appNavigator.getCurrentPage().options;
        $scope.item = ProductsData.selectedItem;  //TODO: fallback content
	
		loading.show();

		rehttp.query("get_post")
		.whereEquals("post_type",options.post_type)
		.whereEquals("id", options.id)
		.find(function(data) {

		    loading.hide();

			if (data) {
				data.post.date_formated = getFormatedDate(data.post.date_wapp);
				$scope.item = data.post;
			}
		});
		
        $scope.sharePost = function () {

            var subject = $scope.item.title;
            var message = $scope.item.content;
            message = message.replace(/(<([^>]+)>)/ig,"");

            var link = $scope.item.url;
			var image = $scope.item.thumbnail;

            window.plugins.socialsharing.share(subject, subject, image, link);
        };
     };
}());
