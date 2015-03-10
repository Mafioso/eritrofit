'use strict';
var flux = require('fluxstream');

module.exports = flux.createActions([
  'setupCommentsStream',
  'commentsStream',

  'createComment',
  'createCommentSuccess',

  'updateComment',
  'updateCommentSuccess',

  'deleteComment',
  'deleteCommentSuccess'
]);
