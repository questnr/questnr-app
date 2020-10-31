importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyAgfiLd02cWEIMafWhLrl4kBzpQrRE266k",
    authDomain: "questnr-web-1586188588294.firebaseapp.com",
    databaseURL: "https://questnr-web-1586188588294.firebaseio.com",
    projectId: "questnr-web-1586188588294",
    storageBucket: "questnr-web-1586188588294.appspot.com",
    messagingSenderId: "836632017511",
    appId: "1:836632017511:web:d69f610ffc055767aa72c2"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// self.addEventListener('push', function (event) {
//     if (!(self.Notification && self.Notification.permission === 'granted')) {
//         return;
//     }

//     var data = {};
//     if (event.data) {
//         data = event.data.json();
//     }
//     console.log("data", data);
//     var notificationTitle = data.notification.title || "Something Has Happened";
//     var body = data.notification.body || "Here's something you might want to check out.";
//     var image = data.notification.image || "";

//     const notificationOptions = {
//         body: body,
//         icon: image
//     };

//     return self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });

// messaging.setBackgroundMessageHandler(function (payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: 'Background Message body.',
//         icon: '/firebase-logo.png'
//     };

//     return self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });

// self.addEventListener('notificationclick', function (event) {
//     console.log("Hello");
//     event.notification.close();
//     event.waitUntil(self.clients.openWindow(event.notification.data.openLink));
// });