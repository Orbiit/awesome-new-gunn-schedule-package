const fetch = require('node-fetch')
const {KEYWORDS, TIME_ZONE_OFFSET, CALENDAR_ID} = require('./Constants.js')
const parseFromEvents = require('./Parser.js')

/**
 * Converts a UTC date to the ISO string of the equivalent date in local Gunn
 * time.
 * @param {number} date - The UTC date time to convert
 * @param {boolean} end - Whether the converted date should be at the end
 *   of the day (23:59:59.999); used for inclusive date ranges for getting
 *   events from the Google Calendar API.
 * @returns {string} The ISO string of the local date/time.
 */
function localizeDate (date, end = false) {
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
function simplifyEvents ({items}) {
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

class SchoolYear {
  constructor (gunnSchedule, firstDay, lastDay) {
    this._gunnSchedule = gunnSchedule
    this.firstDay = firstDay
    this.lastDay = lastDay

    this._gCalURLBase = 'https://www.googleapis.com/calendar/v3/calendars/'
      + encodeURIComponent(CALENDAR_ID)
      + '/events?singleEvents=true&fields='
      + encodeURIComponent('items(description,end(date,dateTime),start(date,dateTime),summary)')
      + '&key=' + gunnSchedule.apiKey

    this._alternates = {}
  }

  _fetchEvents (firstDay, lastDay, keyword) {
    return fetch(`${this._gCalURLBase}&timeMin=${
      encodeURIComponent(localizeDate(firstDay, false))
    }&timeMax=${
      encodeURIComponent(localizeDate(lastDay, true))
    }${keyword ? `&q=${keyword}` : ''}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(events => events.map(simplifyEvents))
  }

  update (firstDay, lastDay) {
    if (!lastDay) {
      if (firstDay) {
        lastDay = firstDay
      } else {
        firstDay = this.firstDay
        lastDay = this.lastDay
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
        // Group the elements per day
        const eventsByDay = {}
        for (const event of events) {
          if (!eventsByDay[event.date]) {
            eventsByDay[event.date] = []
          }
          eventsByDay[event.date].push(event)
        }
        for (const [date, events] of Object.entries(eventsByDay)) {
          const alternate = parseFromEvents(events, new Date(date).getUTCDay())
          this._alternates[date] = alternate || null
        }
      })
  }

  get (date) {
    if (date < this.firstDay || date > this.lastDay) {
      return new Day({
        date,
        summer: true
      })
    } else if (this._alternates[date]) {
      return new Day({
        date,
        periods: this._alternates[date],
        alternate: true
      })
    } else {
      return new Day({
        date,
        periods: NormalSchedule[new Date(date).getUTCDay()]
      })
    }
  }
}

module.exports = SchoolYear
