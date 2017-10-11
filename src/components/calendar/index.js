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
  width: '80vw'
};

const Calendar = props => (
  <div {...{style}}>
    <BigCalendar {...props}/>
  </div>
);

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      allDay: PropTypes.bool,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Calendar;
