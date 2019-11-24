const fetch = require('node-fetch')
const {KEYWORDS, TIME_ZONE_OFFSET, CALENDAR_ID} = require('./Constants.js')

class SchoolYear {
  constructor (gunnSchedule, firstDay, lastDay) {
    this._gunnSchedule = gunnSchedule
    this._firstDay = firstDay
    this._lastDay = lastDay

    this._gCalURLBase = 'https://www.googleapis.com/calendar/v3/calendars/'
      + encodeURIComponent(CALENDAR_ID)
      + '/events?singleEvents=true&fields='
      + encodeURIComponent('items(description,end(date,dateTime),start(date,dateTime),summary)')
      + '&key=' + gunnSchedule.apiKey

    this._alternates = {}
  }

  /**
   * Converts a UTC date to the ISO string of the equivalent date in local Gunn
   * time.
   * @param {number} date - The UTC date time to convert
   * @param {boolean} end - Whether the converted date should be at the end
   *   of the day (23:59:59.999); used for inclusive date ranges for getting
   *   events from the Google Calendar API.
   * @returns {string} The ISO string of the local date/time.
   */
  static localizeDate (date, end = false) {
    const offset = (TIME_ZONE_OFFSET + (end ? 24 : 0)) * 60 * 60 * 1000
      - (end ? 1 : 0)
    return new Date(offset).toISOString()
  }

  /**
   * Converts event objects from the Google Calendar API to a more easily
   * digestable object for parsing. See the two object type definitions:
   * https://github.com/Orbiit/ugwisha/blob/5ca671e928c86d5d938c314485c3bbe107eccb38/js/events.js#L134-L155
   * Difference: the `date` property will be a number representing the UTC date
   * time.
   * @param {Array.<GoogleEvent>} events.items - The event objects from the API.
   * @returns {Array.<ParserEvent>} The simpler event objects to digest. Yum!
   */
  static simplifyEvents ({items}) {
    const events = []
    for (const event of items) {
      if (event.start.dateTime) {
        events.push({
          summary: ev.summary,
          description: ev.description,
          date: new Date(ev.start.dateTime.slice(0, 10)).getTime()
        })
      } else {
        // These will be in UTC because that's how Date deals with YYYY-MM-DD
        // dates.
        const dateObj = new Date(ev.start.date)
        const endDate = new Date(ev.end.date).getTime()
        while (dateObj.getTime() < endDate) {
          events.push({
            summary: ev.summary,
            description: ev.description,
            date: dateObj.getTime()
          })
          dateObj.setUTCDate(dateObj.getUTCDate() + 1)
        }
      }
    }
    return events
  }

  _fetchEvents (firstDay, lastDay, keyword) {
    return fetch(`${this._gCalURLBase}&timeMin=${
      encodeURIComponent(SchoolYear.localizeDate(firstDay, false))
    }&timeMax=${
      encodeURIComponent(SchoolYear.localizeDate(lastDay, true))
    }${keyword ? `&q=${keyword}` : ''}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(events => events.map(SchoolYear.simplifyEvents))
  }

  _updateDay (date) {
    //
  }

  update (firstDay, lastDay) {
    if (!lastDay) {
      if (firstDay) {
        lastDay = firstDay
      } else {
        firstDay = this._firstDay
        lastDay = this._lastDay
      }
    }
    return (firstDay === lastDay
      ? this._fetchEvents(firstDay, lastDay)
      // If there are too many events I think Google cuts them off, and pagination
      // is too much work. It also includes a bunch of unnecessary events that
      // we shouldn't bother loading.
      : Promise.all(KEYWORDS.map(keyword => this._fetchEvents(firstDay, lastDay, keyword)))
        .then(arr => [].concat(...arr)))
      .then(events => {
        //
      })
  }
}

module.exports = SchoolYear
