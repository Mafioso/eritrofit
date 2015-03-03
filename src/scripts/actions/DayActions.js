'use strict';
var flux = require('fluxstream');

module.exports = flux.createActions([
  'getDay',
  'setDay',
  'setFetchError',
  'createWorkout',
  'createWorkoutSuccess'
]);
