export const environment = {
  production: false,
  //Special alias to your host loopback interface (i.e., 127.0.0.1 on your development machine)
  // baseUrl: 'https://internal.questnr.com/api/v1/',
  baseUrl: 'https://a7ebacfeda5e.ngrok.io/api/v1/',
  allowTracking: false,
  googleKey: '836632017511-na1k4gagi79qlvdp644q1shd0rjffoc9.apps.googleusercontent.com',
  fbKey: '1336590906533811',
  s3Bucket: 'questnr-user-assets',
  // s3Bucket: 'questnr-beta',
  firebase: {
    apiKey: 'AIzaSyAgfiLd02cWEIMafWhLrl4kBzpQrRE266k',
    authDomain: 'questnr-web-1586188588294.firebaseapp.com',
    databaseURL: 'https://questnr-web-1586188588294.firebaseio.com',
    projectId: 'questnr-web-1586188588294',
    storageBucket: 'questnr-web-1586188588294.appspot.com',
    messagingSenderId: '836632017511',
    appId: '1:836632017511:web:d69f610ffc055767aa72c2'
  }
};
