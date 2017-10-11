/* global gapi */

import React from 'react';
import Calendar from 'C/calendar';
import DatePicker from 'material-ui/Datepicker';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';

import {
  CLIENT_ID as clientId,
  DISCOVERY_DOCS as discoveryDocs,
  SCOPES as scope
} from 'Constants';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleTimePickerEnd = this.handleTimePickerEnd.bind(this);
    this.handleTimePickerStart = this.handleTimePickerStart.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);

    this.state = {
      events: [],
      onClick: this.handleLogin,
      label: 'Login',
      isSignedIn: false,
      // picker's stuff
      titleEvent: undefined,
      pickerDate: undefined,
      pickerTimeEnd: undefined,
      pickerTimeStart: undefined
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

  handleAddEvent() {
    const {
      pickerDate,
      pickerTimeEnd,
      pickerTimeStart,
      titleEvent: summary
    } = this.state;

    const year = pickerDate.getFullYear();
    const month = pickerDate.getMonth();
    const day = pickerDate.getDate();

    const hourEnd = pickerTimeEnd.getHours();
    const minuteEnd = pickerTimeEnd.getMinutes();

    const hourStart = pickerTimeStart.getHours();
    const minuteStart = pickerTimeStart.getMinutes();

    const start = new Date(year, month, day, hourStart, minuteStart);
    const end = new Date(year, month, day, hourEnd, minuteEnd);

    const resource = {
      summary,
      start: {
        dateTime: start
      },
      end: {
        dateTime: end
      }
    };

    const request = gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource
    });

    request.execute(event => {
      const events = this.state.events.concat([event]);
      this.setState({
        events,
        pickerDate: null,
        pickerTimeEnd: null,
        pickerTimeStart: null,
        titleEvent: ''
      });
    });
  }

  handleDatePickerChange(event, data) {
    this.setState({pickerDate: data});
  }

  handleTimePickerEnd(event, data) {
    this.setState({pickerTimeEnd: data});
  }

  handleTimePickerStart(event, data) {
    this.setState({pickerTimeStart: data});
  }

  handleTextFieldChange(event) {
    this.setState({titleEvent: event.target.value});
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
        label: 'Logout',
        isSignedIn: true
      });
    } else {
      this.setState({
        events: [],
        onClick: this.handleLogin,
        label: 'Login',
        isSignedIn: false
      });
    }
  }

  render() {
    const {
      events,
      onClick,
      label,
      isSignedIn,
      pickerDate,
      pickerTimeEnd,
      pickerTimeStart,
      titleEvent
    } = this.state;

    const configDatePicker = {
      hintText: 'Selecciona una fecha',
      onChange: this.handleDatePickerChange,
      value: pickerDate
    };

    const configTimePickerEnd = {
      autoOk: true,
      hintText: 'Hora de finalizado',
      onChange: this.handleTimePickerEnd,
      value: pickerTimeEnd
    };

    const configTimePickerStart = {
      autoOk: true,
      hintText: 'Hora de inicio',
      onChange: this.handleTimePickerStart,
      value: pickerTimeStart
    };

    const configTextField = {
      hintText: 'Título',
      onChange: this.handleTextFieldChange,
      value: titleEvent
    };

    const disabled = !(titleEvent && pickerDate && pickerTimeEnd && pickerTimeStart);

    const style = {
      marginTop: '150px'
    };

    return (
      <div>
        <Drawer>
          <RaisedButton {...{onClick, label, primary: true}}/>
          { isSignedIn ?
            <div {...{style}}>
              <span>Detalles de evento:</span>
              <TextField {...configTextField}/>
              <DatePicker {...configDatePicker}/>
              <TimePicker {...configTimePickerStart}/>
              <TimePicker {...configTimePickerEnd}/>
              <RaisedButton
                {...{
                  disabled,
                  onClick: this.handleAddEvent,
                  label: 'Agregar evento',
                  secondary: true
                }}
                />
            </div> : null
          }
        </Drawer>
        {isSignedIn ? <Calendar {...{events}}/> : null}
      </div>
    );
  }
}
