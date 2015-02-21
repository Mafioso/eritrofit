'use strict';

// var Bacon = require('baconjs');
var flux = require('fluxstream');
var AuthActions = require('../actions/AuthActions');
var api = require('../utils/api');



module.exports = flux.createStore({
  init: function() {
    AuthActions.submitSignIn.listen(function(payload) {
      var fetchToken = api.auth(payload.user, payload.pass);
      fetchToken.onError(AuthActions.signInError);
      fetchToken.onValue(function(data) {
        console.log(data, 'fetchToken');
      });
    });
  },
  config: {
    errors: {
      action: AuthActions.signInError
    }
  }
});


// var userStore = flux.createStore({
//   config: {
//     auth: {
//       action: userActions,
//       map: function(payload) {
//         console.log(payload, '>>>>> user store payload');
//         var state = {};
//         if (payload) {
//           if (payload.email && payload.password) {
//             _ref.authWithPassword({
//               email: payload.email,
//               password: payload.password
//             }, function(error, authData) {
//               if (error) {
//                 console.log(error, 'error :(');
//                 state.error = error;
//               } else {
//                 console.log(authData, 'success!');
//                 state = authData;
//               }
//               return state;
//             });
//           } else {
//             state.error = 'EMPTY';
//             return state;
//           }
//         }
//       },
//       inputAction: userActions,
//       inputHandler: function(payload) {
//         console.log(payload, 'input handler')
//       }
//     }
//   }
// });

// module.exports = userStore;