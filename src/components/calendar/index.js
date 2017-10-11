import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';

import './styles';

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

const style = {
  height: '80vh',
  margin: 'auto',
  paddingLeft: '300px',
  paddingRight: '50px'
};

const Calendar = props => {
  const {events: rawEvents} = props;

  const events = rawEvents.map(event => {
    const {
      summary: title,
      start: originalStart,
      end: originalEnd
    } = event;

    let allDay;
    let start;
    let end;

    if (originalStart.date) {
      allDay = true;
      start = moment(originalStart.date).toDate();
      end = new Date(originalEnd.date);
    } else {
      allDay = false;
      start = new Date(originalStart.dateTime);
      end = new Date(originalEnd.dateTime);
    }

    return {
      allDay,
      title,
      start,
      end
    };
  });

  return (
    <div {...{style}}>
      <BigCalendar
        {...{events}}
        />
    </div>
  );
};

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      summary: PropTypes.string.isRequired,
      start: PropTypes.object.isRequired,
      end: PropTypes.object.isRequired
    })
  ).isRequired
};

export default Calendar;
