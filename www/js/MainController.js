(function() {

	/** Controlador for the main document: index.html */
	angular.module('wapp').controller('MainController', ['$scope', 'rehttp', MainController]);
	
	function MainController($scope, rehttp) {
		
		$scope.theme = "default";
		
		$scope.home_template = 'home.html'; //default value
		
		rehttp.query('get_options').find(function(options) {
		
			if (options && options.theme) {
				
				$scope.theme = options.theme;
				
				if(options.wapp_config_display_intro == 'yes'){
					$scope.home_template = 'home.html';					
				}else{
					$scope.home_template = 'home-nointro.html';										
				}
				
			}
		
		});
	};

}());