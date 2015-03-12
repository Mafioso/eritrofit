'use strict';

var isMobile = require('is-mobile');

var InputTextarea = React.createClass({
  handleChange: function(event) {
    this.props.onTextChange(event.target.value);
  },
  componentDidMount: function() {
    if (!isMobile() && this.props.autoFocus) {
      this.refs[this.props.name].getDOMNode().select();
    }
  },
  handleKeyDown: function(event) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  },
  handleKeyUp: function(event) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.text === '') {
      this.refs[this.props.name].getDOMNode().value = '';
    }
  },
  render: function() {
    return (
      <div className='input input--textarea'>
        <div className='input-shadow'>
          {this.props.text + '\n'}
        </div>
        <textarea
          disabled={this.props.submitting || false}
          value={this.props.text}
          ref={this.props.name}
          autoFocus={!isMobile() && this.props.autoFocus}
          className='input-field'
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp} />
      </div>
    );
  }
});

module.exports = InputTextarea;
