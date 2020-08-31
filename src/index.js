const { schedule1920, schedule2021 } = require('./NormalSchedule.js')
const SchoolYear = require('./SchoolYear.js')
const Periods = require('./Periods.js')
const Period = require('./Period.js')

class GunnSchedule {
  constructor (apiKey) {
    this.apiKey = apiKey
  }

  year (firstDay, lastDay, options) {
    return new SchoolYear(this, firstDay, lastDay, options)
  }

  static normalSchedule (day) {
    if (schedule1920[day]) {
      return schedule1920[day].map(pd => new Period(pd))
    } else {
      throw new Error('wucky: Only want an integer between 0 and 6 representing a day of the week!')
    }
  }

  static get schedule1920 () {
    return JSON.parse(JSON.stringify(schedule1920))
  }

  static get schedule2021 () {
    return JSON.parse(JSON.stringify(schedule2021))
  }
}

GunnSchedule.Periods = Periods

module.exports = GunnSchedule
