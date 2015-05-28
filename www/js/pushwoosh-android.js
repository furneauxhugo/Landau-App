
function registerPushwooshAndroid() {

	var pushNotification = window.plugins.pushNotification;
    
    // Set push notifications handler
    document.addEventListener('push-notification',
        function(event) {

            var title = event.notification.title;
            var userData = event.notification.userdata;

            //dump custom data to the console if it exists
            if (typeof (userData) !== "undefined") {
                console.warn('user data: ' + JSON.stringify(userData));
            }

            // Display the notification
            navigator.notification.alert(title,function() {console.log("Notification success")},"Notification","Close");

            // Stopping geopushes
            //pushNotification.stopGeoPushes();
        }
    );

    // Trigger pending push notifications
    // projectid: Google Project Number
    // appid: PushWoosh Application Code
    pushNotification.onDeviceReady({projectid: GCM_PROJECT_NUMBER, appid : PUSHWOOSH_ID});

	// Register for pushes
    pushNotification.registerDevice(
        function(status) {
            var pushToken = status;
            // Callback when pushwoosh is ready
			onPushwooshAndroidInitialized(pushToken);
        },
        function(status) {
            alert("failed to register: " +  status);
            console.warn(JSON.stringify(['failed to register ', status]));
        }
    );
}


function onPushwooshAndroidInitialized(pushToken) {
	// Output the token to the console
	console.warn('push token: ' + pushToken);

	var pushNotification = window.plugins.pushNotification;
	
	pushNotification.getTags(
		function(tags)
		{
			console.warn('tags for the device: ' + JSON.stringify(tags));
		},
		function(error)
		{
			console.warn('get tags error: ' + JSON.stringify(error));
		}
	);

}
