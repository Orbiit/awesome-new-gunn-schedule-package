const NormalSchedule = require('./NormalSchedule.js')
const SchoolYear = require('./SchoolYear.js')
const Periods = require('./Periods.js')
const Period = require('./Period.js')

class GunnSchedule {
  constructor (apiKey) {
    this.apiKey = apiKey
  }

  year (firstDay, lastDay) {
    return new SchoolYear(this, firstDay, lastDay)
  }

  static normalSchedule (day) {
    if (NormalSchedule[day]) {
      return NormalSchedule[day].map(pd => new Period(pd))
    } else {
      throw new Error('wucky: Only want an integer between 0 and 6 representing a day of the week!')
    }
  }
}

GunnSchedule.Periods = Periods

module.exports = GunnSchedule
