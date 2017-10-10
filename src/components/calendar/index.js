import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import events from './fakeData';
import './styles';

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

const style = {
  height: '80vh',
  margin: 'auto',
  width: '80vw'
};

export default () => (
  <div {...{style}}>
    <BigCalendar {...{events}}/>
  </div>
);
