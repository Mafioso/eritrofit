'use strict';

var Icon = require('./Icon.jsx');
var Scroll = require('./Scroll.jsx');
var CommentForm = require('./CommentForm.jsx');
var api = require('../utils/api');
var moment = require('moment');
var Bacon = require('baconjs');

module.exports = React.createClass({
  closeModal: function(event) {
    this.props.handleModalClose(event);
  },
  scrollTopStream: new Bacon.Bus(),
  mousePositionStream: new Bacon.Bus(),
  wheelStream: new Bacon.Bus(),
  scrollableHeightStream: new Bacon.Bus(),
  scrollableScrollHeightStream: new Bacon.Bus(),
  getInitialState: function() {
    return {
      shouldScrollBottom: true,
      items: []
    };
  },
  componentWillMount: function() {
    // add class to body
    document.body.className += ' body--stopScroll';
  },
  componentDidMount: function() {
    var scrollable = this.refs.scrollable.getDOMNode();
    var self = this;

    this.unsubFromWheelStream = this.wheelStream.onValue(function(value) {
      self.scrollTopStream.push(scrollable.scrollTop + value);
    });

    this.unsubFromMousePositionStream = this.mousePositionStream.onValue(function(value) {
      self.scrollTopStream.push(value);
    });

    this.unsubFromScrollTopStream = this.scrollTopStream.onValue(function(value) {
      scrollable.scrollTop = value;
    });

    this.scrollableHeightStream.push(scrollable.clientHeight);
    this.scrollableScrollHeightStream.push(scrollable.scrollHeight);
    this.scrollTopStream.push(scrollable.scrollHeight);

    window.addEventListener('resize', this.updateScrollableHeightValue);

    // this.interval = setInterval(this.addEvent, 500);

    // parameters to update when trying to scroll
    // - translateX     for thumb
    // - scrollTop      for scrollable area

    //
  },
  updateScrollableHeightValue: function() {
    var scrollable = this.refs.scrollable.getDOMNode();
    this.scrollableHeightStream.push(scrollable.clientHeight);
  },
  componentWillUpdate: function(nextProps, nextState) {
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

    window.removeEventListener('resize', this.updateScrollableHeightValue);

    this.mousePositionStream.push(Bacon.noMore);
    this.wheelStream.push(Bacon.noMore);
    this.scrollTopStream.push(Bacon.noMore);
    this.scrollableHeightStream.push(Bacon.noMore);
    this.scrollableScrollHeightStream.push(Bacon.noMore);

    this.unsubFromWheelStream();
    this.unsubFromMousePositionStream();
    this.unsubFromScrollTopStream();

    clearInterval(this.interval);
  },
  render: function() {
    var userpic = api.getLargeBase64Userpic(this.props.workout.author);
    var dayTime = new moment(this.props.workout.day, 'DDMMYY');
    var timestampFormat = 'H:mm';
    if (!dayTime.isSame(moment(this.props.workout.timestamp), 'day')) {
      timestampFormat = 'D MMMM H:mm';
    }
    var timestamp = moment(this.props.workout.timestamp).format(timestampFormat);
    if (this.props.workout.editedTimestamp) {
      timestamp += '*';
      timestamp = (
        <span title={'Oтредактировано ' + moment(this.props.workout.editedTimestamp).format('D MMMM в H:mm')}>
          {timestamp}
        </span>
      );
    }
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
          <div className='workoutDetails-header'>
            <div className='workout-userpic figure-userpic'>
              <img src={userpic} />
            </div>
            <div className='workout'>
              <div className='workout-meta'>
                <div className='workout-meta-body'>
                  <strong className='workout-meta-user'>{this.props.workout.username}</strong>, {timestamp}
                </div>
              </div>
              <div className='workout-body'>
                {this.props.workout.text}
              </div>
            </div>
          </div>

          <div className='workoutDetails-body'>
            <div className='workoutDetails-scrollable' onWheel={this.handleWheel} ref='scrollable'>

              <div style={ { height: '1000px' } } />
              <ul>
                {this.state.items.map(function(item) {
                  return <li key={item}>{item}</li>;
                })}
              </ul>
            </div>
            <Scroll
              scrollableHeightStream={this.scrollableHeightStream}
              scrollableScrollHeightStream={this.scrollableScrollHeightStream}
              scrollTopStream={this.scrollTopStream}
              mousePositionStream={this.mousePositionStream} />
          </div>

          <div className='workoutDetails-footer'>
            <CommentForm />
          </div>
        </div>
      </div>
    );
  },
  handleWheel: function(event) {
    this.wheelStream.push(event.deltaY);
  },
  addEvent: function() {
    var newItems = this.state.items;
    // either remove or add an item
    var desiredIndex = Math.floor(Math.random() * newItems.length);
    newItems.push('Event ' + newItems.length);

    if (desiredIndex % 2 !== 0) {
      delete newItems[desiredIndex];
    }

    this.setState({
      items: newItems
    });
  },
});
