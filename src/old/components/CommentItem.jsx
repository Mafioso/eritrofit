'use strict';

var Icon = require('./Icon.jsx');
var api = require('../utils/api');
var beats = require('../utils/beats');
var moment = require('moment');
var _ = require('lodash');

var CommentItem = React.createClass({
  render: function() {
    var userpic = api.getBase64Userpic(this.props.comment.author);
    var timestamp = moment(this.props.comment.timestamp).format('D MMMM H:mm');



    var layout = null;

    switch (this.props.comment.type) {
      case 'SUBMISSION':
        var beatsNode = null;
        // 'SUBMISSION' usualy has only one text entry
        var beatValues = beats.get(this.props.comment.text[0].text);

        var avgBPM = _.min(beatValues);
        var maxBPM = _.max(beatValues);

        if (beatValues.length === 2) {
          beatsNode = <div className='workoutDetails-comment-beats'>
            <Icon name='heart'/>
            {avgBPM} / {maxBPM}
          </div>;
        }

        layout = <div className='workoutDetails-comment'>
          <div className='workoutDetails-comment-userpic figure-userpic'>
            <img src={userpic} />
          </div>
          <div className='workoutDetails-comment-body'>
            <div className='workoutDetails-comment-meta'>
              <strong className='workoutDetails-comment-meta-user'>{this.props.comment.username}</strong> {timestamp}
            </div>
            <div key={'commentEntry' + this.props.comment.text[0].key}
                className='workoutDetails-comment-entry'>
                <strong>Результат:</strong> {this.props.comment.text[0].text}
            </div>
          </div>
          {beatsNode}
        </div>;
        break;
      default:
        var entries = _.map(this.props.comment.text, function(entry) {
          return (<div key={'commentEntry'+entry.key} className='workoutDetails-comment-entry'>
            {entry.text}
          </div>);
        });
        // type === 'COMMENT' most of the time
        layout = <div className='workoutDetails-comment'>
          <div className='workoutDetails-comment-userpic figure-userpic'>
            <img src={userpic} />
          </div>
          <div className='workoutDetails-comment-body'>
            <div className='workoutDetails-comment-meta'>
              <strong className='workoutDetails-comment-meta-user'>{this.props.comment.username}</strong> {timestamp}
            </div>
            {entries}
          </div>
        </div>;
        break;
    }


    return layout;
  }
});

module.exports = CommentItem;
