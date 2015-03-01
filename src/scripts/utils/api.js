'use strict';

var Bacon = require('baconjs');
var Firebase = require('firebase');
var ref = new Firebase('https://endurance-almaty.firebaseio.com');
var _ = require('lodash');

module.exports = {
  tryAuth: function(email, password) {
    return Bacon.fromCallback(function(email, password, sink) {
      if (email.length === 0) {
        sink(_.assign(new Error(), { code: 'EMPTY_EMAIL' }));
      }
      if (password.length === 0) {
        sink(_.assign(new Error(), { code: 'EMPTY_PASSWORD' }));
      }
      ref.authWithPassword({ email: email, password: password }, function(error, data) {
        if (error) {
          sink(error);
        } else {
          sink(data);
        }
      });
    }, email, password);
  },
  getAuth: function() {
    return ref.getAuth();
  },
  logout: function() {
    ref.unauth();
  }
};
