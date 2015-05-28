(function() {

    angular.module('wapp').controller('HomeController', ['$scope', 'rehttp', '$sce', function($scope, rehttp, $sce) {
		

		 $scope.clickedOnSlide = function(index) {
			 console.log("clickedOnSlide: " + index);
			 var slide = $scope.slides[index];
			 console.log(slide);
			 if (slide.hasPermalink) {
             	appNavigator.pushPage('page.html', {pageid: slide.permalink});
			 }
			 /*
			 if (slide.hasPermalink) {
				 window.open(slide.permalink, '_system');
			 }
			 */
		 };
		 
		 $scope.load = function($done) {
			 /* Retrieval of the object that contains the whole main config */
			 rehttp.query("get_options").find(function(options) {

				 if (!options) return;
				  
				 if(options.wapp_config_display_intro == 'yes'){
					 introscreen.show();
				 }

				 var sliderPostId = options.home_page_slider;
				 var t1PostId = options.home_page_type_one;
				 var t2PostId = options.home_page_type_two;
				 var t3PostId = options.home_page_type_three;
			
				 /* Block home slider */
				 if(options.wapp_config_display_slider == 'yes'){
					 rehttp.query("get_posts")
					 .whereEquals("post_type","wapp")
					 .whereEquals("meta_key","wapp_type")
					 .whereEquals("meta_value","slider")
					 .limit(1)
					 .find(function(data) {
						 
						 if (!data) return;
						 
						 var slides = data.posts[0].custom_fields.wapp_slider;
						 var attachments = data.posts[0].attachments;
						 var image_thumbnail;
						 items = [];
						 
						for (var i in slides) {
							for(var j in attachments){
								if(attachments[j].id == slides[i].image_id){
									var x = {
										caption: slides[i].image_caption,
										picture: attachments[j].images.wapp_horizontal_slider.url,
										description: slides[i].image_description,
										hasPermalink: slides[i].add_permalink_to_slide,
										permalink: slides[i].slide_permalink
									};
									items.push(x);
									
								}
							}
						}
					
						console.log(items);
						console.log(slides);

						 $scope.slides = items;

					 });
				 }
			
				 /* Block Posts Columns */
				 if(options.wapp_config_display_columns == 'yes'){
					 rehttp.query("get_posts")
					 .whereEquals("post_type","wapp")
					 .whereEquals("meta_key","wapp_type")
					 .whereEquals("meta_value","option1")
					 .limit(options.wapp_config_column_posts)
					 .find(function(data) {
									
						 if (data) {
							 
							 $scope.letterLimit = 100;
							 $scope.products = _.map(data.posts, function(p) {
								 p.date_formated = getFormatedDate(p.date_wapp);
								 return p;
							 });
							 $scope.products = data.posts;
						 }
					
					 });
				 }
			
				 /* Block Full width posts */
				 if(options.wapp_config_display_full == 'yes'){
					 rehttp.query("get_posts")
					 .whereEquals("post_type","wapp")
					 .whereEquals("meta_key","wapp_type")
					 .whereEquals("meta_value","option2")
					 .limit(options.wapp_config_full_posts)
					 .find(function(data) {
	
						 if (data) {
							 $scope.posts = _.map(data.posts, function(p) {
								 p.date_formated = getFormatedDate(p.date_wapp);
								 return p;
							 });
							 $scope.letterLimit = 100;
							 $scope.posts = data.posts;
						 }				
					 });
				 }
			
				 /* Block posts list */
				 if(options.wapp_config_display_list == 'yes'){
					 rehttp.query("get_posts")
					 .whereEquals("post_type","wapp")
					 .whereEquals("meta_key","wapp_type")
					 .whereEquals("meta_value","option3")
					 .limit(options.wapp_config_list_posts)
					 .find(function(data) {
	
						 if (data) {
							 $scope.categories = _.map(data.posts, function(p) {
								 p.date_formated = getFormatedDate(p.date_wapp);
								 return p;
							 });
							 $scope.categories = data.posts;
							 $scope.letterLimit = 100;
						 }		
					 });
				 }
			
			 });
		}
		
		$scope.load();

		/* Method for showing an item in its own page. */
		$scope.showDetail = function(postid) {
			appNavigator.pushPage('product.html', {post_type: "wapp", id: postid, animation: 'slide'});
		}

    }]);

	
}());
