'use strict';

var CommentItem = require('./CommentItem.jsx');
var _ = require('lodash');
var moment = require('moment');

var Comments = React.createClass({
  propTypes: {
    items: React.PropTypes.object
  },
  render: function() {
    var self = this;
    var comments = [];

    if (!_.isEmpty(this.props.items)) {
      var commentsData = [];
      var commentBlobs = _.sortBy(_.values(this.props.items),
      function(blob) {
        return moment(blob.timestamp);
      });

      var j = 0;
      commentsData[0] = {
        type: commentBlobs[0].type,
        author: commentBlobs[0].author,
        key: commentBlobs[0].key,
        timestamp: commentBlobs[0].timestamp,
        username: commentBlobs[0].username,
        text: [{key: commentBlobs[0].key, timestamp: commentBlobs[0].timestamp, text: commentBlobs[0].text}]
      };
      for (var i = 1; i < commentBlobs.length; i++) {

        if (commentBlobs[i-1].author === commentBlobs[i].author && commentBlobs[i].type === 'COMMENT' && commentBlobs[i-1].type === 'COMMENT') {
          var prev = commentBlobs[i-1].timestamp;
          var next = commentBlobs[i].timestamp;
          if (moment.duration(moment(next).diff(moment(prev))).asMinutes() <= 1) {

            if (commentsData[j]) {
              // exists, extend
              commentsData[j].text.push({key: commentBlobs[i].key, timestamp: commentBlobs[i].timestamp, text: commentBlobs[i].text});
            } else {
              // create new
              commentsData[j] = {
                type: commentBlobs[i].type,
                author: commentBlobs[i-1].author,
                key: commentBlobs[i-1].key,
                timestamp: commentBlobs[i-1].timestamp,
                username: commentBlobs[i-1].username,
                text: [{key: commentBlobs[i-1].key, timestamp: commentBlobs[i-1].timestamp, text: commentBlobs[i-1].text},
                {key: commentBlobs[i].key, timestamp: commentBlobs[i].timestamp, text: commentBlobs[i].text}]
              };
            }
          } else {
            j++;
            commentsData[j] = {
              type: commentBlobs[i].type,
              author: commentBlobs[i].author,
              key: commentBlobs[i].key,
              timestamp: commentBlobs[i].timestamp,
              username: commentBlobs[i].username,
              text: [{key: commentBlobs[i].key, timestamp: commentBlobs[i].timestamp, text: commentBlobs[i].text}]
            };
          }
        } else {
          j++;
          commentsData[j] = {
            type: commentBlobs[i].type,
            author: commentBlobs[i].author,
            key: commentBlobs[i].key,
            timestamp: commentBlobs[i].timestamp,
            username: commentBlobs[i].username,
            text: [{key: commentBlobs[i].key, timestamp: commentBlobs[i].timestamp, text: commentBlobs[i].text}]
          };
        }
      }

      comments = _.map(commentsData, function(comment) {
        return (
          <CommentItem
            key={comment.key}
            user={self.props.user}
            comment={comment} />
        );
      });
    }


    return (
      <div>{comments}</div>
    );
  }
});

module.exports = Comments;
