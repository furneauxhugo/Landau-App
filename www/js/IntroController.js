(function() {
	/* Intro controller */
	angular.module('wapp').controller('IntroController', function($scope, rehttp, $location, ImgCache) {
		
		$scope.slides = [];
		
		ImgCache.$promise.then(function() {
		
		 /* Retrieval of the object that contains the whole main config */
		rehttp.query("get_options").find(function(options) {
			
			if (!options) return;
			
			var introPostId = options.intro_page_slider;
			console.log("intro:"+introPostId);
			

			/* Intro slider */
			rehttp.query("get_posts")
			.whereEquals("post_type", "wapp")
			.whereEquals("meta_key", "wapp_type")
			.whereEquals("meta_value", "intro")
			.limit(1)
			.find(function(data) {
				
				if (data) {
					var slides = data.posts[0].custom_fields.wapp_slider;
					var attachments = data.posts[0].attachments;
					items = [];
					for (var i in slides) {
						for(var j in attachments){
							if(attachments[j].id == slides[i].image_id){
								var x = {
									caption: slides[i].image_caption,
									picture: attachments[j].images.wapp_vertical_full.url,
									description: slides[i].image_description
								};
								items.push(x);
								
							}
						}
					}
						
					$scope.slides = items;
				}
			});

		});
		
		});
		
		$scope.dismiss = function() {
			console.log("take me out");
			$(".splash").hide();
		}		
	});

	
}());
