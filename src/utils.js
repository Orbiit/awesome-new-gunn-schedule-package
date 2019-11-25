/**
 * Tries to convert a date into something that this package likes (milliseconds
 * since the epoch JavaScript Dates use representing the date in UTC at 0 hours):
 * If it's a number, it's probably fine to use. If it's a Date, it'll remove the
 * hours/minutes/etc. just in case. If it's a string with a hyphen, it might
 * be a date in YYYY-MM-DD, so it'll convert that to a Date then get its time.
 * Otherwise, perhaps it could be a string version of the number, so it'll just
 * convert it to a number.
 */
function toDate (maybeDate) {
  if (typeof maybeDate === 'number') {
    return maybeDate
  } else if (maybeDate instanceof Date) {
    return new Date(maybeDate.getUTCFullYear(), maybeDate.getUTCMonth(), maybeDate.getUTCDate()).getTime()
  } else if (typeof maybeDate === 'string' && maybeDate.includes('-')) {
    return new Date(maybeDate).getTime()
  } else {
    return +maybeDate
  }
}

module.exports = {
  toDate
}
