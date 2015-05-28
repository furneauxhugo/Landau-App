function registerPushwooshIOS() {
	var pushNotification = window.plugins.pushNotification;
    
    // Set push notification callback before we initialize the plugin
    document.addEventListener('push-notification',
        function(event) {
            var pushNotification = window.plugins.pushNotification;

            // Get the notification
            var notification = event.notification;

            // Display the notification
            navigator.notification.alert(notification.aps.alert,function() {console.log("Notification success")},"Notification","Close");

            // View full push payload
            //alert(JSON.stringify(notification));

            // Clear the App badge
            pushNotification.setApplicationIconBadgeNumber(0);
        }
    );
    
	// Trigger pending push notifications
    // pw_appid: PushWoosh Application Code
	pushNotification.onDeviceReady({pw_appid: PUSHWOOSH_ID});

	// Register for pushes
	pushNotification.registerDevice(
		function(status) {
			var deviceToken = status['deviceToken'];
			console.warn('registerDevice: ' + deviceToken);
			onPushwooshiOSInitialized(deviceToken);
		},
		function(status) {
			console.warn('failed to register : ' + JSON.stringify(status));
			//alert(JSON.stringify(['failed to register ', status]));
		}
	);
    
	// Reset badges on start
	pushNotification.setApplicationIconBadgeNumber(0);
}

function onPushwooshiOSInitialized(pushToken) {
	var pushNotification = window.plugins.pushNotification;
	// Retrieve the tags for the device
	pushNotification.getTags(
		function(tags) {
			console.warn('tags for the device: ' + JSON.stringify(tags));
		},
		function(error) {
			console.warn('get tags error: ' + JSON.stringify(error));
		}
	);
}