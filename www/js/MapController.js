(function() {
    angular.module('wapp').controller('MapController', ['$scope', 'rehttp', MapController]);
	
	function MapController($scope, rehttp) {

        $scope.windowOptions = false;
		$scope.map = {
			zoom: 12,
			center: {
				latitude: 0.0,
				longitude: 0.0
			},
			markers: []
		};
		
        $scope.onClick = function () {
        this.windowOptions = !this.windowOptions;
        };

        $scope.closeClick = function () {
        this.windowOptions = false;
        };

		rehttp.query("get_options").find(function(options) {
			if (options) {
				$scope.map.zoom = 12;
				$scope.map.center = {
					latitude: options.lat,
					longitude: options.lon
				};
				$scope.map.markers =[
					{
						id: 1,
						latitude: options.lat,
						longitude: options.lon,
						title: 'This is our main store'
					}
				];

			}
		});
    };
}());