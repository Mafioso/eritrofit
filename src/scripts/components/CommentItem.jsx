'use strict';

var api = require('../utils/api');
var moment = require('moment');

var CommentItem = React.createClass({
  render: function() {
    var userpic = api.getBase64Userpic(this.props.comment.author);
    var timestamp = moment(this.props.comment.timestamp).format('D MMMM H:mm');

    return (
      <div className='workoutDetails-comment'>
        <div className='workoutDetails-comment-userpic figure-userpic'>
          <img src={userpic} />
        </div>
        <div className='workoutDetails-comment-body'>
          <div className='workoutDetails-comment-meta'>
            <strong className='workoutDetails-comment-meta-user'>{this.props.comment.username}</strong> {timestamp}
          </div>
          <div className='workoutDetails-comment-entry'>
            {this.props.comment.text}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CommentItem;
