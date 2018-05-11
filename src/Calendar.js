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
  //const {
    //events: rawEvents,
    //deleteEvent: onSelectEvent
  //} = props;

  //const events = rawEvents.map(event => {
    //const {
      //id,
      //summary: title,
      //start: originalStart,
      //end: originalEnd
    //} = event;

    //let allDay;
    //let start;
    //let end;

    //if (originalStart.date === undefined) {
      //allDay = false;
      //start = moment(originalStart.dateTime).toDate();
      //end = moment(originalEnd.dateTime).toDate();
    //} else {
      //allDay = true;
      //start = moment(originalStart.date).toDate();
      //end = moment.utc(originalEnd.date).toDate();
    //}

    //return {
      //allDay,
      //id,
      //title,
      //start,
      //end
    //};
  //});

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
