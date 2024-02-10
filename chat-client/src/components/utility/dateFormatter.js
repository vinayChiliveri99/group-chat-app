import moment from 'moment';

export const dateFormattter = (dateToFormat) => {
  //   const format = 'YYYY-MM-DD';
  const format1 = 'MMMM Do [at] h:mm A';
  const date = moment(dateToFormat).format(format1);
  return date;
};

export function dateFormattterM(date) {
  const inputDate = moment(date).startOf('day');
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');

  if (inputDate.isSame(today, 'day')) {
    return `Today at ${moment(date).format('h:mm A')}`;
  } else if (inputDate.isSame(yesterday, 'day')) {
    return `Yesterday at ${moment(date).format('h:mm A')}`;
  } else {
    return moment(date).format('MMMM Do [at] h:mm A');
  }
}
