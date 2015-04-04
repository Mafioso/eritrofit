'use strict';

// COMPONENTS START
var Portal = require('../Portal.jsx');
var TimeoutTransitionGroup = require('../TimeoutTransitionGroup.jsx');
// END

var UserSettingsModal = React.createClass({
  propTypes: {
    userSettingsModalIsOpened: React.PropTypes.bool.isRequired,
    toggleUserSettingsModal: React.PropTypes.func.isRequired
  },
  toggle: function(event) {
    this.props.toggleUserSettingsModal(event);
  },
  render: function() {
    var node;
    if (this.props.userSettingsModalIsOpened) {
      // add class to body
      document.body.className += ' body--stopScroll';

      node = (<TimeoutTransitionGroup
        enterTimeout={100}
        leaveTimeout={150}
        component='div'
        transitionName='UserSettingsModalTransition'>

        <div onClick={this.toggle} className='modal-backdrop' />

        <div className='modal'>
          <div className='modal-body'>
            Hello, world!
          </div>
        </div>
      </TimeoutTransitionGroup>);
    } else {
      // remove class from body
      document.body.className = document.body.className.replace(/\bbody--stopScroll\b/, '');
    }

    return (
      <Portal>
        {node}
      </Portal>
    );
  }
});

module.exports = UserSettingsModal;
