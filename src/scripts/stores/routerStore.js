'use strict';

var flux = require('fluxstream');
var RouterActions = require('../actions/RouterActions');
var AuthActions = require('../actions/AuthActions');
var api = require('../utils/api');
var views = require('../constants/views');
var routes = require('../constants/routes');
var RoutePattern = require('route-pattern');
var _ = require('lodash');
var moment = require('moment');
// var typeCheck = require('type-check').typeCheck;


module.exports = flux.createStore({
  init: function() {
    var matchers = [];
    for (var view in routes) {
      var pattern = RoutePattern.fromString(routes[view]);
      matchers.push({
        pattern: pattern,
        view: view
      });
    }

    // listen to popstate
    RouterActions.popstate.listen(function(payload) {
      var newState = payload;
      // payload should contain:
      // 1. target_url - transition to this url
      // 2. current_url - transition from this url
      // 3. current_view - transition from this view

      if (newState.target_url === routes.LOGOUT) {
        // do absolutely nothing and wait for redirect
        AuthActions.logout();
        return;
      }

      // CHECK IF VIEW EXISTS
      // after check newState should contain
      // 1. target_view - transition to this view
      // 2. params - props for target_view
      for (var i in matchers) {
        if (matchers[i].pattern.matches(payload.target_url)) {
          var params = matchers[i].pattern.match(payload.target_url);
          newState.target_view = matchers[i].view;
          newState.params = params.pathParams;
        }
      }

      // VIEW DOESN'T EXIST,
      // redirect to 404
      if (!newState.target_view) {
        newState.update_url = true;
        newState.target_view = views.NOT_FOUND;
        newState.target_url = routes.NOT_FOUND;

        RouterActions.setView(newState);
        return;
      }

      // USER AUTHORIZED?
      if (api.getAuth()) {
        var userStream = api.getUserById(api.getCurrentUserId());
        userStream.onValue(function(payload) {
          AuthActions.userStream(payload);
        });

        // HAVE RIGHTS FOR THIS PAGE?
        // 1. special case for login and password reset:
        //      - if popstate.next doesn't exist, set view to INDEX and target_url to routes.INDEX
        // 2. show 403 if doesn't have rights
        // 3. props or view update both change router's state, so rerender will be initiated,
        //    no need to split them into different channels

        if (_.indexOf([views.LOGIN, views.PASSWORD_RESET, views.INDEX], newState.target_view) > - 1) {
          // redirect!
          var today = moment().format('DDMMYY');
          newState.update_url = true;
          newState.target_view = views.DAY;
          newState.target_url = '/day/'+today;
          newState.params = { day: today };
        }

        // TODO: check for rights!
        // ...

      } else {

        // prompt login for pages, that are not LOGIN or PASSWORD_RESET
        if (_.indexOf([views.LOGIN, views.PASSWORD_RESET], newState.target_view) === -1) {
          newState.update_url = true;
          newState.target_view = views.LOGIN;
          newState.params.next_url = newState.target_url;
          newState.target_url = routes.LOGIN;
        }
      }

      RouterActions.setView(newState);
      return;

    });

    RouterActions.redirectPrompt.listen(function(payload) {
      RouterActions.popstate(_.assign(payload, {update_url: true}));
    });

  },
  config: {
    setView: {
      action: RouterActions.setView
    }
  }
});
