/* global gapi */
import React from 'react';
import moment from 'moment';
import Button from './Button';
import Calendar from './Calendar';
import {
  CLIENT_ID as clientId,
  DISCOVERY_DOCS as discoveryDocs,
  SCOPES as scope,
} from './constans';

class App extends React.Component {
  state = {
    events: [],
    isSignedIn: false,
  };

  componentDidMount() {
    // Init gapi
    gapi
    .load('client:auth2', () => {
      gapi
      .client
      .init({clientId, discoveryDocs, scope})
      .then(() => {
      // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    });
  }

  transformEventsToBigCalendar = (items) => {
    return items.map(
      ({id, summary: title, start: originalStart, end: originalEnd}) => {
        let allDay;
        let start;
        let end;

        if (originalStart.date === undefined) {
          allDay = false;
          start = moment(originalStart.dateTime).toDate();
          end = moment(originalEnd.dateTime).toDate();
        } else {
          allDay = true;
          start = moment(originalStart.date).toDate();
          end = moment.utc(originalEnd.date).toDate();
        }

        return {allDay, id, title, start, end};
      }
    );
  }

  getEvents = async () => {
    try {
      const {result: {items}} = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      });

      return this.transformEventsToBigCalendar(items)
    } catch (e) {
      console.error(e);
    }
  }

  handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn();
  }

  handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut();
  }

  updateSigninStatus = async (isSignedIn) => {
    if (isSignedIn) {
      const events = await this.getEvents();

      this.setState({
        events,
        isSignedIn: true
      });
    } else {
      this.setState({
        events: [],
        isSignedIn: false
      });
    }
  }

  render() {
    const {
      events,
      isSignedIn,
    } = this.state;

    return (
      isSignedIn
      ? <React.Fragment>
          <Button label="Logout" onClick={this.handleLogout} />
          <Calendar {...{events}}/>
        </React.Fragment>
      : <Button label="Login" onClick={this.handleLogin} />
    );
  }
}

export default App;
