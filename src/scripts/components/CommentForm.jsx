'use strict';

var InputTextarea = require('./InputTextarea.jsx');
var CommentActions = require('../actions/CommentActions');
var CommentStore = require('../stores/CommentStore');
var moment = require('moment');

var ENTER_KEY_CODE = 13;

var CommentForm = React.createClass({
  getInitialState: function() {
    return {
      submitting: false,
      text: ''
    };
  },
  handleTextUpdate: function(text) {
    this.setState({
      text: text
    });
  },
  handleKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();

      this.submitChatMessage(event);
    }
  },
  submitChatMessage: function(event) {
    event.preventDefault();

    var inputValue = this.state.text;
    if (!inputValue) {
      return;
    }

    this.setState({
      submitting: true
    });

    CommentActions.createComment({
      text: inputValue,
      workoutId: this.props.workoutId,
      user: this.props.user,
      timestamp: moment().utc().format()
    });
  },
  componentDidMount: function() {
    var self = this;
    this.unsubFromCreateCommentSuccess = CommentStore.streams.createCommentSuccess.listen(function() {
      self.setState({
        submitting: false,
        text: ''
      });
    });
  },
  componentWillUnmount: function() {
    this.unsubFromCreateCommentSuccess();
  },
  render: function() {
    return (
      <form onSubmit={this.submitChatMessage} className='chatForm'>
        <InputTextarea
          disabled={this.state.submitting}
          name='chat_textarea'
          placeholder=''
          autoFocus={true}
          text={this.state.text}
          onTextChange={this.handleTextUpdate}
          onKeyDown={this.handleKeyDown}
          />
      </form>
    );
  }
});

module.exports = CommentForm;
