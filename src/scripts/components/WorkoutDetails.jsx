'use strict';

var Icon = require('./Icon.jsx');
var Scroll = require('./Scroll.jsx');
var Comments = require('./Comments.jsx');
var CommentForm = require('./CommentForm.jsx');
var WorkoutDetailsHeader = require('./WorkoutDetailsHeader.jsx');
var CommentStore = require('../stores/CommentStore');
var CommentActions = require('../actions/CommentActions');
// var api = require('../utils/api');
// var moment = require('moment');
var Bacon = require('baconjs');
// var _ = require('lodash');

module.exports = React.createClass({
  closeModal: function(event) {
    this.props.closeModal(event);
  },
  getInitialState: function() {
    return {
      shouldScrollBottom: true,
      comments: {}
    };
  },
  componentWillMount: function() {
    // add class to body
    document.body.className += ' body--stopScroll';
    this.scrollTopStream = new Bacon.Bus();
    this.mousePositionStream = new Bacon.Bus();
    this.wheelStream = new Bacon.Bus();
    this.scrollableHeightStream = new Bacon.Bus();
    this.scrollableScrollHeightStream = new Bacon.Bus();
  },
  componentDidMount: function() {

    //////////////////// SETUP SCROLL ////////////////////
    var scrollable = this.refs.scrollable.getDOMNode();
    var self = this;

    this.unsubFromWheelStream = this.wheelStream.onValue(function(value) {
      self.shouldScrollBottom = scrollable.scrollTop + scrollable.offsetHeight === scrollable.scrollHeight;
      self.scrollTopStream.push(scrollable.scrollTop + value);
    });

    this.unsubFromMousePositionStream = this.mousePositionStream.onValue(function(value) {
      self.shouldScrollBottom = scrollable.scrollTop + scrollable.offsetHeight === scrollable.scrollHeight;
      self.scrollTopStream.push(value);
    });

    this.unsubFromScrollTopStream = this.scrollTopStream.onValue(function(value) {
      scrollable.scrollTop = value;
    });

    this.scrollableHeightStream.push(scrollable.offsetHeight);
    this.scrollableScrollHeightStream.push(scrollable.scrollHeight);
    this.scrollTopStream.push(scrollable.scrollHeight);

    window.addEventListener('resize', this.updateScrollableConfiguration);

    //////////////////// SETUP COMMENTS ////////////////////
    this.unsubFromCommentsStream = CommentStore.streams.commentsStream.onValue(function(payload) {
      var comments;
      if (payload && payload.action) {
        switch (payload.action) {
          case 'REMOVE':
            comments = self.state.comments;
            delete comments[payload.key];
            self.setState({
              comments: comments
            });
            break;
          case 'PUT':
            comments = self.state.comments;
            comments[payload.key] = payload;
            self.setState({
              comments: comments
            });
            break;
          default:
            break;
        }
      }
    });
    this.setState({ comments: {} });

    // SETUP
    CommentActions.setupCommentsStream({ workoutId: this.props.workout.key });
  },
  updateScrollableConfiguration: function() {
    var scrollable = this.refs.scrollable.getDOMNode();

    this.scrollableHeightStream.push(scrollable.offsetHeight);
    this.scrollableScrollHeightStream.push(scrollable.scrollHeight);

    if (this.shouldScrollBottom) {
      this.scrollTopStream.push(scrollable.scrollHeight);
    } else {
      this.scrollTopStream.push(scrollable.scrollTop);
    }
  },
  updateScrollableHeightValue: function() {
    var scrollable = this.refs.scrollable.getDOMNode();
    this.scrollableHeightStream.push(scrollable.offsetHeight);
  },
  componentWillUpdate: function() {
    var scrollable = this.refs.scrollable.getDOMNode();
    var shouldScrollBottom = scrollable.scrollTop + scrollable.offsetHeight === scrollable.scrollHeight;
    this.shouldScrollBottom = shouldScrollBottom;
  },
  componentDidUpdate: function() {
    var scrollable = this.refs.scrollable.getDOMNode();
    this.scrollableScrollHeightStream.push(scrollable.scrollHeight);
    if (this.shouldScrollBottom) {
      this.scrollTopStream.push(scrollable.scrollHeight);
    }
  },
  componentWillUnmount: function() {
    // remove class from body
    document.body.className = document.body.className.replace(/\bbody--stopScroll\b/, '');

    window.removeEventListener('resize', this.updateScrollableConfiguration);

    this.unsubFromWheelStream();
    this.unsubFromMousePositionStream();
    this.unsubFromScrollTopStream();

    this.unsubFromCommentsStream();

    this.scrollTopStream.end();
    this.mousePositionStream.end();
    this.wheelStream.end();
    this.scrollableHeightStream.end();
    this.scrollableScrollHeightStream.end();

  },
  render: function() {

    if (!this.props.selectedWorkoutExists) {
      return (
        <div className='modal-body workoutDetails-container'>
          <button onClick={this.closeModal} className='workoutDetails-close' type='button'>
            <Icon name='x' />
          </button>
          <div className='workoutDetails'>
            <div className='workoutDetails-error'>
              Этот комплекс был удален.
            </div>
          </div>
        </div>
      );
    }

    return (

      <div className='modal-body workoutDetails-container'>
        <button onClick={this.closeModal} className='workoutDetails-close' type='button'>
          <Icon name='x' />
        </button>

        <div className='workoutDetails'>
          <WorkoutDetailsHeader
            workout={this.props.workout}
            />

          <div className='workoutDetails-body'>
            <div className='workoutDetails-scrollable' onWheel={this.handleWheel} ref='scrollable'>

              <Comments
                user={this.props.user}
                items={this.state.comments} />

              <Scroll
                scrollableHeightStream={this.scrollableHeightStream}
                scrollableScrollHeightStream={this.scrollableScrollHeightStream}
                scrollTopStream={this.scrollTopStream}
                mousePositionStream={this.mousePositionStream} />
            </div>
          </div>

          <div className='workoutDetails-footer'>
            <CommentForm
              workoutId={this.props.workout.key}
              user={this.props.user} />
          </div>
        </div>
      </div>
    );
  },
  handleWheel: function(event) {
    this.wheelStream.push(event.deltaY);
  }
});
