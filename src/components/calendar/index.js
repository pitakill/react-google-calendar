// @flow
import * as React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

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

type CalendarProps = {
  events: Array<GCEvent>,
  deleteEvent: Function
};

export default (props: CalendarProps): React.Element<any> => {
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

    if (originalStart.date === undefined) {
      allDay = false;
      start = moment(originalStart.dateTime).toDate();
      end = moment(originalEnd.dateTime).toDate();
    } else {
      allDay = true;
      start = moment(originalStart.date).toDate();
      end = moment.utc(originalEnd.date).toDate();
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
