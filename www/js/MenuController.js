(function() {

    angular.module('wapp').controller('MenuController', ['$scope', 'rehttp', '$rootScope', 'MenuStorage', 'CategoriesData', 'PostsData', function($scope, rehttp, $rootScope, MenuStorage, CategoriesData, PostsData) {

        MenuData = MenuStorage.get();

		var refreshMenu = function() {
			rehttp.query("get_options").find(function(data) {
				if (data) {
					$scope.options = data;
				}				
			});
			
			rehttp.query("menus.get_menu").limit(100).find(function(data) {
				if (data && data.count) {
					$scope.items = [];
					angular.forEach(data.output, function(v) {
						if(v.icon[0].type == ''){
							this.push({ 'title': v.label, 'icon': '', 'object_type': v.object_type, 'id': v.object_id, 'url': v.url });
						}else{						
							this.push({ 'title': v.label, 'icon': v.icon[0], 'object_type': v.object_type, 'id': v.object_id, 'url': v.url });
						}
					}, $scope.items);
				}
			});
		}
		
		refreshMenu();
		
		$scope.$on('lang.change', function(event, value) {
			refreshMenu();
		});

        $scope.showDetail = function(index){
            var selectedItem = $scope.items[index];
            MenuData.selectedItem = selectedItem;
            console.log(selectedItem);
            if (selectedItem.object_type == 'custom') {
                window.open(selectedItem.url,'_blank');
            } else if (selectedItem.object_type == 'category') {

                $scope.page = 1;
                $scope.posts = [];
                $scope.title="";
                $scope.more = true;
                $scope.status_bar = "";

                CategoriesData.selectedItem = selectedItem;
                menu.close();
                appNavigator.pushPage('category-posts.html', {animation: 'fade'});


            } else if (selectedItem.object_type == 'page') {
				
				PostsData.selectedItem = selectedItem;
                menu.close();
                appNavigator.pushPage('page.html', {pageid: selectedItem.id});

            } else if (selectedItem.object_type == 'login') {
                menu.close();
                appNavigator.pushPage('login.html');
            } else {
            	
            }

        };
		
		$scope.showMap = function() {
			menu.close();
			appNavigator.pushPage('map.html');
		};

    }]);

	
}());