import React from 'react';
import Calendar from 'C/calendar';

import fakeData from './fakeData';

const events = process.env.NODE_ENV === 'development' ? fakeData : [];

export default () => <Calendar {...{events}}/>;
