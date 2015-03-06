'use strict';

var Bacon = require('baconjs');
var Firebase = require('firebase');
var firebaseUrl = 'https://endurance-almaty.firebaseio.com';
var ref = new Firebase(firebaseUrl);
var _ = require('lodash');
var JsSHA = require('jssha');
var Identicon = require('./identicon');

module.exports = {
  ref: new Firebase(firebaseUrl),
  // USER AUTHENTICATION
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
  // CHECK IF USER IS AUTHENTICATED, RETURNS AUTHENTICATION STATE
  getAuth: function() {
    return ref.getAuth();
  },
  // USER LOGOUT
  logout: function() {
    ref.unauth();
  },
  // GET USER'S EMAIL
  getCurrentUserEmail: function() {
    return ref.getAuth().password.email;
  },
  // GET CURRENT USERS'S ID
  getCurrentUserId: function() {
    if (ref.getAuth()) {
      return ref.getAuth().uid;
    }
  },
  getUserById: function(id) {
    var _usersRef = ref.child('users');
    return Bacon.fromBinder(function(sink) {
      _usersRef.child(id).on('value', function(userSnapshot) {
        sink(_.extend(userSnapshot.val(), {
          user: id
        }));
      });
    });
  },
  // GENERATES 32x32px USERPIC
  getBase64Userpic: function(text) {
    if (text) {
      var textSHA = new JsSHA(text, 'TEXT');
      var hash = textSHA.getHash('SHA-1', 'HEX');
      var data = new Identicon(hash, 32, 4/32).toString();
      return 'data:image/png;base64,' + data;
    }
  },
  // GENERATES 64x64px USERPIC
  getLargeBase64Userpic: function(text) {
    if (text) {
      var textSHA = new JsSHA(text, 'TEXT');
      var hash = textSHA.getHash('SHA-1', 'HEX');
      var data = new Identicon(hash, 48, 4/48).toString();
      return 'data:image/png;base64,' + data;
    }
  },
  // APPEND WORKOUT TO A DAY
  createWorkout: function(workout, day) {
    var _dayWorkoutsRef = ref.child('days').child(day).child('workouts');
    var _workoutsRef = ref.child('workouts');
    return Bacon.fromCallback(function(workout, sink){
      var workoutKey =  _dayWorkoutsRef.push(_workoutsRef.push(workout).key()).key();
      sink(workoutKey);
    }, workout);
  },
  getUsernameById: function(userId) {
    var _usernameRef = ref.child('users/'+userId+'/username');
    var username = '';
    _usernameRef.once('value', function(snapshot) {
      console.log(snapshot.val(), 'username snapshot');
      username = snapshot.val();
    });
    return username;
  },
  updateWorkout: function(config) {
    if (config && config.key && config.text) {
      var _workoutRef = ref.child('workouts').child(config.key);
      return Bacon.fromCallback(function(config, sink) {
        _workoutRef.transaction(function(currentData) {
          var newData = currentData || {};
          newData.text = config.text;
          newData.editedTimestamp = config.editedTimestamp;
          return newData;
        }, function(error, committed) {
          if (error) {
            sink(error);
          } else if (!committed) {
            sink(_.extend(new Error(), {key: 'ABORTED_TRANSACTION'}));
          } else {
            sink('success');
          }
        });
      }, config);
    }
  },
  deleteWorkout: function(config) {
    var _dayWorkoutsRef = ref.child('days').child(config.day).child('workouts');
    var _workoutRef = ref.child('workouts').child(config.key);
    return Bacon.fromCallback(function(sink) {
      if (config && config.key && config.day) {
        _dayWorkoutsRef.transaction(function(currentData) {
          var newData = currentData;
          var keyToRemove = _.findKey(newData, function(val) {
            return val === config.key;
          });
          if (keyToRemove) {
            delete newData[keyToRemove];
          }
          return newData;
        }, function(error, committed) {
          if (error) {
            console.log('error', error);
            sink(error);
          } else if (!committed) {
            console.log('aborted transaction');
            sink(_.extend(new Error(), {key: 'ABORTED_TRANSACTION'}));
          } else {
            _workoutRef.off();
            _workoutRef.remove();
          }
        });
      }
    }, config);
  }
};
