'use strict';
var flux = require('fluxstream');

module.exports = flux.createActions([
  'promptSignIn',
  'submitSignIn',
  'signInError',
  'signOut',
  'signInSuccess'
]);