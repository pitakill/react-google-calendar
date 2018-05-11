import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

const style = {
  height: '100vh',
};

const Calendar = (props) => {
  return (
    <div {...{style}}>
      <BigCalendar
        selectable
        {...props}
        />
    </div>
  );
};

export default Calendar;
