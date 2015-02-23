'use strict';

var flux = require('fluxstream');
var AuthActions = require('../actions/AuthActions');
var RouterActions = require('../actions/RouterActions');
var api = require('../utils/api');
var routes = require('../constants/routes');
var typeCheck = require('type-check').typeCheck;


module.exports = flux.createStore({
  init: function() {
    AuthActions.submitSignIn.listen(function(payload) {
      var router_data = payload.router_data;
      var fetchToken = api.tryAuth(payload.email, payload.password);

      fetchToken.onValue(function(payload) {
        if (typeCheck('Error',payload)) {
          AuthActions.signInError(payload);
        } else {
          if (!router_data.target_url) { router_data.target_url = routes.INDEX; }
          AuthActions.signInSuccess(router_data);
        }
      });
    });
    AuthActions.signInSuccess.listen(function(payload) {
      RouterActions.redirectPrompt(payload);
    });
  },
  config: {
    errors: {
      action: AuthActions.signInError
    }
  }
});
