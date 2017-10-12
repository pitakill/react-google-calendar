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
  const {
    events: rawEvents,
    deleteEvent: onSelectEvent
  } = props;

  const events = rawEvents.map(event => {
    const {
      id,
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
      id,
      title,
      start,
      end
    };
  });

  return (
    <div {...{style}}>
      <BigCalendar
        selectable
        {...{events, onSelectEvent}}
        />
    </div>
  );
};

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      start: PropTypes.object.isRequired,
      end: PropTypes.object.isRequired
    })
  ).isRequired,
  deleteEvent: PropTypes.func
};

export default Calendar;
