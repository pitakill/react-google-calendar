/* global gapi */
// @flow
import * as React from 'react';
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

type GCEvent = {
  id: string,
  summary: string,
  start: {
    date?: string,
    dateTime?: string
  },
  end: {
    date?: string,
    dateTime?: string
  }
};

type AppProps = {};

type AppState = {
  events: Array<GCEvent>,
  onClick: Function,
  label: string,
  isSignedIn: boolean,
  titleEvent?: string,
  pickerDate?: Date,
  pickerTimeEnd?: Date,
  pickerTimeStart?: Date
};

export default class App extends React.PureComponent<AppProps, AppState> {
  constructor(): void {
    super();

    (this:any).getEvents = this.getEvents.bind(this);
    (this:any).handleAddEvent = this.handleAddEvent.bind(this);
    (this:any).handleDatePickerChange = this.handleDatePickerChange.bind(this);
    (this:any).handleDeleteEvent = this.handleDeleteEvent.bind(this);
    (this:any).handleTextFieldChange = this.handleTextFieldChange.bind(this);
    (this:any).handleTimePickerEnd = this.handleTimePickerEnd.bind(this);
    (this:any).handleTimePickerStart = this.handleTimePickerStart.bind(this);
    (this:any).handleLogin = this.handleLogin.bind(this);
    (this:any).handleSignout = this.handleSignout.bind(this);
    (this:any).updateSigninStatus = this.updateSigninStatus.bind(this);

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

  componentDidMount(): void {
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

  async getEvents(): Promise<*> {
    try {
      const {result: {items}} = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      });

      return items;
    } catch (e) {
      console.error(e);
    }
  }

  handleAddEvent(): void {
    const {
      pickerDate,
      pickerTimeEnd,
      pickerTimeStart,
      titleEvent: summary
    } = this.state;

    if (pickerDate && pickerTimeEnd && pickerTimeStart) {
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
          pickerDate: undefined,
          pickerTimeEnd: undefined,
          pickerTimeStart: undefined,
          titleEvent: ''
        });
      });
    }
  }

  handleDatePickerChange(event: void, data: Date): void {
    this.setState({pickerDate: data});
  }

  async handleDeleteEvent({id: eventId}: GCEvent): Promise<*> {
    const response = await new Promise(resolve => {
      const request = gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId
      });

      request.execute(() => {
        resolve(true);
      });
    });

    if (response) {
      const events = await this.getEvents();
      this.setState({events});
    }
  }

  handleTimePickerEnd(event: void, data: Date): void {
    this.setState({pickerTimeEnd: data});
  }

  handleTimePickerStart(event: void, data: Date): void {
    this.setState({pickerTimeStart: data});
  }

  handleTextFieldChange(event: Event, data: string): void {
    this.setState({titleEvent: data});
  }

  handleLogin(): void {
    gapi.auth2.getAuthInstance().signIn();
  }

  handleSignout(): void {
    gapi.auth2.getAuthInstance().signOut();
  }

  async updateSigninStatus(isSignedIn: boolean): Promise<*> {
    if (isSignedIn) {
      const events = await this.getEvents();

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

  render(): React.Element<*> {
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

    const deleteEvent = this.handleDeleteEvent;

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
        {isSignedIn ? <Calendar {...{events, deleteEvent}}/> : null}
      </div>
    );
  }
}
