const NormalSchedule = require('./NormalSchedule.js')
const SchoolYear = require('./SchoolYear.js')
const Periods = require('./Periods.js')

class GunnSchedule {
  constructor (apiKey) {
    this.apiKey = apiKey
  }

  year (firstDay, lastDay) {
    return new SchoolYear(this, firstDay, lastDay)
  }
}

GunnSchedule.NormalSchedule = NormalSchedule

module.exports = GunnSchedule
