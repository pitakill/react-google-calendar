/* global gapi */

import React from 'react';
import Calendar from 'C/calendar';
import Button from 'C/button';

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
      text: 'Login'
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
      const {result: {items: rawEvents}} = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      });

      const events = rawEvents.map(
        ({
          summary: title,
          start: {dateTime: start},
          end: {dateTime: end}
        }) => ({
          title,
          start,
          end
        })
      );

      this.setState({
        events,
        onClick: this.handleSignout,
        text: 'Logout'
      });
    } else {
      this.setState({
        events: [],
        onClick: this.handleLogin,
        text: 'Login'
      });
    }
  }

  render() {
    const {
      events,
      onClick,
      text
    } = this.state;

    return (
      <div>
        <Button {...{onClick, text}}/>
        {events.length === 0 ? null : <Calendar {...{events}}/>}
      </div>
    );
  }
}
