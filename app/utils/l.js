import moment from 'moment';

const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const SHORT_FORMAT = 'YYYY-MM-DD HH:mm';
export default function l(time, format) {
  format = format || DEFAULT_FORMAT;
  if (format === 'short') format = SHORT_FORMAT;
  if (time) {
    return moment(time).format(format);
  } else {
    return '';
  }
}
