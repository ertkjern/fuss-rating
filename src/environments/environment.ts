// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyD1L1D_iM8n46kapVqA4yY5XPhSXFS4XBE',
    authDomain: 'evry-fuss-test.firebaseapp.com',
    databaseURL: 'https://evry-fuss-test.firebaseio.com',
    projectId: 'evry-fuss-test',
    storageBucket: 'evry-fuss-test.appspot.com',
    messagingSenderId: '429338436802'
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
