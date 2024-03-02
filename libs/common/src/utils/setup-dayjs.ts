import baseDayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';

extend(customParseFormat);
extend(duration);
extend(relativeTime);
extend(isBetween);

export const dayjs = baseDayjs;
