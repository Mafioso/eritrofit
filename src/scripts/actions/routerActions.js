'use strict';
var flux = require('fluxstream');

module.exports = flux.createActions([
  'popstate',       // fires every time when url changes
  'setView',        // subscription for RouteHandler, fires when there is a need to switch view
  'redirectPrompt'
]);
