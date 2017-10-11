/* global gapi */

import React from 'react';
import Calendar from 'C/calendar';
import RaisedButton from 'material-ui/RaisedButton';

import {
  CLIENT_ID as clientId,
  DISCOVERY_DOCS as discoveryDocs,
  SCOPES as scope
} from 'Constants';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);

    this.state = {
      events: [],
      onClick: this.handleLogin,
      label: 'Login'
    };
  }

  componentDidMount() {
    // Init gapi
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId,
        discoveryDocs,
        scope
      }).then(() => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    });
  }

  handleLogin() {
    gapi.auth2.getAuthInstance().signIn();
  }

  handleSignout() {
    gapi.auth2.getAuthInstance().signOut();
  }

  async updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      const {result: {items: events}} = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      });

      this.setState({
        events,
        onClick: this.handleSignout,
        label: 'Logout'
      });
    } else {
      this.setState({
        events: [],
        onClick: this.handleLogin,
        label: 'Login'
      });
    }
  }

  render() {
    const {
      events,
      onClick,
      label
    } = this.state;

    const primary = true;

    return (
      <div>
        <RaisedButton {...{onClick, label, primary}}/>
        {events.length === 0 ? null : <Calendar {...{events}}/>}
      </div>
    );
  }
}
