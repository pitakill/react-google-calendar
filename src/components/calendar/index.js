import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import events from './fakeData';

import './index.scss';

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

const styles = {
  wrapper: {
    height: '80vh',
    margin: 'auto',
    width: '80vw'
  }
};

export default () => (
  <div style={styles.wrapper}>
    <BigCalendar events={events}/>
  </div>
);
