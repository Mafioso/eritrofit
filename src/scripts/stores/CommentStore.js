'use strict';

var flux = require('fluxstream');
var CommentActions = require('../actions/CommentActions');
var api = require('../utils/api');
var _ = require('lodash');

var CommentStore = flux.createStore({
  init: function() {
    var refs = [];

    CommentActions.setupCommentsStream.listen(function(payload) {
      // release the callbacks!
      _.forEach(refs, function(ref) {
        ref.off();
      });
      refs = [];

      if (payload) {
        var commentsRef = api.ref.child('workouts').child(payload.workoutId).child('comments');
        refs.push(commentsRef);

        commentsRef.on('child_removed', function(removedCommentSnap) {
          CommentActions.commentsStream({ action: 'REMOVE', key: removedCommentSnap.val() });
        });

        commentsRef.on('child_added', function(commentSnap) {
          var commentId = commentSnap.val();
          var commentRef = api.ref.child('comments').child(commentId);
          refs.push(commentRef);

          commentRef.on('value', function(commentSnap) {
            var comment = commentSnap.val();

            if (comment) {
              var userId = comment.author;
              var userRef = api.ref.child('users').child(userId);

              refs.push(userRef);

              userRef.on('value', function(userSnap) {
                var profile = userSnap.val();

                var commentPayload = _.extend(comment, {
                  action: 'PUT',
                  key: commentRef.key(),
                  username: profile.username
                });
                CommentActions.commentsStream(commentPayload);
              });
            }

          });

        });

      }
    });

    CommentActions.updateComment.listen(function(payload) {
      var updateCommentStream = api.updateComment(payload);
      updateCommentStream.onValue(function(payload) {
        if (payload === 'success') {
          CommentActions.updateCommentSuccess(payload);
        }
      });
    });

    CommentActions.deleteComment.listen(function(payload) {
      var deleteCommentStream = api.deleteComment(payload);
      deleteCommentStream.onValue(function(payload) {
        CommentActions.deleteCommentSuccess(payload);
      });
    });

    CommentActions.createComment.listen(function(payload) {
      // 1. local timestamp, assume it's correct
      // 2. author id
      // 3. text
      // 4. workout
      if (payload.timestamp && payload.user && payload.text && payload.workoutId) {
        var createComment = api.createComment({
          timestamp: payload.timestamp,
          author: payload.user,
          text: payload.text
        }, payload.workoutId);
        createComment.onValue(function(payload) {
          CommentActions.createCommentSuccess(payload);
        });
      }
    });

  },
  config: {
    commentsStream: {
      action: CommentActions.commentsStream
    },
    createCommentSuccess: {
      action: CommentActions.createCommentSuccess
    },
    updateCommentSuccess: {
      action: CommentActions.updateCommentSuccess
    },
    deleteCommentSuccess: {
      action: CommentActions.deleteCommentSuccess
    }
  }
});

module.exports = CommentStore;
