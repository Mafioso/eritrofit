'use strict';

// COMPONENTS START
var Nav = require('../components/Nav.jsx');
var UserSettingsModal = require('../components/modals/UserSettingsModal.jsx');
// END

var Day = React.createClass({
  getInitialState: function() {
    return {
      mode: '',
      userSettingsModalIsOpened: false
    };
  },
  toggleUserSettingsModal: function(event) {
    event.preventDefault();
    this.setState(function(state) {
      return {
        userSettingsModalIsOpened: !state.userSettingsModalIsOpened
      };
    });
  },
  render: function() {

    return (
      <div>
        <Nav
          user={this.props.params.currentUser}
          toggleUserSettingsModal={this.toggleUserSettingsModal} />
        <UserSettingsModal
          userSettingsModalIsOpened={this.state.userSettingsModalIsOpened}
          toggleUserSettingsModal={this.toggleUserSettingsModal} />
      </div>
    );
  }
});

module.exports = Day;
