var app = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },

    onDeviceReady: function() {
		ImgCache.options.debug = true;
		ImgCache.options.chromeQuota = 50*1024*1024;        
		ImgCache.init(function() {
			console.log('ImgCache init: success!');
			app.onImgCacheReady();
		}, function(){
			console.log('ImgCache init: error! Check the log for errors');
		});
	},
	onImgCacheReady: function() {
		
		StatusBar.hide();
		
        angular.bootstrap(document, ['wapp']);
        app.receivedEvent('deviceready');
		
		if(navigator && navigator.splashscreen) navigator.splashscreen.hide();

        ons.setDefaultDeviceBackButtonListener(function() {
            if (navigator.notification.confirm("Are you sure to close the app?",
                function(index) {
                    if (index == 1) { // OK button
                        navigator.app.exitApp(); // Close the app
                    }
                }
            ));
        });

        $(document).on('click', 'a[href^=http], a[href^=https]', function(e){

            e.preventDefault();
            var $this = $(this);
            var target = '_system'; //$this.data('inAppBrowser') || '_blank';

			var href = $this.attr('href');
			window.open(href, target);


        });

        app.initPushwoosh();

    },

    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },

    initPushwoosh: function() {
        var pushNotification = window.plugins.pushNotification;

		if(device.platform == "Android") {
			registerPushwooshAndroid();
		}
        if (device.platform == "iPhone" || device.platform == "iOS") {
            registerPushwooshIOS();
        }
    }

};

(function() {
    var app = angular.module('wapp', ['onsen.directives', 'ngTouch', 'ngSanitize', 'angular-carousel', 'google-maps'.ns(), 'appLocalStorage', 'LocalStorageModule', 'ui.map', 'ui.event', 'ngStorage', 'ngSanitize', 'ImgCache', 'LocalForageModule']);

	var DEFAULT_LANG='en';
	var lang = 'en'; //TODO: get from local config


	app.config(function($compileProvider) {
	    $compileProvider.aHrefSanitizationWhitelist(/^(wapp|https?):/);		
	});









	 app.controller('PostsController', ['$scope', '$http', 'PostsData', PostsController]);
	 function PostsController($scope, $http, PostsData) {
        $scope.msg = "Loading...";

        $http({method: 'GET', url: PostsData.url}).
        success(function(data, status, headers, config) {
            $scope.posts = data.posts;

            if ($scope.posts.length < 1)
            {
                $scope.msg = "Nothing found.";
            }else{
                $scope.msg = undefined;
            }

            var page = 1;

            var pageSize = 3;

            $scope.paginationLimit = function(data) {
            return pageSize * page;
            };

            $scope.hasMoreItems = function() {
            return page < ($scope.posts.length / pageSize);
            };

            $scope.showMoreItems = function() {
            page = page + 1;
            };

        }).
        error(function(data, status, headers, config) {
            $scope.msg = 'An error occured:' + status;
        });

        $scope.showDetail = function(index) {
            var selectedItem = $scope.posts[index];
            PostsData.selectedItem = selectedItem;
            appNavigator.pushPage('post.html', selectedItem);
        }

    };







    /* Home page slider controller */
	  app.controller('HomeSliderController', ['$scope', 'rehttp', '$localStorage', HomeSliderController]);
	function HomeSliderController($scope, rehttp, $localStorage) {

		$scope.$storage = $localStorage;
		
		/* First, we take the cached items */
        var items = $localStorage.homeSliderItems || [];
		
		var API_BASE_URL = "http://www.pumpum.net/edd/api";
		
		/* Then, we refresh the items via http (if available) */
		rehttp.query("get_options").find(function(data, status, headers, config) {
			
			if (!data) return;
			
			var sliderPostId = data.home_page_slider;
			rehttp.query("get_post")
			.whereEquals("id", sliderPostId)
			.whereEquals("post_type", "wapp")
			.find(function(data, status, headers, config) {
				if (data) {
					var attachments = data.post.attachments;
					items = [];
					for (var i in attachments) {
						var x = {
							label: attachments[i].title,
							src: attachments[i].url,
							location: attachments[i].url
						};
						items.push(x);
					}
				
					$scope.slides = [];
					addSlides($scope.slides);
				
					$localStorage.homeSliderItems = items;
				}
			});


	    });

        function addSlides(target) {
            angular.forEach(items,function(item,index){
                target.push({
                    label: item.label,
                    picture: item.src,
                    location: item.location,
                    item: (index + 1)
                });
            });
         };

        $scope.slides = [];
        addSlides($scope.slides);

    };




    app.controller('ModalController', ['$scope', function($scope) {

        $scope.show = function () {
            modal.show();
        }

        $scope.hide = function () {
            modal.hide();
        }

     }]);


    app.filter('partition', function($cacheFactory) {
          var arrayCache = $cacheFactory('partition');
          var filter = function(arr, size) {
            if (!arr) { return; }
            var newArr = [];
            for (var i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));
            }
            var cachedParts;
            var arrString = JSON.stringify(arr);
            cachedParts = arrayCache.get(arrString+size);
            if (JSON.stringify(cachedParts) === JSON.stringify(newArr)) {
              return cachedParts;
            }
            arrayCache.put(arrString+size, newArr);
            return newArr;
          };
          return filter;
        });


})();