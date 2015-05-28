var wapp = angular.module('wapp');

wapp.factory('CategoriesData', function(){

    var data = {
        url: '/get_category_index/',
        category_url: '/get_category_posts/'
    };

    return data;
});


// Products Data: JSON Products configuration
wapp.factory('ProductsData', function(){

    var data = { url: 'json/products.json', letterLimit: 100 };

    return data;
});


// Posts Data: JSON Wordpress Posts configuration
wapp.factory('PostsData', function(){

    /* (For DEMO purposes) Local JSON data */
    var data = { url: 'json/wordpress.json' };

    return data;
});

