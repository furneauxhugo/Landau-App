(function() {
    angular.module('wapp').controller('CategoryPostsController', ['$scope', 'rehttp', '$filter', 'CategoriesData', '$http', '$q', CategoryPostsController]);
	
	function CategoryPostsController($scope, rehttp, $filter, CategoriesData, $http, $q) {
 
		var loadFromCache = true;
		var POSTS_PER_PAGE = 10;
		
		var PostsDelegateFactory = function(totalPages, totalPosts) {
			
			return {
				totalPages: totalPages,
				totalPosts: totalPosts,
				configureItemScope : function(index, itemScope) {
					if (!itemScope.item) {

						itemScope.item = {
							posts: [],
							rand: Math.random(),
							loading: true
						};
						itemScope.canceler = $q.defer();
						


						
						rehttp.query('get_category_posts')
							.whereEquals('id', CategoriesData.selectedItem.id)
							.limit(POSTS_PER_PAGE).page(index+1)
							.cacheMode(true,true,true)
							.onTimeout(itemScope.canceler.promise)
							.find(function(data, status, headers, config) {
								//$scope.title = CategoriesData.selectedItem.title;
								if (data) {
									itemScope.item.loading = false;
									itemScope.item.posts = _.map(data.posts, function(p) {
										p.date_formated = getFormatedDate(p.date_wapp);
										return p;
									});
								}
							});	  
					}
				},
				calculateItemHeight : function(index) {
					if (index===undefined) return 95 * POSTS_PER_PAGE;
					var h = 95 * (index==(this.totalPages-1)? (this.totalPosts%POSTS_PER_PAGE) : POSTS_PER_PAGE);
					return h;
				},
				countItems : function() {
					return this.totalPages;
				},
				destroyItemScope: function(index, itemScope) {
					itemScope.canceler.resolve();
				},
				setPagesAndPosts : function(numPages, numPosts) {
						this.totalPages = numPages;
						this.totalPosts = numPosts;
				}
			};
		};
		
		/* At the start, there are no posts. */
		$scope.PostsDelegate = PostsDelegateFactory(1, POSTS_PER_PAGE);
		
        $scope.loadData = function (refresh, $done) {
			
		    if (!refresh) loading.show();

			rehttp.query('get_category_posts')
			.whereEquals('id', CategoriesData.selectedItem.id)
			.limit(POSTS_PER_PAGE).page(1)
			.cacheMode(!refresh,true,!refresh)
			.find(function(data, status, headers, config) {

				if (!refresh) loading.hide();

				$scope.msg = "";
				$scope.title = CategoriesData.selectedItem.title;
				if (data) {
					console.log("pages:" + data.pages + ", posts:"+data.category.post_count);
					//$scope.PostsDelegate = PostsDelegateFactory(data.pages, data.category.post_count);
					$scope.PostsDelegate.setPagesAndPosts(data.pages, data.category.post_count);
				}
				
				loadFromCache = false;
				
				if ($done) { 
					$done(); 
				}
			});
        }

        $scope.showMoreItems = function () {
            $scope.page += 1;
            $scope.msg = "Loading...";
            $scope.loadData();
        }

        $scope.hasMoreItems = function () {
            return $scope.more;
        }

		
        $scope.title="";
        $scope.loadData(false, undefined);





        $scope.showSearchDetail = function(postid) {



            appNavigator.pushPage('category-post.html', {id:postid, animation:'slide'});
        }

    };
	
}());
