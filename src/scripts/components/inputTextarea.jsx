'use strict';

var InputTextarea = React.createClass({
  handleChange: function(event) {
    this.props.onTextChange(event.target.value);
  },
  componentDidMount: function() {
    if (this.props.autoFocus) {
      this.refs[this.props.name].getDOMNode().select();
    }
  },
  render: function() {
    return (
      <div className='input input--textarea'>
        <div className='input-shadow'>
          {this.props.text + '\n'}
        </div>
        <textarea
          defaultValue={this.props.text}
          ref={this.props.name}
          autoFocus={this.props.autoFocus}
          className='input-field'
          placeholder={this.props.placeholder}
          onChange={this.handleChange} />
      </div>
    );
  }
});

module.exports = InputTextarea;
