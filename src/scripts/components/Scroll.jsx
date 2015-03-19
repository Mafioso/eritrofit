'use strict';

var classNames = require('classnames');

var Scroll = React.createClass({
  getInitialState: function() {
    return {
      thumbHeight: 0,
      thumbOffset: 0,
      stickToBottom: false
    };
  },
  handleThumbDrag: function(event) {
    event.preventDefault();
    event.stopPropagation();

    var deltaY = event.pageY - this.mouseMoveInitialPageY;
    var scale = this.scrollableScrollHeight / this.refs.scroll.getDOMNode().offsetHeight;

    this.props.mousePositionStream.push(Math.floor(scale*(this.mouseMoveInitialOffset + deltaY - this.deltaThumb)));
  },
  handleTouchStart: function(event) {
    if (event.target === this.refs.scroll.getDOMNode()) {

      this.mouseMoveInitialPageY = event.pageY;
      this.mouseMoveInitialOffset = event.pageY - this.refs.scroll.getDOMNode().getBoundingClientRect().top;

      // add delta between scrollThumb and scroll

      this.deltaThumb =
      event.pageY - this.refs.scrollThumb.getDOMNode().getBoundingClientRect().top;

      // send initial value to mouse position stream
      var deltaY = event.pageY - this.mouseMoveInitialPageY;
      var scale = this.scrollableScrollHeight / this.refs.scroll.getDOMNode().offsetHeight;
      this.props.mousePositionStream.push(Math.floor(scale*(this.mouseMoveInitialOffset + deltaY - this.deltaThumb)));
    }
  },
  handleTouchMove: function(event) {
    event.preventDefault();
    if (event.target === this.refs.scroll.getDOMNode()) {
      this.handleThumbDrag(event);
    }
  },
  handleTouchEnd: function(event) {
    if (event.target === this.refs.scroll.getDOMNode()) {

      this.mouseMoveInitialPageY = 0;
      this.mouseMoveInitialOffset = 0;
    }
  },
  handleMouseDown: function(event) {
    // start dragging
    event.preventDefault();

    // don't start if button is not 0
    if (event.button !== 0) { return; }

    this.mouseMoveInitialPageY = event.pageY;
    this.mouseMoveInitialOffset = event.pageY - this.refs.scroll.getDOMNode().getBoundingClientRect().top;

    // send initial value to mouse position stream
    var deltaY = event.pageY - this.mouseMoveInitialPageY;
    var scale = this.scrollableScrollHeight / this.refs.scroll.getDOMNode().offsetHeight;

    // add delta between scrollThumb and scroll

    this.deltaThumb =
    event.pageY - this.refs.scrollThumb.getDOMNode().getBoundingClientRect().top;
    this.props.mousePositionStream.push(Math.floor(scale*(this.mouseMoveInitialOffset + deltaY - this.deltaThumb)));

    // attach event listeners
    document.addEventListener('mousemove', this.handleThumbDrag);
    document.addEventListener('mouseup', this.handleMouseUp);
  },
  handleMouseUp: function() {
    this.mouseMoveInitialPageY = 0;
    this.mouseMoveInitialOffset = 0;
    // remove event listeners
    document.removeEventListener('mousemove', this.handleThumbDrag);
    document.removeEventListener('mouseup', this.handleMouseUp);
  },
  updateThumbState: function(scrollableHeight, scrollableScrollHeight, scrollTop) {
    if (scrollableHeight <= scrollableScrollHeight) {
      var scrollHeight = this.refs.scroll.getDOMNode().offsetHeight;
      var thumbHeight = Math.floor( scrollHeight * (scrollableHeight / scrollableScrollHeight));
      var thumbOffset = Math.floor(scrollTop * scrollableHeight / scrollableScrollHeight);
      var stickToBottom = false;

      if (thumbHeight < 24) {
        thumbOffset = Math.floor( thumbOffset / thumbHeight * 24 );
        thumbHeight = 24;
      }

      if (scrollableScrollHeight < scrollableHeight + scrollTop ) {
        stickToBottom = true;
      }

      if (scrollHeight < thumbHeight + thumbOffset) {
        thumbOffset = scrollHeight - thumbHeight;
      }

      if (thumbOffset < 0) {
        thumbOffset = 0;
      }

      this.setState({
        thumbHeight: thumbHeight,
        thumbOffset: thumbOffset,
        stickToBottom: stickToBottom
      });
    }
  },
  componentDidMount: function() {
    this.mouseMoveInitialPageY = 0;
    this.mouseMoveInitialOffset = 0;
    this.scrollableScrollTop = 0;
    this.scrollableHeight = 0;
    this.scrollableScrollHeight = 1;

    document.addEventListener('touchmove', this.handleTouchMove);
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchend', this.handleTouchEnd);
    this.refs.scroll.getDOMNode().addEventListener('mousedown', this.handleMouseDown);

    var self = this;
    this.unsubFromScrollableHeightStream = this.props.scrollableHeightStream.onValue(function(value) {
      self.scrollableHeight = value;
      self.updateThumbState(self.scrollableHeight, self.scrollableScrollHeight, self.scrollableScrollTop);
    });

    this.unsubFromScrollableScrollHeightStream = this.props.scrollableScrollHeightStream.onValue(function(value) {
      self.scrollableScrollHeight = value;
      self.updateThumbState(self.scrollableHeight, self.scrollableScrollHeight, self.scrollableScrollTop);
    });

    this.unsubFromScrollTopStream = this.props.scrollTopStream.onValue(function(value) {
      self.scrollableScrollTop = value;
      self.updateThumbState(self.scrollableHeight, self.scrollableScrollHeight, self.scrollableScrollTop);
    });
  },
  componentWillUnmount: function() {
    this.refs.scroll.getDOMNode().removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);

    this.unsubFromScrollableHeightStream();
    this.unsubFromScrollableScrollHeightStream();
    this.unsubFromScrollTopStream();
  },
  render: function() {

    var transform = 'translate3d(0,'+ this.state.thumbOffset +'px,0)';

    var style = {
      height: this.state.thumbHeight,
      transform: transform,
      WebkitTransform: transform
    };

    var classes = classNames('scroll-thumb', { 'scroll-thumb--active': this.state.stickToBottom });

    return (
      <div ref='scroll' className='scroll'>
        <div
          ref='scrollThumb'
          style = {style}
          className={classes} />
      </div>
    );

  },
});

module.exports = Scroll;
