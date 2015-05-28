(function() {
	
	/** This service is helpful in order to retrieve data from the backend even in offline mode. It serves firts 
		the content previously stored (if any) and then the response from a http request. Every time a http
		request is made, the response is stored in local storage. */
	angular.module('wapp').service('rehttp', ['$http', '$localStorage', '$localForage', function($http, $localStorage, $localForage) {
				
		/** This function builds an object for doing queries to the http backend, with
		 * some method functions for chaineable query building.
		 * The way to perform a query is like this:
		 * rehttp.query('get_posts').whereEquals('cat', 'post').limit(10).find(callbackFunction);
		 */
		this.query = function(apiMethod) {
			var qobj = {
				partialUrl: "?json="+apiMethod,
				requestCache: true,
				requestNetwork: true,
				justOne: false,
				checksum: undefined,
				toutCallback: function() {console.log("Timeout!")},
				find: function(callback) {
					
					if (!$localStorage.contents) {
						$localStorage.contents = {};
					};
					
					var url = API_BASE_URL + this.partialUrl;
					var tw = true;
					
					if (this.requestCache) {
						this._fetchFromCache(url, callback);
					} else if (this.requestNetwork) {
						this._fetchFromNetwork(url, callback);
					}
				},
				_fetchFromCache: function(url, callback) {
					var jas = url.hashKey();
					var that = this;
					$localForage.getItem(jas).then(function(data) {
						if (data) {
							that.checksum = JSON.stringify(data).hashCode();
							if (callback) callback(data);
							if (that.requestNetwork && !that.justOne) that._fetchFromNetwork(url, callback);
						} else {
							if (callback) callback(undefined);
							if (that.requestNetwork) that._fetchFromNetwork(url, callback);
						}
					});
				},
				_fetchFromNetwork: function(url, callback) {
					var jas = url.hashKey();
					var that = this;
				 	$http.get(url, {timeout: this.toutCallback}).success(function(data, status, headers, config) {
						var h = JSON.stringify(data).hashCode();
						if (data && h!=that.checksum) $localForage.setItem(jas, data).then(function(v) {
							if (callback) callback(v);
						});
					});
				},
				whereEquals: function(param, value) {
					this.partialUrl += "&"+param+"="+value;
					return this;
				},
				localized: function() {
					this.partialUrl += "&lang="+($localStorage.lang || DEFAULT_LANG);
				},
				limit: function(n) {
					this.partialUrl += "&count="+n;
					return this;
				},
				page: function(n) {
					this.partialUrl += "&page="+n;
					return this;
				},
				cacheMode: function(requestCache, requestNetwork, justOne) {
					this.requestCache = requestCache;
					this.requestNetwork = requestNetwork;
					this.justOne = justOne;
					return this;
				},
				onTimeout: function(callback) {
					this.toutCallback = callback;
					return this;
				}
			};
			return qobj;
		};
		
		
		this.storedData = function(lang, partialUrl) {
			if (!$localStorage.contents) return undefined;
			else return $localStorage.contents[lang + ':' + partialUrl];
		};
	}]);
	
}());
