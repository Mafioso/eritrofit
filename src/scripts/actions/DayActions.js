'use strict';
var flux = require('fluxstream');

module.exports = flux.createActions([
  'setupDayStreams',

  'workoutsStream',
  'commentsStream',

  'createWorkout',
  'createWorkoutSuccess',

  'updateWorkout',
  'updateWorkoutSuccess',

  'deleteWorkout',
  'deleteWorkoutSuccess'
]);
