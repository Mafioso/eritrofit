'use strict';

var _ = require('lodash');

var beats = {
  get: function(text) {
    function _isHeartRate(rate) {
      // allowed range for pulse is 40 to 300
      if (rate >= 40 && rate <= 300) {
        return true;
      }
      return false;
    }
    var wordsWithDigits = _.words(text, /\S*\d+\S*/g);
    var candidates = []; // contains all the canidates that can become a heart rate

    _.forEach(wordsWithDigits, function(word) {
      var subWords = _.words(word, /\d+/g);
      var candidate = {
        beats: []
      };

      if (subWords.length < 3) {
        _.forEach(subWords, function(subWord) {
          candidate.beats.push(parseInt(subWord, 10));
        });
      }
      // validate candidate.beats
      if (_.reduce(candidate.beats, function(result, value) {
        return result && _isHeartRate(value);
      }, true)) {
        candidates.push(candidate);
      }
    });

    var result = [];

    if (candidates[0]) {
      if (candidates[0].beats.length === 1) {
        result.push(candidates[0].beats[0]);
        if (candidates[1] && candidates[1].beats.length === 1) {
          result.push(candidates[1].beats[0]);
        } else if (candidates[1]) {
          result = candidates[1].beats;
        }
      } else {
        result = candidates[0].beats;
      }
    }
    return result;
  }
};

module.exports = beats;
