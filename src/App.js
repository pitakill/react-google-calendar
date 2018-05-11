import React from 'react';
import Calendar from './Calendar';
import moment from 'moment';

const events = [{
  start: new Date(),
  end: new Date(moment().add(1, "days")),
  title: "Mi título"
}];

class App extends React.Component {
  render() {
    return (
      <Calendar {...{events}}/>
    );
  }
}

export default App;
