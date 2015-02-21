'use strict';

var Bacon = require('baconjs');
var Firebase = require('firebase');
var ref = new Firebase('https://endurance-almaty.firebaseio.com');

module.exports = {
  auth: function(email, password) {
    return Bacon.fromCallback(
      ref.authWithPassword,
      {
        email: email,
        password: password
      },
      function(error, authData) {
        if (error) {
          console.log(error, 'login failed');
          return error;
        } else {
          console.log(authData, 'login successful');
          return authData;
        }
      }
    );
    // return Bacon.fromNodeCallback(
    //   ref.authWithPassword,
    //   {
    //     email: email, password: password
    //   }
    // ).flatMap(function(data) {
    //   console.log(data, 'flatMap');
    //   return data;
    // });
  }
};