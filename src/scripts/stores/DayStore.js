'use strict';

var flux = require('fluxstream');
var DayActions = require('../actions/DayActions');
var api = require('../utils/api');
var moment = require('moment');
// var _ = require('lodash');

module.exports = flux.createStore({
  init: function() {
    DayActions.setupDayStreams.listen(function(payload) {
      var workoutsStream = api.getWorkoutsStreamByDay(payload.day);
      workoutsStream.onValue(function(payload) {
        DayActions.workoutsStream(payload);
      });
    });
    DayActions.createWorkout.listen(function(payload) {
      // payload consists of workout instructions (text) and day
      // what info workout should have?
      // 1. local timestamp, assume it's correct
      // 2. author id
      // 3. text
      // 4. day
      // var timestamp = moment().utc().format();
      // var authorId = api.getCurrentUserId();
      // if (timestamp && authorId && payload.text && payload.day) {
      //   var setWorkout = api.setWorkout({
      //     timestamp: timestamp,
      //     author: authorId,
      //     text: payload.text
      //   }, payload.day);
      //   setWorkout.onValue(function(payload) {
      //     DayActions.createWorkoutSuccess(payload);
      //   });
      // }
    });
  },
  config: {
    // errors: {
    //   action: DayActions.setFetchError
    // },
    // setDay: {
    //   action: DayActions.setDay
    // },
    workoutsStream: {
      action: DayActions.workoutsStream
    },
    createWorkoutSuccess: {
      action: DayActions.createWorkoutSuccess
    }
  }
});
