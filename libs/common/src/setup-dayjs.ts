// eslint-disable-next-line no-restricted-imports
import baseDayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';

baseDayjs.extend(customParseFormat);
baseDayjs.extend(duration);
baseDayjs.extend(relativeTime);
baseDayjs.extend(isBetween);

export const dayjs = baseDayjs;
