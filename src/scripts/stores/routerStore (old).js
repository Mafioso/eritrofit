'use strict';

var flux = require('fluxstream');
var routerActions = require('../actions/routerActions');
var routes = require('../constants/routes');
var views = require('../constants/views');
var Firebase = require("firebase");
var ref = new Firebase('https://endurance-almaty.firebaseio.com');

var extend = require('extend-object');

var routerStore = flux.createStore({
  config: {
    transitionTo: {
      action: routerActions,
      map: function(payload) {
        console.log(ref.getAuth());
        var state = {};
        if (payload) {
          state = extend(state, payload);
        }
        if (true) {
          state = extend(state, { redirectUrl: routes.LOGIN, redirectView: views.LOGIN });
        }
        // console.log(state, '>>>>> sent data');
        return state;
      }
    }
  }
});

module.exports = routerStore;