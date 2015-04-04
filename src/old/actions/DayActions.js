'use strict';
var flux = require('fluxstream');

module.exports = flux.createActions([
  'setupDayStreams',

  'workoutsStream',

  'createWorkout',
  'createWorkoutSuccess',

  'updateWorkout',
  'updateWorkoutSuccess',

  'deleteWorkout',
  'deleteWorkoutSuccess'
]);
