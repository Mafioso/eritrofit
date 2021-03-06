'use strict';

module.exports = React.createClass({
  handleChange: function(event) {
    this.setState({ inputValue: event.target.value });
    this.props.onTextChange(event.target.value);
  },
  componentDidMount: function() {
    if (this.props.autoFocus) {
      this.refs[this.props.name].getDOMNode().focus();
    }
  },
  getInitialState: function() {
    return { inputValue: '' };
  },
  render: function() {
    return (
      <div className='input input--textarea'>
        <div className='input-shadow'>
          {this.state.inputValue + '\n'}
        </div>
        <textarea
          ref={this.props.name}
          autoFocus={this.props.autoFocus}
          className='input-field'
          placeholder={this.props.placeholder}
          onChange={this.handleChange} />
      </div>
    );
  }
});
