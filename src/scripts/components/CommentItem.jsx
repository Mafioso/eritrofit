'use strict';

var api = require('../utils/api');
var moment = require('moment');
var _ = require('lodash');

var CommentItem = React.createClass({
  render: function() {
    var userpic = api.getBase64Userpic(this.props.comment.author);
    var timestamp = moment(this.props.comment.timestamp).format('D MMMM H:mm');

    var entries = _.map(this.props.comment.text, function(entry) {
      return (<div key={'commentEntry'+entry.key} className='workoutDetails-comment-entry'>
        {entry.text}
      </div>);
    });


    return (
      <div className='workoutDetails-comment'>
        <div className='workoutDetails-comment-userpic figure-userpic'>
          <img src={userpic} />
        </div>
        <div className='workoutDetails-comment-body'>
          <div className='workoutDetails-comment-meta'>
            <strong className='workoutDetails-comment-meta-user'>{this.props.comment.username}</strong> {timestamp}
          </div>
          {entries}
        </div>
      </div>
    );
  }
});

module.exports = CommentItem;
