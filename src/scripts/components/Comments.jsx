'use strict';

var CommentItem = require('./CommentItem.jsx');
var _ = require('lodash');
var moment = require('moment');

var Comments = React.createClass({
  render: function() {
    var self = this;

    var commentBlobs = _.sortBy(_.values(this.props.items),
    function(blob) {
      return moment(blob.timestamp);
    });

    var comments = _.map(commentBlobs, function(comment) {
      return (
        <CommentItem
          key={comment.key}
          user={self.props.user}
          comment={comment} />
      );
    });

    return (
      <div>{comments}</div>
    );
  }
});

module.exports = Comments;
