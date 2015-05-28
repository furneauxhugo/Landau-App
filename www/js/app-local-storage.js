angular.module('appLocalStorage', [])

.factory('FeedStorage', function() {
    return {
        get: function() {
            var feeds = window.localStorage['feeds'];
            if(feeds) {
                return angular.fromJson(feeds);
            }
            return {};
        },
        save: function(feeds) {
            window.localStorage['feeds'] = angular.toJson(feeds);
        },
        clear: function() {
            window.localStorage.removeItem('feeds');
        }
    }
})
.factory('MenuStorage', [function () {
    return {
        get: function() {
            var menu = window.localStorage['menu'];
            if (menu) {
                return angular.fromJson(menu);
            }
            return {};
        },
        save: function(menu) {
            window.localStorage['menu'] = angular.toJson(menu);
        },
    };
}])
