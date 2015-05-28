(function() {
    angular.module('wapp').controller('PostController', ['$scope', 'PostsData', '$sce', PostController]);
	function PostController($scope, PostsData, $sce) {
        $scope.item = PostsData.selectedItem;

        $scope.content = $sce.trustAsHtml($scope.item.content);

        $scope.loadURL = function (url) {

            window.open(url,'_blank');
        }

        $scope.sharePost = function () {

            var subject = $scope.item.title;
            var message = $scope.item.content;
            message = message.replace(/(<([^>]+)>)/ig,"");

            var link = $scope.item.url;
			var image = $scope.item.thumbnail;



            window.plugins.socialsharing.share(message, subject, image, link);
        }

     };
	
}());