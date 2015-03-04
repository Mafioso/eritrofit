'use strict';
var flux = require('fluxstream');

module.exports = flux.createActions([
  'submitSignIn',
  'signInError',
  'signInSuccess',
  'logout',

  'userStream'
]);
