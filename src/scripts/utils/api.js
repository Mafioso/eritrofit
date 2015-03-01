'use strict';

var Bacon = require('baconjs');
var Firebase = require('firebase');
var ref = new Firebase('https://endurance-almaty.firebaseio.com');
var _ = require('lodash');
var JsSHA = require('jssha');
var Identicon = require('./identicon');

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
  },
  getEmail: function() {
    return ref.getAuth().password.email;
  },
  getBase64Userpic: function(text) {
    var textSHA = new JsSHA(text, 'TEXT');
    var hash = textSHA.getHash('SHA-1', 'HEX');
    var data = new Identicon(hash, 32, 4/32).toString();
    return 'data:image/png;base64,' + data;
  },
  getLargeBase64Userpic: function(text) {
    var textSHA = new JsSHA(text, 'TEXT');
    var hash = textSHA.getHash('SHA-1', 'HEX');
    var data = new Identicon(hash, 48, 4/48).toString();
    return 'data:image/png;base64,' + data;
  }
};
