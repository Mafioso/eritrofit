'use strict';

var flux = require('fluxstream');
var routerActions = require('../actions/routerActions');
var routes = require('../constants/routes');

var extend = require('extend-object');

var routerStore = flux.createStore({
  config: {
    transitionTo: {
      action: routerActions,
      map: function(action) {
        var state = {};
        // if (true) {
        //   state = extend(state, action, {next: routes.LOGIN});
        // }
        state = extend(state, action);
        return state;
      }
    }
  }
});

extend(routerStore, { defaultRoute: routes.LOGIN });


module.exports = routerStore;