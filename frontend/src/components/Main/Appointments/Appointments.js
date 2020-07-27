import React, { useContext, useState, useEffect } from 'react';
import MainCalendar from './MainCalendar/MainCalendar';
import './Appointments.scss';
import CalendarForm from './CalendarForm/CalendarForm';
import { AuthContext } from '../../../globalState/index';
import axios from 'axios';
import moment from 'moment';
import { RRule, RRuleSet, rrulestr } from 'rrule';

const Appointments = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorSessions, setDoctorSessions] = useState([]);

  function round(date, duration, method) {
    return moment(Math[method](+date / +duration) * +duration);
  }

  const [clientFormState, setClientFormState] = useState({
    doctor: '',
    client: user.firstName,
    startTime: round(moment(), moment.duration(15, 'minutes'), 'ceil').toDate(),
    endTime: '',
    sessionDuration: '',
  });

  const [doctorAvailability, setDoctorAvailability] = useState({
    openningTime: moment().set({ hour: 6, minute: 0 }).toDate(),
    closingTime: moment().set({ hour: 18, minute: 0 }).toDate(),
    lunchBreakStart: moment().set({ hour: 12, minute: 0 }).toDate(),
    lunchBreakEnd: moment().set({ hour: 13, minute: 0 }).toDate(),
    unavailableDateTimes: [
      {
        startDateTime: round(
          moment(),
          moment.duration(15, 'minutes'),
          'ceil'
        ).toDate(),
        endDateTime: round(
          moment(),
          moment.duration(15, 'minutes'),
          'ceil'
        ).toDate(),
        modifier: '',
      },
    ],
    errors: [],
  });

  useEffect(() => {
    getDoctorSessions();
  }, []);

  const getDoctorSessions = async () => {
    const URL = 'http://localhost:5000';
    // const URL = 'cloudclinic00.herokuapp.com';
    const endpoint = `${URL}/api/sessions/`;

    const jwt = localStorage.getItem('jwt');
    // console.log(jwt);
    await axios
      .get(endpoint, {
        headers: {
          Authorization: `${jwt}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSelect = (e, key) => {
    setClientFormState({
      ...clientFormState,
      [key]: e.target.value,
    });
  };

  const handleAddClick = (key, formFieldsObject) => {
    setDoctorAvailability({
      ...doctorAvailability,
      [key]: [...doctorAvailability[key], formFieldsObject],
    });
  };

  const handleRemoveClick = (key, i) => {
    //spread value at the formState key into list
    const list = [...doctorAvailability[key]];

    //at index i, remove one item
    list.splice(i, 1);
    setDoctorAvailability({
      ...doctorAvailability,
      [key]: list,
    });
  };

  const handleSessionDuration = (e, duration) => {
    if (e.target.value === duration) {
      const endTime = moment(clientFormState.startTime)
        .add(duration, 'minutes')
        .toDate();

      setClientFormState({
        ...clientFormState,
        sessionDuration: duration,
        endTime,
      });
    }
  };

  const handleUnavailableDateChange = (el, i, key, date, timeBlock) => {
    setDoctorAvailability({
      ...doctorAvailability,
      errors: [],
      [key]: doctorAvailability[key].map((element, index) => {
        if (index === i) {
          element[timeBlock] = date;
        }
        return element;
      }),
    });
  };

  const handleUnavailabilityModifiers = (e, i, key) => {
    setDoctorAvailability({
      ...doctorAvailability,
      errors: [],
      [key]: doctorAvailability[key].map((element, index) => {
        if (index === i) {
          element['modifier'] = e.target.value;
        }
        return element;
      }),
    });
  };

  const checkEmptyDateFields = key => {
    doctorAvailability[key].forEach(el => {
      const inputValues = Object.values(el);
      for (let i = 0; i < inputValues.length; i++) {
        if (
          typeof inputValues[i] !== 'string' &&
          !moment(inputValues[i]).isValid()
        ) {
          setDoctorAvailability({
            ...doctorAvailability,
            errors: [
              'Please fill in all fields and only include valid dates and times',
            ],
          });
        }
      }
    });
  };

  const checkValidSubDateFields = key => {
    doctorAvailability[key].forEach(el => {
      const clone = (({ modifier, ...o }) => o)(el);

      // clone.startDateTime
      // clone.endDateTime
      if (moment(clone.endDateTime).isSameOrBefore(clone.startDateTime)) {
        setDoctorAvailability({
          ...doctorAvailability,
          errors: [
            'Please select a valid end date time for your unavailability',
          ],
        });
      }

      if (moment(clone.startDateTime).isSameOrAfter(clone.endDateTime)) {
        setDoctorAvailability({
          ...doctorAvailability,
          errors: [
            'Please select a valid start date time for your unavailability',
          ],
        });
      }
    });
  };

  const aggregateUnavailability = () => {
    // RRULES

    // doctorAvailability.openningTime
    // doctorAvailability.closingTime

    // doctorAvailability.lunchBreakStart
    // doctorAvailability.lunchBreakEnd

    // const allDayUnavailability = doctorAvailability.unavailableDateTimes.map(
    //   unavailability => {
    //     if (unavailability.modifier === 'allDay') {
    //       const startClone = moment
    //         .utc(unavailability.startDateTime)
    //         .set(0, 'hour')
    //         .toDate();
    //       const endClone = moment
    //         .utc(unavailability.endDateTime)
    //         .set(24, 'hour')
    //         .toDate();
    //       return {
    //         startDate: startClone,
    //         endDate: endClone,
    //       };
    //     }
    //   }
    // );

    const convertUTC = date => {
      return moment.utc(date).toDate(); // '2020-07-01 09:00'
    };

    const newRRulSet = ruleBluePrint => {
      return new RRule({
        freq: parseInt(ruleBluePrint.frequency, 10), // RRule.MONTHLY, (NUMERIC VALUE)
        dtstart: convertUTC(ruleBluePrint.startDateTime), // new Date(Date.UTC(2012, 1, 1, 10, 30)) (CONVERT THIS TO UTC)
        until: convertUTC(moment(ruleBluePrint.startDateTime).add(6, 'months')), // new Date(Date.UTC(2012, 1, 1, 10, 30))
      });
    };

    const unavailabilities = doctorAvailability.unavailableDateTimes.map(
      unavailability => {
        return {
          include: false,
          ruleInstruction: newRRulSet(unavailability),
          endDateTime: convertUTC(unavailability.endDateTime),
        };
      }
    );
  };

  const handleDoctorAvailabilitySubmit = () => {
    //validations - no empty or dodgy fields

    checkEmptyDateFields('unavailableDateTimes');
    checkValidSubDateFields('unavailableDateTimes');

    if (
      !moment(doctorAvailability.openningTime).isValid() ||
      !moment(doctorAvailability.closingTime).isValid() ||
      !moment(doctorAvailability.lunchBreakStart).isValid() ||
      !moment(doctorAvailability.lunchBreakEnd).isValid()
    ) {
      setDoctorAvailability({
        ...doctorAvailability,
        errors: [
          'Please fill in all fields and only include valid dates and times',
        ],
      });
    }

    // check that end date & times must be greater than start date & times
    if (
      moment(doctorAvailability.closingTime).isSameOrBefore(
        doctorAvailability.openningTime
      )
    ) {
      setDoctorAvailability({
        ...doctorAvailability,
        errors: ['Please select a valid closing time'],
      });
    }

    if (
      moment(doctorAvailability.openningTime).isSameOrAfter(
        doctorAvailability.closingTime
      )
    ) {
      setDoctorAvailability({
        ...doctorAvailability,
        errors: ['Please select a valid openning time'],
      });
    }

    if (
      moment(doctorAvailability.lunchBreakStart).isSameOrAfter(
        doctorAvailability.lunchBreakEnd
      )
    ) {
      setDoctorAvailability({
        ...doctorAvailability,
        errors: ['Please select a valid lunch break start time'],
      });
    }

    if (
      moment(doctorAvailability.lunchBreakEnd).isSameOrBefore(
        doctorAvailability.lunchBreakStart
      )
    ) {
      setDoctorAvailability({
        ...doctorAvailability,
        errors: ['Please select a valid lunch break end time'],
      });
    }

    const allDayUnavailability = doctorAvailability.unavailableDateTimes.map(
      unavailability => {
        if (unavailability.modifier === 'allDay') {
          // const shallowClone =
          const startClone = moment(unavailability.startDateTime).set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          });
          console.log(startClone, 'start clone');
          const endClone = moment(unavailability.endDateTime).set({
            hour: 24,
            minute: 0,
            second: 0,
            millisecond: 0,
          });
          console.log(endClone, 'end clone');

          return {
            startDate: startClone,
            endDate: endClone,
          };
        }
      }
    );

    console.log(allDayUnavailability);

    // console.log('no errors');

    // const unavailabilities = aggregateUnavailability();

    // console.log(unavailabilities);
  };

  const doctorAppointments = () => {
    return (
      <div className="appointments-wrapper">
        <section className="calendar-form-wrapper">
          <CalendarForm
            doctorAvailability={doctorAvailability}
            setDoctorAvailability={setDoctorAvailability}
            user={user}
            handleAddClick={handleAddClick}
            handleRemoveClick={handleRemoveClick}
            handleUnavailableDateChange={handleUnavailableDateChange}
            handleUnavailabilityModifiers={handleUnavailabilityModifiers}
            round={round}
            handleDoctorAvailabilitySubmit={handleDoctorAvailabilitySubmit}
          />
        </section>
        <MainCalendar doctorAvailability={doctorAvailability} />
      </div>
    );
  };

  const clientAppointments = () => {
    return (
      <div className="appointments-wrapper">
        <section className="calendar-form-wrapper">
          <CalendarForm
            clientFormState={clientFormState}
            setClientFormState={setClientFormState}
            handleSelect={handleSelect}
            handleSessionDuration={handleSessionDuration}
            user={user}
          />
        </section>
        <MainCalendar clientFormState={clientFormState} />
      </div>
    );
  };

  const showAppointmentView = () => {
    return user.isDoctor ? doctorAppointments() : clientAppointments();
  };

  return showAppointmentView();
};

export default Appointments;
