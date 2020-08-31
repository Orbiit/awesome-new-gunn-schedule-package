const PASSING_PERIOD_LENGTH = 10
const defaultSelf = 0b111
const newLineRegex = /\r?\n/g

/**
 * The keywords used to filter the likely alternate schedule events in the
 * school's Google Calendar.
 * @type {Array.<string>}
 */
const KEYWORDS = ['self', 'schedule', 'extended', 'holiday', 'no students', 'no school', 'break', 'development']

/**
 * Gunn's time zone offset (PDT during the summer) in hours. This is to convert
 * the UTC date to a local date so the Google Calendar time range is correct.
 * @type {number}
 */
const TIME_ZONE_OFFSET = -7

/**
 * The Google Calendar ID of the calendar with Gunn's schedule events.
 * @type {string}
 */
const CALENDAR_ID = 'u5mgb2vlddfj70d7frf3r015h0@group.calendar.google.com'

module.exports = {
  PASSING_PERIOD_LENGTH,
  defaultSelf,
  newLineRegex,
  KEYWORDS,
  TIME_ZONE_OFFSET,
  CALENDAR_ID
}
