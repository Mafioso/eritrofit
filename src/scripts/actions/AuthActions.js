'use strict';
var flux = require('fluxstream');

module.exports = flux.createActions([
  'submitSignIn',
  'signInError',
  'signOut',
  'signInSuccess',
  'logout'
]);
